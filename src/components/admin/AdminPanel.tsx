/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Shield, Settings, Server, RefreshCw, Terminal, Activity, CheckCircle, Database } from "lucide-react";
import { motion } from "motion/react";

interface LogMessage {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"logs" | "settings">("logs");
  const [modelSelector, setModelSelector] = useState<string>("gemini-3.5-flash");
  const [allowTelemetry, setAllowTelemetry] = useState<boolean>(true);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Hardcoded default logs
  const initialLogs: LogMessage[] = [
    { timestamp: "00:47:31", level: "INFO", service: "SYS", message: "Server initialized on port 3000 successfully." },
    { timestamp: "00:47:35", level: "INFO", service: "GEMINI", message: "API handshake completed. Handled credentials safely from User Secrets." },
    { timestamp: "00:48:12", level: "INFO", service: "PARSER", message: "Successfully extracted sections from sample resume." },
    { timestamp: "00:52:19", level: "INFO", service: "ATS", message: "Alignment audit processed for Senior Fullstack Engineer requirements." },
    { timestamp: "00:54:58", level: "WARN", service: "DB", message: "Local memory footprint peaked at 24.5MB. Automatic heap collection scheduled." },
  ];

  useEffect(() => {
    setLogs(initialLogs);
  }, []);

  const triggerLogAdd = () => {
    setRefreshing(true);
    setTimeout(() => {
      const services = ["SYS", "GEMINI", "PARSER", "ATS", "DB", "AUTH"];
      const messages = [
        "Client websocket heartbeat acknowledged.",
        "Parsed 24 structural keys during PDF vector extract.",
        "Optimized STAR bullet points generated in 820ms.",
        "Secure cookie handshake accepted from client agent.",
        "Garbage collection executed successfully: cleaned 14.2MB heap."
      ];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date().toLocaleTimeString("en-US", { hour12: false });
      
      const newLog: LogMessage = {
        timestamp: now,
        level: "INFO",
        service: randomService,
        message: randomMsg
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 8)]);
      setRefreshing(false);
    }, 400);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">System Administrator Panel</h3>
              <p className="text-3xs text-slate-500 mt-0.5">Manage model endpoints, examine real-time system logs, and inspect server statistics.</p>
            </div>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 self-start">
            <button
              onClick={() => setActiveTab("logs")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "logs" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              Live Logs
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "settings" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              System Config
            </button>
          </div>
        </div>

        {activeTab === "logs" && (
          <div className="mt-6 space-y-6">
            {/* System Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex items-center gap-3">
                <Server className="h-5 w-5 text-indigo-600" />
                <div>
                  <span className="block text-4xs font-bold text-slate-400 uppercase">Production Server</span>
                  <span className="block text-xs font-bold text-slate-800">0.0.0.0:3000 (Express)</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex items-center gap-3">
                <Activity className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="block text-4xs font-bold text-slate-400 uppercase">Engine Latency</span>
                  <span className="block text-xs font-bold text-slate-800">14ms (Optimal)</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex items-center gap-3">
                <Database className="h-5 w-5 text-amber-500" />
                <div>
                  <span className="block text-4xs font-bold text-slate-400 uppercase">Database Health</span>
                  <span className="block text-xs font-bold text-slate-800">Connected (SQLite/Sovereign)</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Terminal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4 w-4" />
                  Standard System Streams
                </h4>
                <button
                  onClick={triggerLogAdd}
                  disabled={refreshing}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                  Request Ping Event
                </button>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 font-mono text-xs text-slate-300 leading-relaxed shadow-inner border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-3xs text-slate-500">
                  <span>STREAM: stdout / stderr</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                </div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-slate-500 text-3xs shrink-0">{log.timestamp}</span>
                      <span className={`text-3xs font-black shrink-0 uppercase px-1 rounded ${
                        log.level === "ERROR" ? "bg-red-950 text-red-400" : log.level === "WARN" ? "bg-amber-950 text-amber-400" : "bg-slate-900 text-indigo-400"
                      }`}>
                        [{log.level}]
                      </span>
                      <span className="text-slate-400 text-3xs font-black uppercase shrink-0">({log.service})</span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="mt-6 space-y-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configure AI & Security Defaults</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Generation Model</label>
                  <select
                    value={modelSelector}
                    onChange={(e) => setModelSelector(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (Fast, Multimodal, Native Document API)</option>
                    <option value="gemini-3.5-pro">gemini-3.5-pro (Executive, Deep reasoning & Star compliance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Document Payload Size</label>
                  <input
                    type="text"
                    disabled
                    value="10 MB (Enterprise standard)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <h5 className="text-xs font-bold text-slate-800">Global Privacy Compliance</h5>
                <p className="text-3xs text-slate-500 leading-normal">
                  All parsed assets are stored solely inside the local browser memory context via standard encryption protocols. No resume data is retained on servers post-handshake.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-800">GDPR Compliance Logs</span>
                    <span className="block text-4xs text-slate-500">Enable complete request tracing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowTelemetry}
                    onChange={(e) => setAllowTelemetry(e.target.checked)}
                    className="h-4.5 w-4.5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
