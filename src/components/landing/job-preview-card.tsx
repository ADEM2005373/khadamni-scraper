"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Globe2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { TUNISIAN_PORTALS } from "@/services/scraper/types";

interface LiveJob {
  id: string;
  source_site: string;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  requirements?: string | null;
  url: string;
  category?: string;
  predicted_chance?: number;
  scraped_at?: string;
}

// Initial clean Tunisian fallback dataset while fetching from MongoDB
const INITIAL_FALLBACK_JOBS: LiveJob[] = [
  {
    id: "fb-1",
    source_site: "TanitJobs",
    job_title: "Développeur Full-Stack Next.js / TypeScript",
    company_name: "TechSolutions Tunisia",
    location: "Tunis, Les Berges du Lac",
    description:
      "Conception et développement d'applications cloud scalables avec Next.js 14, TypeScript et PostgreSQL pour nos clients partenaires.",
    requirements: "Next.js, TypeScript, PostgreSQL, Tailwind CSS, Docker, Git",
    url: "https://www.tanitjobs.com/job/dev-fullstack-nextjs-tunis-8841",
    category: "CDI",
    predicted_chance: 94,
  },
  {
    id: "fb-2",
    source_site: "LinkedIn Jobs",
    job_title: "Staff Software Engineer - Cloud Architecture",
    company_name: "Expensya (Medius Group)",
    location: "Tunis, Les Berges du Lac 1",
    description:
      "Conception et scaling de l'architecture microservices cloud pour notre plateforme Fintech internationale de gestion des dépenses.",
    requirements: "TypeScript, Node.js, C#, Azure Cloud, Kubernetes, Microservices",
    url: "https://www.linkedin.com/jobs/view/expensya-cloud-staff-tunis-9921",
    category: "CDI",
    predicted_chance: 92,
  },
  {
    id: "fb-3",
    source_site: "Keejob",
    job_title: "Stage PFE : Développeur Full-Stack MEVN (Vue.js / Node.js / MongoDB)",
    company_name: "Focus Corporation",
    location: "Ariana, Technopôle El Ghazala",
    description:
      "Projet de fin d'études : Conception et implémentation d'une plateforme d'analytique temps-réel avec Vue 3, Express, TypeScript et MongoDB.",
    requirements: "Vue.js, Node.js, MongoDB, TypeScript, REST API, Git",
    url: "https://www.keejob.com/offres-emploi/stage-pfe-dev-fullstack-vue-mongo-4402",
    category: "Stage PFE",
    predicted_chance: 95,
  },
  {
    id: "fb-4",
    source_site: "Emploi.nat.tn (ANETI)",
    job_title: "Ingénieur Télécoms & Réseaux Sécurisés",
    company_name: "Société Industrielle ANETI",
    location: "Ben Arous, Mégrine",
    description:
      "Administration et sécurisation des réseaux LAN/WAN, configuration des routeurs Cisco, pare-feu Fortinet et virtualisation Linux.",
    requirements: "Cisco CCNA, Fortinet, Réseaux LAN/WAN, Linux, Wireshark",
    url: "https://www.emploi.nat.tn/fo/Fr/offre_detail.php?id=38491",
    category: "CIVP / CDI",
    predicted_chance: 86,
  },
  {
    id: "fb-5",
    source_site: "Optioncarriere.tn",
    job_title: "Consultant Salesforce & Développeur Apex",
    company_name: "PwC Tunisie Digital Center",
    location: "Tunis, Lac 2",
    description:
      "Déploiement et personnalisation des solutions Salesforce CRM, conception de composants LWC et logique métier Apex.",
    requirements: "Salesforce, Apex, Lightning Web Components (LWC), SOQL",
    url: "https://www.optioncarriere.tn/emploi-consultant-salesforce-lac2-8392",
    category: "CDI",
    predicted_chance: 89,
  },
  {
    id: "fb-6",
    source_site: "TanitJobs",
    job_title: "Stage PFE : Ingénieur Intelligence Artificielle & LLM Gemini",
    company_name: "InstaDeep Labs",
    location: "Tunis, Centre Urbain Nord",
    description:
      "Stage de fin d'études sur l'intégration et le fine-tuning de modèles de fondation Gemini pour l'automatisation de flux décisionnels.",
    requirements: "Python, PyTorch, LangChain, Gemini API, Fast-API, Docker",
    url: "https://www.tanitjobs.com/job/stage-pfe-ai-llm-gemini-instadeep-8874",
    category: "Stage PFE",
    predicted_chance: 96,
  },
];

export function JobPreviewSection() {
  const [jobs, setJobs] = useState<LiveJob[]>(INITIAL_FALLBACK_JOBS);
  const [selectedJob, setSelectedJob] = useState<LiveJob>(INITIAL_FALLBACK_JOBS[0]);
  const [activeFilter, setActiveFilter] = useState<string>("Tous");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch real live jobs from MongoDB on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveJobs() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/jobs?limit=25");
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs);
          setSelectedJob(data.jobs[0]);
        }
      } catch (err) {
        console.warn("[JobPreviewSection] Fallback to pre-seeded Tunisian jobs:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchLiveJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterTabs = [
    "Tous",
    "🎓 Stages PFE (Étudiants)",
    "TanitJobs",
    "LinkedIn Jobs",
    "Keejob",
    "ANETI",
    "Optioncarriere.tn",
    "CRIT Tunisie",
    "Bayt",
  ];

  const isStageJob = (j: LiveJob) => {
    const text = `${j.job_title} ${j.category || ""} ${j.description || ""}`.toLowerCase();
    return /\b(stage|pfe|stagiaire|internship|intern)\b/i.test(text);
  };

  const filteredJobs = jobs.filter((j) => {
    if (activeFilter === "Tous") return true;
    if (activeFilter === "🎓 Stages PFE (Étudiants)") {
      return isStageJob(j);
    }
    const sourceLower = (j.source_site || "").toLowerCase();
    const filterLower = activeFilter.toLowerCase();
    if (filterLower.includes("aneti")) return sourceLower.includes("aneti");
    if (filterLower.includes("optioncarriere")) return sourceLower.includes("optioncarriere");
    return sourceLower.includes(filterLower) || filterLower.includes(sourceLower);
  });

  // Extract skills/tags for display
  const getTags = (job: LiveJob): string[] => {
    if (job.requirements) {
      return job.requirements
        .split(/[,;|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 25)
        .slice(0, 5);
    }
    return ["Tunisie", job.category || "CDI", "Temps Plein"];
  };

  return (
    <section id="live-preview" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aperçu Multi-Portails en Direct (MongoDB)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Opportunités en Direct des 10 Portails Tunisiens
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Indexées en temps réel (TanitJobs, Keejob, LinkedIn, ANETI, CRIT...). Explorez librement sans inscription obligatoire.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {filterTabs.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  const firstMatch = jobs.find((j) => {
                    if (filter === "Tous") return true;
                    if (filter === "🎓 Stages PFE (Étudiants)") return isStageJob(j);
                    const sourceLower = (j.source_site || "").toLowerCase();
                    const filterLower = filter.toLowerCase();
                    if (filterLower.includes("aneti")) return sourceLower.includes("aneti");
                    if (filterLower.includes("optioncarriere")) return sourceLower.includes("optioncarriere");
                    return sourceLower.includes(filterLower) || filterLower.includes(sourceLower);
                  });
                  if (firstMatch) setSelectedJob(firstMatch);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Job List Cards (Left) */}
          <div className="lg:col-span-7 space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Aucune offre ne correspond à ce filtre actuellement.
                </p>
                <button
                  onClick={() => setActiveFilter("Tous")}
                  className="mt-3 text-xs font-bold text-red-600 hover:underline"
                >
                  Afficher toutes les offres
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJob.id === job.id;
                const portalMeta = TUNISIAN_PORTALS.find(
                  (p) => p.name.toLowerCase() === (job.source_site || "").toLowerCase()
                );
                const tags = getTags(job);
                const isStage = isStageJob(job);

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-red-500 bg-red-50/20 shadow-md ring-1 ring-red-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                              portalMeta?.badgeColor || "bg-slate-100 text-slate-800 border-slate-200"
                            }`}
                          >
                            {job.source_site}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              isStage
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {job.category || (isStage ? "Stage PFE" : "CDI")}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-1">
                          {job.job_title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {job.company_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {job.predicted_chance || 88}% Match
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Inspection Card (Right) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-700 space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Détails de l&apos;Offre Scrappée
              </span>
              <span className="text-xs font-medium text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {selectedJob.source_site}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1.5 leading-snug">
                {selectedJob.job_title}
              </h3>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <span>{selectedJob.company_name}</span>
                <span>•</span>
                <span>{selectedJob.location}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Type de contrat : {selectedJob.category || "CDI / Plein Temps"}</span>
              </div>
            </div>

            {/* Description snippet */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Extrait de l&apos;Annonce
              </span>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                {selectedJob.description ||
                  "Aucune description détaillée fournie. Consultez l'offre officielle sur le site source."}
              </p>
            </div>

            {/* Requirements / Tags */}
            {selectedJob.requirements && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Compétences & Mots-Clés
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requirements
                    .split(/[,;|]/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 1)
                    .slice(0, 6)
                    .map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Direct external apply + Public explorer link */}
            <div className="pt-2 space-y-2.5">
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl text-center shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <span>Postuler Directement sur {selectedJob.source_site}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex gap-2">
                <Link
                  href="/jobs"
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-center border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explorer les 220+ Offres</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/register"
                  className="flex-1 py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs rounded-xl text-center border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Optimiser CV IA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
