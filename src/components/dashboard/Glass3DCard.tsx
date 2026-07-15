/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Sparkles, Star, Target, ShieldCheck } from "lucide-react";

interface Glass3DCardProps {
  score: number;
  fileName: string;
}

export default function Glass3DCard({ score, fileName }: Glass3DCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  const badgeText = score >= 80 ? "EXCELLENT" : score >= 60 ? "RECOMMENDED" : "OPTIMIZATION NEEDED";
  const badgeColor = score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20";

  return (
    <div 
      className="relative flex items-center justify-center p-4 [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-indigo-950/90 p-8 shadow-2xl backdrop-blur-2xl transition-shadow duration-300"
        animate={{
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(99, 102, 241, 0.35), 0 0 20px 2px rgba(139, 92, 246, 0.15)" 
            : "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Glow behind card */}
        <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-75" />

        {/* Card header */}
        <div style={{ transform: "translateZ(30px)" }} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-4xs font-black tracking-widest ${badgeColor}`}>
              {badgeText}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
          </div>
        </div>

        {/* 3D Gauge Circle */}
        <div className="my-8 flex flex-col items-center justify-center" style={{ transform: "translateZ(50px)" }}>
          <div className="relative flex h-40 w-40 items-center justify-center">
            {/* Inner background glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-600/10 to-violet-600/10 blur-xl" />

            <svg className="absolute transform -rotate-90 w-full h-full">
              {/* Secondary background track circle */}
              <circle cx="80" cy="80" r="68" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="10" fill="transparent" />
              <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeDasharray="4, 4" fill="transparent" />
              {/* Main colored gauge */}
              <motion.circle
                cx="80"
                cy="80"
                r="68"
                stroke="url(#purpleGrad)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 68}
                initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - score / 100) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Text inside Circle */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-white font-display bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                {score}
              </span>
              <span className="text-4xs font-bold uppercase tracking-widest text-indigo-300 mt-0.5">SCORE</span>
            </div>
          </div>
        </div>

        {/* Resume Title Area */}
        <div style={{ transform: "translateZ(20px)" }} className="space-y-2 mt-4 text-center">
          <p className="text-xs font-semibold text-slate-400 font-mono truncate max-w-[280px] mx-auto">
            {fileName}
          </p>
          <p className="text-4xs text-slate-500 uppercase tracking-wider font-bold">
            Parsed with Multi-modal Intelligence
          </p>
        </div>

        {/* Tech Accents / Info grid */}
        <div 
          style={{ transform: "translateZ(25px)" }} 
          className="mt-6 grid grid-cols-3 gap-3 border-t border-white/5 pt-5 text-center"
        >
          <div className="space-y-1">
            <span className="block text-4xs font-bold text-slate-500 uppercase tracking-wider">Type</span>
            <span className="block text-3xs font-extrabold text-white">PDF / DOCX</span>
          </div>
          <div className="space-y-1 border-x border-white/5">
            <span className="block text-4xs font-bold text-slate-500 uppercase tracking-wider">Parser</span>
            <span className="block text-3xs font-extrabold text-indigo-400">Gemini 3.5</span>
          </div>
          <div className="space-y-1">
            <span className="block text-4xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
            <span className="block text-3xs font-extrabold text-emerald-400">Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
