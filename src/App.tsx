/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  FileText,
  Briefcase,
  Award,
  GraduationCap,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Header from "./components/common/Header";
import StatCards from "./components/dashboard/StatCards";
import ResumeUploader from "./components/dashboard/ResumeUploader";
import Glass3DCard from "./components/dashboard/Glass3DCard";
import SeoHub from "./components/seo/SeoHub";
import AdminPanel from "./components/admin/AdminPanel";
import { motion, AnimatePresence } from "motion/react";
import { ResumeAnalysis, JobMatchResult, CoverLetterResult, InterviewPrepResult, SavedAnalysis } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Active Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeResumeText, setActiveResumeText] = useState<string>("");

  // Job Match State
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>("");

  // Cover Letter State
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState<boolean>(false);
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);

  // Interview Prep State
  const [isGeneratingPrep, setIsGeneratingPrep] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cv_insight_analyses");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedAnalyses(parsed);
        if (parsed.length > 0) {
          setActiveId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save to local storage when savedAnalyses changes
  const saveToLocalStorage = (list: SavedAnalysis[]) => {
    localStorage.setItem("cv_insight_analyses", JSON.stringify(list));
  };

  const getActiveRecord = (): SavedAnalysis | null => {
    return savedAnalyses.find((a) => a.id === activeId) || null;
  };

  const handleResumeUploaded = async (fileName: string, fileType: string, fileData: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, fileType, fileData }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze resume. Please check your Gemini API configuration.");
      }

      const data: ResumeAnalysis = await response.json();

      // Create a plain text version for downstream prompts
      let plainTextForAI = fileData;
      if (fileType === "application/pdf") {
        // PDF contains base64, so construct standard representation
        plainTextForAI = `Uploaded resume file: ${fileName}\n` +
          `AI Extracted Core Summary: ${data.summary}\n` +
          `Extracted Skills: ${data.skills.extracted.join(", ")}\n` +
          `Ats missing keywords: ${data.skills.missingForAts.join(", ")}\n`;
      }
      setActiveResumeText(plainTextForAI);

      // Create saved record
      const newRecord: SavedAnalysis = {
        id: crypto.randomUUID(),
        fileName,
        fileSize: "PDF / Document",
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        analysis: data,
      };

      const updated = [newRecord, ...savedAnalyses];
      setSavedAnalyses(updated);
      setActiveId(newRecord.id);
      saveToLocalStorage(updated);
      setActiveTab("dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while calling the server analysis endpoint.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteAnalysis = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAnalyses.filter((item) => item.id !== id);
    setSavedAnalyses(updated);
    saveToLocalStorage(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleRunJobMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeRecord = getActiveRecord();
    if (!activeRecord) return;

    setIsMatching(true);
    try {
      const response = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: activeResumeText || activeRecord.analysis.summary,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to align resume with job description.");
      }

      const matchData: JobMatchResult = await response.json();

      const updated = savedAnalyses.map((item) => {
        if (item.id === activeId) {
          return {
            ...item,
            jobMatch: {
              jobTitle: jobTitle || "Target Role",
              result: matchData,
            },
          };
        }
        return item;
      });

      setSavedAnalyses(updated);
      saveToLocalStorage(updated);
    } catch (error: any) {
      alert(error.message || "Failed to process job alignment.");
    } finally {
      setIsMatching(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    const activeRecord = getActiveRecord();
    if (!activeRecord) return;

    setIsGeneratingLetter(true);
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: activeResumeText || activeRecord.analysis.summary,
          jobDescription: jobDescription || "Default Target Professional Job Description",
          customInstructions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter.");
      }

      const clData: CoverLetterResult = await response.json();

      const updated = savedAnalyses.map((item) => {
        if (item.id === activeId) {
          return {
            ...item,
            coverLetter: clData,
          };
        }
        return item;
      });

      setSavedAnalyses(updated);
      saveToLocalStorage(updated);
    } catch (error: any) {
      alert(error.message || "Failed to generate Cover Letter.");
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    const activeRecord = getActiveRecord();
    if (!activeRecord) return;

    setIsGeneratingPrep(true);
    try {
      const response = await fetch("/api/generate-interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: activeResumeText || activeRecord.analysis.summary,
          jobDescription: jobDescription || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate interview preparation questions.");
      }

      const prepData: InterviewPrepResult = await response.json();

      const updated = savedAnalyses.map((item) => {
        if (item.id === activeId) {
          return {
            ...item,
            interviewPrep: prepData,
          };
        }
        return item;
      });

      setSavedAnalyses(updated);
      saveToLocalStorage(updated);
    } catch (error: any) {
      alert(error.message || "Failed to generate interview guide.");
    } finally {
      setIsGeneratingPrep(false);
    }
  };

  const handleCopyLetter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const activeRecord = getActiveRecord();

  return (
    <div id="saas-app" className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} hasData={!!activeRecord} />

      {/* Main SaaS Layout */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar (Resume upload or listing) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Active CV workspace
              </h3>

              {savedAnalyses.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No resumes parsed yet
                </div>
              ) : (
                <div className="space-y-2">
                  {savedAnalyses.map((item) => (
                    <div
                      id={`workspace-item-${item.id}`}
                      key={item.id}
                      onClick={() => {
                        setActiveId(item.id);
                        setActiveTab("dashboard");
                      }}
                      className={`group flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all border ${
                        activeId === item.id
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 border-transparent text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className={`h-4.5 w-4.5 shrink-0 ${activeId === item.id ? "text-indigo-400" : "text-slate-500"}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">{item.fileName}</p>
                          <p className={`text-4xs uppercase tracking-wider mt-0.5 ${activeId === item.id ? "text-indigo-200" : "text-slate-400"}`}>
                            {item.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteAnalysis(item.id, e)}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all ${
                          activeId === item.id
                            ? "hover:bg-slate-800 text-slate-400 hover:text-red-400"
                            : "hover:bg-slate-200 text-slate-400 hover:text-red-600"
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {savedAnalyses.length > 0 && (
                <button
                  onClick={() => {
                    setActiveId(null);
                    setActiveTab("dashboard");
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Analyze New Resume
                </button>
              )}
            </div>

            {/* Premium Guide Segment */}
            <div className="rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 p-5 text-white shadow-lg shadow-indigo-950/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold">ATS Optimization Tip</h4>
              <p className="mt-2 text-xs text-indigo-200 leading-normal">
                Modern applicant tracking systems rank candidates by exact keyword matches. Customize your resume skills for each specific target position.
              </p>
            </div>
          </div>

          {/* Right Work Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* If no workspace record is selected, prompt uploader */}
            {!activeRecord ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <div className="max-w-2xl mx-auto space-y-6 py-6">
                  <div className="text-center">
                    <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-2xs font-semibold text-indigo-700">
                      Enterprise-Grade Parsing Pipeline
                    </span>
                    <h2 className="mt-3.5 text-3xl font-extrabold tracking-tight text-slate-900">
                      Optimize Your Professional Profile
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto leading-normal">
                      Instantly index your resume with native document multi-modality to audit layout compliance, score grammar, extract skills, and match job descriptions.
                    </p>
                  </div>

                  <ResumeUploader onUploadSuccess={handleResumeUploaded} isAnalyzing={isAnalyzing} />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <ClipboardCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">100% Secure</h4>
                        <p className="text-4xs text-slate-500 mt-0.5 leading-relaxed">Encrypted data delivery with full client storage sovereignty.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Gemini 3.5 Driven</h4>
                        <p className="text-4xs text-slate-500 mt-0.5 leading-relaxed">State-of-the-art career analysis powered by Gemini API.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Full ATS Insight</h4>
                        <p className="text-4xs text-slate-500 mt-0.5 leading-relaxed">Find missing keywords and skill gaps instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Active Tabs Navigation */}
                <div className="flex border-b border-slate-200/60 overflow-x-auto scrollbar-none gap-2">
                  {[
                    { id: "dashboard", label: "Dashboard" },
                    { id: "analyzer", label: "CV Audit & Optimization" },
                    { id: "matcher", label: "Job Alignment Scan" },
                    { id: "coverletter", label: "Cover Letter Creator" },
                    { id: "interview", label: "Career Coach" },
                    { id: "seo", label: "SEO Hub" },
                    { id: "admin", label: "Admin Panel" }
                  ].map((tab) => (
                    <button
                      id={`tab-btn-${tab.id}`}
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap pb-4 px-4 text-xs font-bold border-b-2 transition-all ${
                        activeTab === tab.id
                          ? "border-indigo-600 text-indigo-600 font-extrabold"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* TAB 1: DASHBOARD OVERVIEW */}
                  {activeTab === "dashboard" && (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* Stat indicators with 3D gauge integration */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {/* 3D Gauge Card column */}
                        <div className="lg:col-span-1 flex flex-col justify-center bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center pt-2">
                            Interactive 3D Scorecard
                          </h4>
                          <Glass3DCard 
                            score={activeRecord.analysis.score} 
                            fileName={activeRecord.fileName} 
                          />
                        </div>

                        {/* Standard Stats summary blocks */}
                        <div className="lg:col-span-2 flex flex-col justify-between">
                          <StatCards
                            score={activeRecord.analysis.score}
                            atsScore={activeRecord.analysis.atsScore}
                            grammarScore={activeRecord.analysis.grammar.score}
                            formattingScore={activeRecord.analysis.formatting.score}
                          />

                          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm mt-6 lg:mt-4 h-full flex flex-col justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4" />
                                Advanced LLM Insights
                              </h3>
                              <p className="mt-3 text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                                {activeRecord.analysis.summary}
                              </p>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Parsed Competencies</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {activeRecord.analysis.skills.extracted.slice(0, 10).map((skill, i) => (
                                  <span
                                    key={i}
                                    className="rounded-lg bg-indigo-50/50 border border-indigo-100/60 px-2.5 py-1 text-2xs font-bold text-indigo-700"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {activeRecord.analysis.skills.extracted.length > 10 && (
                                  <span className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 text-2xs font-bold text-slate-500">
                                    +{activeRecord.analysis.skills.extracted.length - 10} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section compliance row */}
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                          <ClipboardCheck className="h-4.5 w-4.5 text-indigo-600" />
                          ATS Document Compliance Audits
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {activeRecord.analysis.sections.map((sec, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col justify-between">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {sec.present ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 shrink-0 text-amber-500" />
                                  )}
                                  <span className="text-xs font-bold text-slate-800 truncate">{sec.name}</span>
                                </div>
                                <span className={`text-2xs font-extrabold ${sec.score >= 80 ? "text-emerald-600" : sec.score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                                  {sec.score}%
                                </span>
                              </div>
                              <p className="text-3xs text-slate-500 mt-2 leading-relaxed">{sec.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SEO Hub tab integration */}
                  {activeTab === "seo" && (
                    <div key="seo">
                      <SeoHub />
                    </div>
                  )}

                  {/* Admin Panel tab integration */}
                  {activeTab === "admin" && (
                    <div key="admin">
                      <AdminPanel />
                    </div>
                  )}
                </AnimatePresence>

                {/* TAB 2: CV AUDIT & OPTIMIZATION */}
                {activeTab === "analyzer" && (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Bullet Points Optimizer Section */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                        AI Bullet Point Optimizer (STAR Methodology)
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        We scanned your work experience bullet points. Here are high-impact metric-driven upgrades.
                      </p>

                      <div className="mt-6 space-y-4">
                        {activeRecord.analysis.bulletOptimization.map((bullet, i) => (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                            <div>
                              <span className="text-4xs font-bold uppercase tracking-wider text-slate-400">Original Resume Entry</span>
                              <p className="mt-1 text-xs text-slate-500 line-through leading-relaxed">{bullet.original}</p>
                            </div>
                            <div className="border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-4">
                              <span className="text-4xs font-bold uppercase tracking-wider text-emerald-600">Upgraded Metric-Driven Version</span>
                              <p className="mt-1 text-xs text-slate-800 font-medium leading-relaxed">{bullet.improved}</p>
                              <div className="mt-2.5 rounded bg-emerald-50 px-2 py-1 text-3xs font-medium text-emerald-700">
                                <span className="font-bold">ATS Value:</span> {bullet.benefit}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Grammar, Style & Format Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Grammar audit details */}
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900">Grammar & Syntax Audit</h3>
                        {activeRecord.analysis.grammar.issues.length === 0 ? (
                          <div className="mt-6 text-center py-8 bg-emerald-50/40 rounded-xl border border-emerald-100/50 text-emerald-800">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                            <p className="text-xs font-bold">Flawless syntax detected!</p>
                            <p className="text-3xs text-slate-500 mt-1">We found zero grammatical issues on your active resume.</p>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-3">
                            {activeRecord.analysis.grammar.issues.map((issue, i) => (
                              <div key={i} className="p-3 bg-red-50/40 border border-red-100/50 rounded-xl">
                                <div className="flex items-center justify-between">
                                  <span className="text-3xs text-red-600 line-through font-medium truncate max-w-[150px]">"{issue.original}"</span>
                                  <span className="text-2xs font-extrabold text-emerald-600">→ "{issue.suggestion}"</span>
                                </div>
                                <p className="text-3xs text-slate-500 mt-1">{issue.explanation}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Formatting & Depth Check */}
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900">Layout & Readability Metrics</h3>
                        
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-700">Readability Level:</span>
                            <span className="text-indigo-600">{activeRecord.analysis.readability.level}</span>
                          </div>
                          <p className="text-3xs text-slate-500 mt-1.5 leading-relaxed">
                            {activeRecord.analysis.readability.feedback}
                          </p>
                        </div>

                        <div className="mt-5 space-y-2.5">
                          <h4 className="text-xs font-bold text-slate-700">Styling & Structural Tips</h4>
                          {activeRecord.analysis.formatting.feedback.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 p-2 rounded-lg hover:bg-slate-50">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500 text-3xs font-extrabold">
                                {i + 1}
                              </span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 3: JOB ALIGNMENT SCAN */}
                {activeTab === "matcher" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900">Scan Against Specific Job Description</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Paste the target job details to perform direct keyword density, skill-gap audit, and ATS comparison.
                      </p>

                      <form onSubmit={handleRunJobMatch} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Job Title</label>
                            <input
                              type="text"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              placeholder="e.g. Senior React Developer"
                              required
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Company (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. Google Cloud Services"
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Job Description Text</label>
                          <textarea
                            rows={6}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the raw requirements list or role details from the job board..."
                            required
                            className="w-full rounded-xl border border-slate-200 p-4 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isMatching}
                          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-bold text-white transition-all shadow-sm"
                        >
                          {isMatching ? (
                            <>
                              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                              Running ATS alignment scan...
                            </>
                          ) : (
                            <>
                              <Search className="h-4.5 w-4.5" />
                              Scan Alignment & Match Score
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Match Results Display */}
                    {activeRecord.jobMatch && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        
                        {/* Match Meter Card */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">ATS Fit For: {activeRecord.jobMatch.jobTitle}</h4>
                          <div className="relative flex items-center justify-center h-36 w-36">
                            <svg className="absolute transform -rotate-90 w-full h-full">
                              <circle cx="72" cy="72" r="62" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                              <circle
                                cx="72"
                                cy="72"
                                r="62"
                                stroke="#4f46e5"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 62}
                                strokeDashoffset={2 * Math.PI * 62 * (1 - activeRecord.jobMatch.result.matchScore / 100)}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="text-3xl font-extrabold text-slate-900">{activeRecord.jobMatch.result.matchScore}%</span>
                          </div>
                          <div className="mt-4 flex gap-4 text-xs font-bold">
                            <span className="text-indigo-600">Keyword density: {activeRecord.jobMatch.result.keywordMatch}%</span>
                          </div>
                        </div>

                        {/* Skill Gap List */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Identified Skill Gaps</h4>
                          {activeRecord.jobMatch.result.skillGap.length === 0 ? (
                            <div className="text-center py-8 text-emerald-600 font-bold text-xs bg-emerald-50 rounded-xl">
                              Perfect match! No gaps found.
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {activeRecord.jobMatch.result.skillGap.map((skill, i) => (
                                <span key={i} className="rounded-md bg-red-50 border border-red-100 px-2 py-0.5 text-2xs font-medium text-red-700">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <h5 className="text-xs font-bold text-slate-700 mb-1.5">Experience Alignment Audit</h5>
                            <p className="text-3xs text-slate-500 leading-normal">{activeRecord.jobMatch.result.experienceGap}</p>
                          </div>
                        </div>

                        {/* Recommended Improvements */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Tailoring Suggestions</h4>
                          <div className="space-y-2.5">
                            {activeRecord.jobMatch.result.suggestions.map((sug, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                                <ChevronRight className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                                <span>{sug}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: COVER LETTER CREATOR */}
                {activeTab === "coverletter" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900">Custom Cover Letter Generator</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Use Gemini AI to construct a flawless cover letter tailored with your experience and the target job requirements.
                      </p>

                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Custom Instructions (Optional)</label>
                          <input
                            type="text"
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="e.g. Focus heavily on my React Native work, keep it under 300 words, enthusiastic tone..."
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={handleGenerateCoverLetter}
                          disabled={isGeneratingLetter}
                          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-bold text-white transition-all shadow-sm"
                        >
                          {isGeneratingLetter ? (
                            <>
                              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                              Generating perfect pitch...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4.5 w-4.5" />
                              Compose Cover Letter
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Result Cover Letter */}
                    {activeRecord.coverLetter && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        
                        {/* Letter Content */}
                        <div className="md:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm relative">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800">Generated Cover Letter</h4>
                            <button
                              onClick={() => handleCopyLetter(activeRecord.coverLetter!.letter)}
                              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-2xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              {copiedLetter ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy to Clipboard
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-[500px] overflow-y-auto">
                            {activeRecord.coverLetter.letter}
                          </div>
                        </div>

                        {/* Value Highlights */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Salient Highlights Included</h4>
                          <div className="space-y-3">
                            {activeRecord.coverLetter.salientPoints.map((pt, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: CAREER & INTERVIEW COACH */}
                {activeTab === "interview" && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900">Personal Career Preparation Guide</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Synthesize customized interview questions using the STAR framework tailored specifically to your history and target jobs.
                      </p>

                      <div className="mt-5">
                        <button
                          onClick={handleGenerateInterviewPrep}
                          disabled={isGeneratingPrep}
                          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-bold text-white transition-all shadow-sm"
                        >
                          {isGeneratingPrep ? (
                            <>
                              <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                              Coaching prep underway...
                            </>
                          ) : (
                            <>
                              <GraduationCap className="h-4.5 w-4.5" />
                              Generate Coaching Bundle
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Results of Interview Guide */}
                    {activeRecord.interviewPrep && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        
                        {/* Tough Behavioral Questions */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                          <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Behavioral & Technical Practice Questions</h4>
                          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
                            {activeRecord.interviewPrep.questions.map((q, i) => (
                              <div key={i} className="space-y-2 border-b border-slate-100 pb-4 last:border-0">
                                <h5 className="text-xs font-bold text-slate-900 flex gap-1.5">
                                  <span className="text-indigo-600">Q{i + 1}:</span>
                                  {q.question}
                                </h5>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <span className="text-4xs font-bold uppercase tracking-wider text-slate-400">STAR Model Answer</span>
                                  <p className="text-3xs text-slate-600 mt-1 leading-relaxed">{q.expectedAnswer}</p>
                                </div>
                                <p className="text-4xs text-indigo-700 italic leading-normal">
                                  <span className="font-bold">Coach's Secret:</span> {q.tips}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Learning Roadmap */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                          <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Professional Roadmap</h4>
                          <div className="space-y-4">
                            {activeRecord.interviewPrep.roadmap.map((phase, i) => (
                              <div key={i} className="relative flex gap-4 items-start">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-3xs font-bold border border-indigo-100">
                                  {i + 1}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold text-slate-900">{phase.phase}</h5>
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-4xs font-bold text-slate-500">
                                      {phase.timeline}
                                    </span>
                                  </div>
                                  <ul className="list-disc pl-4 space-y-1 text-3xs text-slate-500">
                                    {phase.actions.map((act, idx) => (
                                      <li key={idx}>{act}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
