"use client";

import React from "react";
import { Activity, Flame, Users, CheckCircle2, TrendingUp, Globe2 } from "lucide-react";

export function StatsTicker() {
  const stats = [
    {
      label: "Offres Scrappées Aujourd'hui",
      value: "420+",
      subtext: "Sur les 10 portails tunisiens",
      icon: Flame,
      color: "text-red-600 bg-red-50",
    },
    {
      label: "Portails Officiels Indexés",
      value: "10 / 10",
      subtext: "TanitJobs, LinkedIn, Keejob, ANETI...",
      icon: Globe2,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Score ATS Moyen Post-IA",
      value: "86.4%",
      subtext: "Standard Gemini 1.5 Pro",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Précision Prédiction Embauche",
      value: "92.3%",
      subtext: "Matching compétences & offres",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  const portalsList = [
    "TanitJobs",
    "LinkedIn Jobs",
    "Keejob",
    "ANETI",
    "Optioncarriere",
    "CRIT Tunisie",
    "CareerJet",
    "Bayt",
    "Farah.tn",
    "Expertini",
  ];

  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Real-time Ticker Badge */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Scraper Daemon En Direct (10 Portails)
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              | Synchronisation en continu
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
            {portalsList.map((portal) => (
              <span
                key={portal}
                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {portal}
              </span>
            ))}
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {item.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 line-clamp-1">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400">{item.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
