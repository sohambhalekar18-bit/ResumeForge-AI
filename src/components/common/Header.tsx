/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Activity,
  Award,
  Briefcase,
  FileText,
  Globe,
  GraduationCap,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "../../assets/logo.png";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasData: boolean;
}

export default function Header({
  activeTab,
  setActiveTab,
  hasData,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Activity,
    },
    {
      id: "analyzer",
      label: "Resume Audit",
      icon: FileText,
      badge: "AI",
    },
    {
      id: "matcher",
      label: "Job Match",
      icon: Briefcase,
      disabled: !hasData,
    },
    {
      id: "coverletter",
      label: "Cover Letter",
      icon: Award,
      disabled: !hasData,
    },
    {
      id: "interview",
      label: "Career Coach",
      icon: GraduationCap,
      disabled: !hasData,
    },
    {
      id: "seo",
      label: "SEO Hub",
      icon: Globe,
    },
    {
      id: "admin",
      label: "Admin Panel",
      icon: Shield,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <motion.div
          className="flex cursor-pointer items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveTab("dashboard");
            setMobileMenuOpen(false);
          }}
        >
          <div className="h-12 w-12 overflow-hidden rounded-xl">
            <img
              src={logo}
              alt="ResumeForge AI"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex items-center">
            <span className="text-lg font-bold text-slate-900">
              Resume
            </span>

            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-lg font-extrabold text-transparent">
              Forge
            </span>

            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
              AI
            </span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  item.disabled
                    ? "cursor-not-allowed opacity-50 text-slate-300"
                    : isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl bg-slate-900"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive
                        ? "text-indigo-400"
                        : "text-slate-500"
                    }`}
                  />

                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-violet-700">
                      {item.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-900">
              Premium
            </span>

            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700">
              ACTIVE
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          >
            <img
              src={logo}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 xl:hidden"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white xl:hidden"
          >
            <div className="space-y-2 p-4">
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
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      item.disabled
                        ? "cursor-not-allowed opacity-50 text-slate-300"
                        : isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-700">
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
