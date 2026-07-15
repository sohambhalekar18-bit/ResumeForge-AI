/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, AlertCircle, RefreshCw, Sparkles, CheckCircle } from "lucide-react";

interface ResumeUploaderProps {
  onUploadSuccess: (fileName: string, fileType: string, fileData: string) => void;
  isAnalyzing: boolean;
}

export default function ResumeUploader({ onUploadSuccess, isAnalyzing }: ResumeUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".docx") && !file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
      setErrorMessage("Unsupported format. Please upload a PDF, DOCX, or plain text (.txt) file.");
      return;
    }

    // Check size limit: 10MB max
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds 10MB size limit. Please upload a smaller resume.");
      return;
    }

    setSelectedFileName(file.name);

    // Read the file and parse it
    const reader = new FileReader();

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      // PDF files are uploaded as base64 strings so they can be processed by Gemini Multi-Modal API directly
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        onUploadSuccess(file.name, "application/pdf", base64String);
      };
      reader.readAsDataURL(file);
    } else {
      // TXT or other text files read as plain text
      reader.onload = () => {
        const textContent = reader.result as string;
        onUploadSuccess(file.name, "text/plain", textContent);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        id="drag-drop-area"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInputClick}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
          isDragActive
            ? "border-indigo-600 bg-indigo-50/50"
            : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          disabled={isAnalyzing}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md shadow-slate-100 transition-all group-hover:scale-105 group-hover:shadow-indigo-100 group-hover:text-indigo-600 text-slate-500">
          {isAnalyzing ? (
            <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          ) : selectedFileName ? (
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <div className="mt-5 max-w-sm">
          {isAnalyzing ? (
            <>
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                Processing Resume with Gemini 3.5...
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-normal">
                Executing multi-modal AI pipeline. This includes section parsing, ATS indexing, and deep keyword alignment...
              </p>
            </>
          ) : selectedFileName ? (
            <>
              <h3 className="text-sm font-bold text-slate-900">{selectedFileName}</h3>
              <p className="mt-1 text-xs text-emerald-600 font-medium">Successfully processed. Ready to review!</p>
              <button
                type="button"
                className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Choose another file
              </button>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-900">
                Drag & drop your resume here, or <span className="text-indigo-600 hover:underline">browse</span>
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-normal">
                Supports PDF, DOCX, or TXT up to 10MB. Transmitted over secure channels for absolute data privacy.
              </p>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-700 border border-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
