"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, Building2, ExternalLink, Sparkles, CheckCircle2, ChevronRight, Globe2 } from "lucide-react";
import Link from "next/link";
import { TUNISIAN_PORTALS } from "@/services/scraper/types";

interface JobPreview {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  category: string;
  atsMatch: number;
  tags: string[];
  salaryEst: string;
}

const mockLiveJobs: JobPreview[] = [
  {
    id: "job-1",
    title: "Lead Full-Stack Next.js / TypeScript",
    company: "Sofrecom Tunisie (Groupe Orange)",
    location: "Tunis, Les Berges du Lac 2",
    source: "TanitJobs",
    category: "CDI",
    atsMatch: 95,
    tags: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
    salaryEst: "3,200 - 4,500 TND / mois",
  },
  {
    id: "job-2",
    title: "Staff Software Engineer - Cloud Architecture",
    company: "Expensya (Medius Group)",
    location: "Tunis, Les Berges du Lac 1",
    source: "LinkedIn Jobs",
    category: "CDI",
    atsMatch: 92,
    tags: ["Azure Cloud", "Kubernetes", "TypeScript", "C#", "Microservices"],
    salaryEst: "4,500 - 6,000 TND / mois",
  },
  {
    id: "job-3",
    title: "Ingénieur Cloud DevOps & Kubernetes",
    company: "Focus Corporation",
    location: "Ariana, Technopôle El Ghazala",
    source: "Keejob",
    category: "CDI",
    atsMatch: 88,
    tags: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
    salaryEst: "2,800 - 3,800 TND / mois",
  },
  {
    id: "job-4",
    title: "Ingénieur Télécoms & Réseaux Sécurisés",
    company: "Société Industrielle ANETI",
    location: "Ben Arous, Mégrine",
    source: "Emploi.nat.tn (ANETI)",
    category: "CIVP / CDI",
    atsMatch: 86,
    tags: ["Cisco CCNA", "Fortinet", "Réseaux LAN/WAN", "Linux"],
    salaryEst: "1,800 - 2,500 TND / mois",
  },
  {
    id: "job-5",
    title: "Consultant Salesforce & Développeur Apex",
    company: "PwC Tunisie Digital Center",
    location: "Tunis, Lac 2",
    source: "Optioncarriere.tn",
    category: "CDI",
    atsMatch: 89,
    tags: ["Salesforce", "Apex", "LWC", "SOQL", "Cloud CRM"],
    salaryEst: "3,000 - 4,200 TND / mois",
  },
  {
    id: "job-6",
    title: "Senior Cloud Solutions Architect",
    company: "Teleperformance MENA Hub",
    location: "Tunis, Charguia 2",
    source: "Bayt",
    category: "CDI",
    atsMatch: 94,
    tags: ["AWS", "GCP", "Terraform", "Python", "DevOps"],
    salaryEst: "4,200 - 5,800 TND / mois",
  },
];

export function JobPreviewSection() {
  const [selectedJob, setSelectedJob] = useState<JobPreview>(mockLiveJobs[0]);
  const [activeFilter, setActiveFilter] = useState<string>("Tous");

  const filterTabs = ["Tous", "TanitJobs", "LinkedIn Jobs", "Keejob", "ANETI", "Optioncarriere.tn", "Bayt"];

  const filteredJobs =
    activeFilter === "Tous"
      ? mockLiveJobs
      : mockLiveJobs.filter(
          (j) => j.location.includes(activeFilter) || j.source.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <section id="live-preview" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aperçu Multi-Portails en Direct</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Les opportunités les plus chaudes des 10 portails tunisiens
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Indexées en continu et scorées selon votre adéquation ATS par notre IA Gemini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {filterTabs.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
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
          <div className="lg:col-span-7 space-y-3">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob.id === job.id;
              const portalMeta = TUNISIAN_PORTALS.find((p) => p.name.toLowerCase() === job.source.toLowerCase());

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
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                            portalMeta?.badgeColor || "bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          {job.source}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {job.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 hover:text-red-600 transition-colors">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
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
                        {job.atsMatch}% Match IA
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">{job.salaryEst}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {job.tags.map((tag, i) => (
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
            })}
          </div>

          {/* Interactive Inspection Card (Right) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-700 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                Diagnostic Prédictif IA
              </span>
              <span className="text-xs text-slate-400">Source: {selectedJob.source}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedJob.title}</h3>
              <p className="text-sm text-slate-300">{selectedJob.company} • {selectedJob.location}</p>
            </div>

            {/* Score Radial / Progress Indicator */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Compatibilité Prédictive Gemini
                </span>
                <span className="text-sm font-black text-emerald-400">
                  {selectedJob.atsMatch}% Excellent
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${selectedJob.atsMatch}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ce poste correspond étroitement aux compétences clés (Frontend, APIs, Architecture Cloud) extraites de votre profil.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Compétences Requises Détectées
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.tags.map((t, idx) => (
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

            <div className="pt-2 flex gap-3">
              <Link
                href="/dashboard"
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl text-center shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Explorer sur le Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
