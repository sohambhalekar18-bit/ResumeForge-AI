/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, ShieldAlert, Sparkles, Zap, TrendingUp, CheckCircle } from "lucide-react";

interface StatCardsProps {
  score: number;
  atsScore: number;
  grammarScore: number;
  formattingScore: number;
}

export default function StatCards({ score, atsScore, grammarScore, formattingScore }: StatCardsProps) {
  const stats = [
    {
      id: "stat-score",
      label: "Overall Score",
      value: `${score}/100`,
      icon: Award,
      color: "from-indigo-600 to-violet-600",
      bg: "bg-indigo-50",
      textColor: "text-indigo-600",
      description: "Aggregated score of all metrics",
      progress: score,
    },
    {
      id: "stat-ats",
      label: "ATS Parser Score",
      value: `${atsScore}%`,
      icon: Zap,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      textColor: "text-amber-600",
      description: "Applicant tracking system friendliness",
      progress: atsScore,
    },
    {
      id: "stat-grammar",
      label: "Grammar & Style",
      value: `${grammarScore}%`,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      textColor: "text-emerald-600",
      description: "Spelling, syntax & active verbs",
      progress: grammarScore,
    },
    {
      id: "stat-formatting",
      label: "Formatting & Depth",
      value: `${formattingScore}%`,
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      textColor: "text-blue-600",
      description: "Structure, readability & sections",
      progress: formattingScore,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            id={stat.id}
            key={stat.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.textColor} transition-all group-hover:scale-110`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>

            {/* Micro progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-2xs font-bold text-slate-500 mb-1">
                <span>Optimization level</span>
                <span className="flex items-center gap-0.5 text-indigo-600">
                  <TrendingUp className="h-3 w-3" />
                  {stat.progress >= 80 ? "Excellent" : stat.progress >= 60 ? "Good" : "Needs Review"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>

            <p className="mt-2.5 text-3xs text-slate-500 leading-normal">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
