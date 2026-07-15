# CV Insight — AI Resume Analyzer & ATS Optimizer SaaS v2.0

CV Insight is an enterprise-grade SaaS application that leverages the power of Gemini 3.5 multi-modal models to parse, review, grade, and tailor professional resumes.

Featuring standard formatting compliance checklists, interactive 3D scorecard gauges, a metric-driven STAR-framework bullet point optimizer, direct job matches, automatic cover letter creators, interview prep coaches, SEO dashboards, and full live system admin logs.

## 🌟 Key Features

1. **Interactive 3D Scorecard**: Dynamically tilts on mouse hover/drag to represent the comprehensive resume score using smooth vector arcs and spring-based animations.
2. **Executive AI Reviews**: Instantly extracts core competencies and indexes the resume.
3. **STAR Bullet Optimizer**: Identifies weak resume entries and suggests upgraded versions highlighting action-verbs and metric improvements.
4. **ATS Alignment Scan**: Scans resumes against live target job descriptions to analyze keyword density, skill gaps, and custom suggestions.
5. **Cover Letter Pitch Generator**: Craft beautiful, custom pitches matching the resume experience to job descriptions with specific behavioral options.
6. **Career & Prep Guide**: Provides tailored tough behavioral practice questions with STAR-model answers and detailed professional roadmaps.
7. **SEO Hub & Console**: Check structured JSON-LD schemas, robots.txt, sitemaps, and interactive social preview cards.
8. **Admin Panel**: Examine real-time server logs, adjust model configurations, check engine latencies, and debug telemetry.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Framer Motion (integrated via `motion/react`), Tailwind CSS, Lucide icons.
- **Backend**: Node.js Express, TypeScript, `@google/genai` SDK.
- **Packaging/Build**: CJS Bundler via `esbuild` for maximum container cold-start performance.

---

## 💻 How to Run in VS Code and Locally

You can run CV Insight seamlessly on your local machine using standard terminal commands and VS Code.

### 1. Prerequisites
Ensure you have **Node.js (v18 or newer)** installed:
```bash
node -v
```

### 2. Open in VS Code
Open VS Code, select **File > Open Folder**, and choose the directory of this project.

### 3. Setup Secrets & API Keys
1. Duplicate `.env.example` to create a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in VS Code and paste your **Gemini API Key**:
   ```env
   GEMINI_API_KEY="your-actual-api-key-here"
   APP_URL="http://localhost:3000"
   ```

### 4. Install Dependencies
Open the VS Code Terminal (`Ctrl + ~` or ``Ctrl + ` ``) and run:
```bash
npm install
```

### 5. Start Development Mode
To boot up both the Express server and Vite frontend middleware:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience the application!

---

## 🐳 Running Outside Google AI Studio (Production Build)

To build and compile the application for any generic cloud provider, virtual machine, or Docker container:

### Compile the Bundle
```bash
npm run build
```
This produces:
- A high-performance static client-side bundle in `dist/`
- A single, optimized, bundled backend script at `dist/server.cjs`

### Start Production Server
```bash
npm run start
```
The server will boot on port `3000` under production conditions.
