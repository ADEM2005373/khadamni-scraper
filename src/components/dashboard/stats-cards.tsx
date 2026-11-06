"use client";

import React from "react";
import { Briefcase, Award, Send, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface DashboardMetricStats {
  totalJobsIndexed?: number | null;
  atsScoreSummary?: number | null;
  totalApplicationsSubmitted?: number | null;
  predictedSuccessRate?: number | null;
}

export function StatsCards({
  totalJobsIndexed,
  atsScoreSummary,
  totalApplicationsSubmitted = 0,
  predictedSuccessRate,
}: DashboardMetricStats) {
  const hasAtsScore = typeof atsScoreSummary === "number" && atsScoreSummary > 0;
  const hasSuccessRate = typeof predictedSuccessRate === "number" && predictedSuccessRate > 0;
  const appCount = totalApplicationsSubmitted ?? 0;

  const cards = [
    {
      title: "Total Jobs Indexed",
      labelFr: "Offres Indexées en Tunisie",
      value: typeof totalJobsIndexed === "number" ? totalJobsIndexed.toLocaleString("fr-TN") : "--",
      subtitle: "TanitJobs & Keejob en direct",
      icon: Briefcase,
      color: "text-red-600 bg-red-50",
    },
    {
      title: "ATS Score Summary",
      labelFr: "Score ATS CV (Gemini IA)",
      value: hasAtsScore ? `${atsScoreSummary}%` : "--",
      subtitle: hasAtsScore ? "Score calculé par Gemini IA" : "Téléversez votre CV pour analyser",
      icon: Award,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Total Applications Submitted",
      labelFr: "Candidatures Transmises",
      value: appCount.toString(),
      subtitle: appCount > 0 ? "Suivi en temps réel" : "Aucune candidature envoyée",
      icon: Send,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Predicted Success Rate",
      labelFr: "Taux de Succès Prédit",
      value: hasSuccessRate ? `${predictedSuccessRate}%` : "--",
      subtitle: hasSuccessRate ? "Probabilité d'entretien" : "Actif après analyse de profil",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="border-slate-200/90 shadow-sm hover:border-slate-300 transition-colors bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">
                  {item.title}
                </p>
                <h3 className="text-2xl font-black text-slate-900">{item.value}</h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
