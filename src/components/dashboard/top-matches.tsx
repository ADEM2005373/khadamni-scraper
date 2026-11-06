"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Send,
  Loader2,
  Award,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoverLetterModal } from "./cover-letter-modal";

export interface MatchJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  sourceSite: string;
  category: string;
  url: string;
  matchScore: number;
  matchGrade: "Très Élevé" | "Élevé" | "Bon" | "Moyen";
  matchingSkills: string[];
  missingSkills: string[];
  predictedChance: number;
  rationale: string;
}

interface TopMatchesProps {
  onApplicationCreated?: () => void;
}

export function TopMatchesFeed({ onApplicationCreated }: TopMatchesProps) {
  const [matches, setMatches] = useState<MatchJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/jobs/top-matches");
        const data = await res.json();
        if (data.success && data.matches) {
          setMatches(data.matches);
        }
      } catch (err) {
        console.error("Error loading top matches:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMatches();
  }, []);

  const handleApplyAndTrack = async (job: MatchJob) => {
    setApplyingJobId(job.jobId);
    setActionSuccessMessage(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.jobId,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          sourceSite: job.sourceSite,
          url: job.url,
          requirements: job.matchingSkills.join(", "),
          description: job.rationale,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAppliedJobIds((prev) => new Set(prev).add(job.jobId));
        setActionSuccessMessage(
          `Candidature enregistrée pour "${job.jobTitle}" (Probabilité estimée: ${data.forecast?.predictedChance || job.predictedChance}%) !`
        );
        if (onApplicationCreated) onApplicationCreated();
        setTimeout(() => setActionSuccessMessage(null), 4500);
      }
    } catch (e) {
      console.error("Failed to apply:", e);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithme Sémantique & ATS</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Top 10 Curated Matches (Sur-Mesure)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Offres d&apos;emploi tunisiennes présentant la plus forte affinité avec votre profil et CV
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Mise à jour en temps réel</span>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Grid of Matched Cards */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span>Calcul des 10 meilleures opportunités pour votre profil...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((job, idx) => {
            const isApplied = appliedJobIds.has(job.jobId);
            const isApplying = applyingJobId === job.jobId;

            return (
              <div
                key={job.jobId || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 p-5 flex flex-col justify-between transition-all duration-200 relative group"
              >
                {/* Ranking Pill */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="space-y-3 pr-28">
                  {/* Portal & Category */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        job.sourceSite === "TanitJobs"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {job.sourceSite}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {job.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {job.jobTitle}
                  </h3>

                  {/* Company & Location */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                  </div>

                  {/* Rationale */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {job.rationale}
                  </p>

                  {/* Matching Skills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.matchingSkills.slice(0, 4).map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {job.missingSkills.slice(0, 2).map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded"
                      >
                        + {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Probabilité d&apos;embauche :</span>
                    <span className="font-black text-purple-700">{job.predictedChance}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CoverLetterModal
                      job={{
                        jobTitle: job.jobTitle,
                        companyName: job.companyName,
                        location: job.location,
                        description: job.rationale,
                        requirements: job.matchingSkills.join(", "),
                      }}
                    />

                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Voir l'annonce originale"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <Button
                      size="sm"
                      disabled={isApplied || isApplying}
                      onClick={() => handleApplyAndTrack(job)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        isApplied
                          ? "bg-emerald-600 text-white cursor-default"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20"
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          <span>Calcul IA...</span>
                        </>
                      ) : isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Candidature Suivie</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 mr-1" />
                          <span>Postuler & Suivre</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
