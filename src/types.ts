/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SectionReview {
  name: string;
  present: boolean;
  score: number;
  feedback: string;
}

export interface GrammarIssue {
  original: string;
  suggestion: string;
  explanation: string;
}

export interface BulletOptimization {
  original: string;
  improved: string;
  benefit: string;
}

export interface ResumeAnalysis {
  score: number;
  atsScore: number;
  summary: string;
  sections: SectionReview[];
  grammar: {
    score: number;
    issues: GrammarIssue[];
  };
  formatting: {
    score: number;
    feedback: string[];
  };
  skills: {
    extracted: string[];
    missingForAts: string[];
    recommendations: string[];
  };
  readability: {
    level: string;
    score: number;
    feedback: string;
  };
  bulletOptimization: BulletOptimization[];
}

export interface JobMatchResult {
  matchScore: number;
  keywordMatch: number;
  skillGap: string[];
  experienceGap: string;
  suggestions: string[];
}

export interface CoverLetterResult {
  letter: string;
  salientPoints: string[];
}

export interface InterviewPrepResult {
  questions: {
    question: string;
    expectedAnswer: string;
    tips: string;
  }[];
  roadmap: {
    phase: string;
    actions: string[];
    timeline: string;
  }[];
}

export interface SavedAnalysis {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  analysis: ResumeAnalysis;
  jobMatch?: {
    jobTitle: string;
    result: JobMatchResult;
  };
  coverLetter?: CoverLetterResult;
  interviewPrep?: InterviewPrepResult;
}
