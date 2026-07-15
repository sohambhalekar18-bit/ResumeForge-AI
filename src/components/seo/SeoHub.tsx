/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Globe, ArrowRight, Eye, Code, ShieldCheck, Check } from "lucide-react";
import { motion } from "motion/react";

export default function SeoHub() {
  const [activeSubTab, setActiveSubTab] = useState<"og" | "sitemap" | "schema">("og");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://cv-insight-saas.com/sitemap.xml`;

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cv-insight-saas.com/</loc>
    <lastmod>2026-07-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  const jsonLdSchema = `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CV Insight",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  },
  "description": "An enterprise-grade AI-powered Resume Analyzer and ATS Optimizer SaaS featuring dynamic scorecards, deep grammar analysis, job matching, cover letter generators, and interview preparation roadmaps."
}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              SaaS SEO, Metadata & Marketing Console
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure search engine parameters, crawl instructions, and Open Graph previews for maximum web indexing.
            </p>
          </div>
          
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveSubTab("og")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeSubTab === "og" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Social (OG/Twitter)
            </button>
            <button
              onClick={() => setActiveSubTab("sitemap")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeSubTab === "sitemap" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Robots & Sitemap
            </button>
            <button
              onClick={() => setActiveSubTab("schema")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeSubTab === "schema" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              JSON-LD Schema
            </button>
          </div>
        </div>

        {/* Dynamic Inner Tab Viewports */}
        <div className="mt-6">
          {activeSubTab === "og" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta Tag Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Headers Checklist</h4>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Title Tag</p>
                        <p className="text-3xs text-slate-500 mt-0.5">CV Insight — Enterprise AI Resume Analyzer & ATS Optimizer</p>
                      </div>
                      <span className="rounded bg-emerald-50 text-emerald-700 text-3xs font-black px-2 py-0.5 uppercase">OK</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Description Tag</p>
                        <p className="text-3xs text-slate-500 mt-0.5 max-w-[280px] truncate">Optimize resume score, extract skill lists, and create covers...</p>
                      </div>
                      <span className="rounded bg-emerald-50 text-emerald-700 text-3xs font-black px-2 py-0.5 uppercase">65 chars</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Open Graph Image (og:image)</p>
                        <p className="text-3xs text-slate-500 mt-0.5">https://cv-insight-saas.com/assets/og-image.png</p>
                      </div>
                      <span className="rounded bg-indigo-50 text-indigo-700 text-3xs font-black px-2 py-0.5 uppercase">1200x630</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview Display */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    Interactive Card Preview (Twitter/Discord)
                  </h4>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=300&q=80"
                      alt="OG Cover card illustration"
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-4 space-y-1">
                      <span className="text-3xs font-bold text-slate-400 font-mono uppercase tracking-widest">CV-INSIGHT-SAAS.COM</span>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">CV Insight — Enterprise AI Resume Analyzer & ATS Optimizer</h5>
                      <p className="text-3xs text-slate-500 leading-normal">
                        Instantly score resumes, extract structural skill gaps, write tailor-made cover letters with custom settings, and prepare behavioral roadmaps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "sitemap" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">robots.txt</span>
                  <button
                    onClick={() => handleCopy(robotsTxt, "robots")}
                    className="text-3xs text-indigo-600 font-bold hover:underline"
                  >
                    {copiedText === "robots" ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
                <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-3xs font-mono text-slate-600 leading-relaxed overflow-x-auto">
                  {robotsTxt}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">sitemap.xml</span>
                  <button
                    onClick={() => handleCopy(sitemapXml, "sitemap")}
                    className="text-3xs text-indigo-600 font-bold hover:underline"
                  >
                    {copiedText === "sitemap" ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
                <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-3xs font-mono text-slate-600 leading-relaxed overflow-x-auto">
                  {sitemapXml}
                </pre>
              </div>
            </div>
          )}

          {activeSubTab === "schema" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Code className="h-4 w-4" />
                    Structured JSON-LD (Search Schema)
                  </span>
                  <p className="text-3xs text-slate-500 mt-0.5">Embed this script directly inside the parent index.html header tag.</p>
                </div>
                <button
                  onClick={() => handleCopy(jsonLdSchema, "schema")}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-3xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {copiedText === "schema" ? "Copied!" : "Copy code"}
                </button>
              </div>
              <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-3xs font-mono text-slate-600 leading-relaxed overflow-x-auto">
                {jsonLdSchema}
              </pre>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
