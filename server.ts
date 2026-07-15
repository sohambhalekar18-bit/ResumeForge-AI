/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsing with high limit to accommodate base64 files
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazy initialize Gemini AI client safely
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ---------------------------------------------------------------------
// 1. API Endpoint: Analyze Resume
// ---------------------------------------------------------------------
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { fileName, fileType, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "Missing file data for analysis" });
    }

    const ai = getGeminiClient();

    let contentPart: any;
    if (fileType === "application/pdf") {
      // Pass PDF directly as document inlineData
      contentPart = {
        inlineData: {
          mimeType: "application/pdf",
          data: fileData, // Base64 string
        },
      };
    } else {
      // For TXT and others, treat as text
      contentPart = {
        text: fileData, // Plain text or decoded text
      };
    }

    const systemInstruction = `You are a world-class executive recruiter, professional resume writer, and ATS optimization expert.
Analyze the provided resume and return a highly detailed, professional, commercial-grade resume analysis in JSON format.
Ensure your scores are realistic, actionable, and strictly conform to the expected schema.
For grammar analysis, find actual or potential issues. If none, return an empty array but maintain a high grammar score.
For bullet optimization, find at least 3 bullet points that can be improved with active verbs, metrics, or achievements.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Overall Resume Score out of 100" },
        atsScore: { type: Type.INTEGER, description: "ATS Parser Compatibility Score out of 100" },
        summary: { type: Type.STRING, description: "Professional summary of resume strengths and weaknesses" },
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              present: { type: Type.BOOLEAN },
              score: { type: Type.INTEGER },
              feedback: { type: Type.STRING }
            },
            required: ["name", "present", "score", "feedback"]
          }
        },
        grammar: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["original", "suggestion", "explanation"]
              }
            }
          },
          required: ["score", "issues"]
        },
        formatting: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "feedback"]
        },
        skills: {
          type: Type.OBJECT,
          properties: {
            extracted: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingForAts: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["extracted", "missingForAts", "recommendations"]
        },
        readability: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["level", "score", "feedback"]
        },
        bulletOptimization: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING, description: "Original weak bullet point" },
              improved: { type: Type.STRING, description: "Improved high-impact bullet point with metrics and active verbs" },
              benefit: { type: Type.STRING, description: "Why this change is better" }
            },
            required: ["original", "improved", "benefit"]
          }
        }
      },
      required: [
        "score",
        "atsScore",
        "summary",
        "sections",
        "grammar",
        "formatting",
        "skills",
        "readability",
        "bulletOptimization"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        contentPart,
        { text: "Analyze this resume thoroughly and provide the output schema." }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response content generated from Gemini AI.");
    }

    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: error.message || "An error occurred during resume analysis." });
  }
});

// ---------------------------------------------------------------------
// 2. API Endpoint: Match Job Description
// ---------------------------------------------------------------------
app.post("/api/match-job", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing resume content or job description" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert HR Manager and ATS Optimizer. Compare the provided resume content against the job description.
Assess alignment, calculate scores, find specific keyword gaps, and provide actionable tips.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        matchScore: { type: Type.INTEGER, description: "Overall matching score out of 100" },
        keywordMatch: { type: Type.INTEGER, description: "Keyword density match out of 100" },
        skillGap: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills requested in job description but missing in resume" },
        experienceGap: { type: Type.STRING, description: "Detailed comparison of experience levels" },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific steps to optimize the resume for this job" }
      },
      required: ["matchScore", "keywordMatch", "skillGap", "experienceGap", "suggestions"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response content generated from Gemini AI.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error matching job:", error);
    res.status(500).json({ error: error.message || "An error occurred during job matching." });
  }
});

// ---------------------------------------------------------------------
// 3. API Endpoint: Generate Cover Letter
// ---------------------------------------------------------------------
app.post("/api/generate-cover-letter", async (req, res) => {
  try {
    const { resumeText, jobDescription, customInstructions } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing resume content or job description" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert copywriter. Generate a highly persuasive, customized, professional cover letter matching the candidate's resume to the job description.
Use custom instructions if provided (e.g. tone, focus areas). Do not include placeholders like [Insert Date] — generate clean default text where necessary.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        letter: { type: Type.STRING, description: "The full cover letter formatted elegantly with line breaks" },
        salientPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key value-propositions highlighted in the letter" }
      },
      required: ["letter", "salientPoints"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCUSTOM INSTRUCTIONS:\n${customInstructions || "None"}` }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response content generated from Gemini AI.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ error: error.message || "An error occurred during cover letter generation." });
  }
});

// ---------------------------------------------------------------------
// 4. API Endpoint: Generate Interview Prep
// ---------------------------------------------------------------------
app.post("/api/generate-interview-prep", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Missing resume content for interview prep" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a high-level Career Coach. Analyze the resume and optional job description.
Generate a tailored preparation bundle containing specific tough behavioral and technical interview questions, recommended model answers, expert tips, and a career roadmap.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              expectedAnswer: { type: Type.STRING, description: "STAR method model answer tailored to their experience" },
              tips: { type: Type.STRING, description: "What the interviewer is looking for" }
            },
            required: ["question", "expectedAnswer", "tips"]
          }
        },
        roadmap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phase: { type: Type.STRING },
              actions: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeline: { type: Type.STRING }
            },
            required: ["phase", "actions", "timeline"]
          }
        }
      },
      required: ["questions", "roadmap"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription || "None provided"}` }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response content generated from Gemini AI.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating interview prep:", error);
    res.status(500).json({ error: error.message || "An error occurred during interview prep generation." });
  }
});

// ---------------------------------------------------------------------
// Vite / Static Files Middleware setup
// ---------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Resume Analyzer SaaS running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
