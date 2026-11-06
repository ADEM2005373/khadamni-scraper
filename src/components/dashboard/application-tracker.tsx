"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface UserApplicationItem {
  id: string;
  userId: string;
  jobId: string;
  status: "Applied" | "Interviewing" | "Rejected" | "Offered" | string;
  predictedChance: number;
  appliedAt: string;
  job?: {
    jobTitle: string;
    companyName: string;
    location: string;
    sourceSite: string;
    jobUrl: string;
  };
  forecast?: {
    strengths?: string[];
    tailoredCoverLetterTip?: string;
  };
}

export function ApplicationTrackerPanel() {
  const [applications, setApplications] = useState<UserApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.error("Failed to load applications:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Offered":
        return { label: "Offre Reçue 🎉", class: "bg-emerald-100 text-emerald-800 border-emerald-300" };
      case "Interviewing":
        return { label: "Entretien en Cours 🎙️", class: "bg-blue-100 text-blue-800 border-blue-300" };
      case "Rejected":
        return { label: "Non Retenu", class: "bg-slate-100 text-slate-600 border-slate-300" };
      case "Applied":
      default:
        return { label: "Candidature Transmise ✉️", class: "bg-amber-100 text-amber-800 border-amber-300" };
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <CardTitle className="text-base font-bold text-slate-900">
              AI Application Success Forecaster & Suivi de Candidatures
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Prédiction algorithmique de sélection et cycle de vie de vos candidatures auprès des recruteurs
          </CardDescription>
        </div>

        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 shrink-0">
          {applications.length} Candidatures Suivies
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chargement de vos candidatures en cours...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Vous n&apos;avez pas encore de candidatures suivies. Utilisez le bouton &quot;Postuler & Suivre&quot; sur le Top 10 des offres !
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const statusInfo = getStatusBadge(app.status);
              const appliedDate = new Date(app.appliedAt).toLocaleDateString("fr-TN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Postulé le {appliedDate}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {app.job?.jobTitle || "Poste Technique"}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {app.job?.companyName || "Entreprise Tunisienne"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {app.job?.location || "Tunis"}
                        </span>
                      </div>
                    </div>

                    {/* Predicted Chance Gauge */}
                    <div className="flex flex-col items-start sm:items-end shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-lg font-black text-purple-700">
                          {app.predictedChance || 85}%
                        </span>
                        <span className="text-xs text-slate-400">chance prédite</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Modèle Gemini Recrutement
                      </span>
                    </div>
                  </div>

                  {/* Tailored Tip */}
                  {app.forecast?.tailoredCoverLetterTip && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <span>{app.forecast.tailoredCoverLetterTip}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
