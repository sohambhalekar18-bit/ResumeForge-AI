/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, FileText, Briefcase, Award, GraduationCap, Globe, Shield, Menu, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "../../assets/logo.png";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasData: boolean;
}

export default function Header({ activeTab, setActiveTab, hasData }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "analyzer", label: "Resume Audit", icon: FileText, badge: "AI" },
    { id: "matcher", label: "Job Match", icon: Briefcase, disabled: !hasData },
    { id: "coverletter", label: "Cover Letter", icon: Award, disabled: !hasData },
    { id: "interview", label: "Career Coach", icon: GraduationCap, disabled: !hasData },
    { id: "seo", label: "SEO Hub", icon: Globe },
    { id: "admin", label: "Admin Panel", icon: Shield },
  ];

  return (
    <header id="saas-header" className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo with beautiful hover animation */}
        <motion.div 
          className="flex items-center gap-2.5 cursor-pointer" 
          onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="h-12 w-12 overflow-hidden rounded-xl">
  <img
    src={logo}
    alt="ResumeForge AI"
    className="h-full w-full object-contain"
  />
</div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-display">Resume</span>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-display">Forge</span>
            <span className="ml-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-2xs font-semibold text-indigo-700">AI</span>
          </div>
        </motion.div>

        {/* Desktop Navigation Tabs with Framer Motion indicator */}
        <nav className="hidden xl:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                disabled={item.disabled}
                onClick={() => setActiveTab(item.id)}
                className={`relative group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  item.disabled
                    ? "cursor-not-allowed text-slate-300 opacity-60"
                    : isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 rounded-xl bg-slate-950 shadow-md shadow-slate-950/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${item.disabled ? "text-slate-200" : isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-700"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-md bg-violet-100/80 px-1 py-0.5 text-3xs font-extrabold text-violet-700 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Stats / Profile Area */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-slate-900"></span>
            <span className="text-4xs font-extrabold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">PREMIUM</span>
          </div>
          
          <motion.div 
            className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-md"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <img
  src={logo}
  alt="ResumeForge AI"
  className="h-full w-full object-cover"
/>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="space-y-1.5 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={item.disabled}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      item.disabled
                        ? "cursor-not-allowed text-slate-300 opacity-50"
                        : isActive
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-3xs font-extrabold text-violet-700 uppercase">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="space-y-1.5 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    disabled={item.disabled}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      item.disabled
                        ? "cursor-not-allowed text-slate-300 opacity-50"
                        : isActive
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-violet-100 px-1.5 py-0.5 text-3xs font-extrabold text-violet-700 uppercase">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

