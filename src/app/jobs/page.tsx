"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles,
  GraduationCap,
  ChevronRight,
  Globe2,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import { TUNISIAN_PORTALS } from "@/services/scraper/types";

interface Job {
  id: string;
  source_site: string;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  requirements?: string | null;
  url: string;
  scraped_at?: string;
  category?: string;
  predicted_chance?: number;
}

export default function PublicJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [personaFilter, setPersonaFilter] = useState<"all" | "student" | "worker">("all");
  const [activeJobModal, setActiveJobModal] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [selectedPortal, selectedLocation, selectedCategory, personaFilter]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedPortal !== "all") params.set("source", selectedPortal);
      if (selectedLocation !== "all") params.set("location", selectedLocation);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (personaFilter !== "all") params.set("userType", personaFilter);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to load public jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const isStage = (j: Job) => {
    const text = `${j.job_title} ${j.category || ""} ${j.description || ""}`.toLowerCase();
    return /\b(stage|pfe|stagiaire|internship|intern)\b/i.test(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-red-500/20 selection:text-red-700">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-slate-900 tracking-tight leading-tight flex items-center gap-1">
                  Khadamni <span className="text-red-600">Scraper</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                  Explorateur Public
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600">
              <Link
                href="/"
                className="hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-red-600 font-bold">Toutes les Offres (Direct)</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Se Connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-600/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Créer un Compte Gratuit</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Search Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 mb-2">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Indexation Multi-Portails Tunisiens</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explorer les Offres d&apos;Emploi & Stages en Tunisie
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Consultez librement et postulez directement sur les sites sources originaux sans obligation de connexion.
              </p>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
              <button
                onClick={() => setPersonaFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  personaFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Toutes les offres
              </button>
              <button
                onClick={() => setPersonaFilter("student")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  personaFilter === "student"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Stages PFE / Étudiants</span>
              </button>
              <button
                onClick={() => setPersonaFilter("worker")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  personaFilter === "worker"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Emplois / CDI / CIVP</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Filters Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par poste, technologie, mot-clé (ex: React, Comptable, Stage PFE, Java)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 placeholder:text-slate-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher</span>
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {/* Portal Filter */}
              <select
                value={selectedPortal}
                onChange={(e) => setSelectedPortal(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Tous les 10 portails tunisiens</option>
                {TUNISIAN_PORTALS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Toutes les régions / Gouvernorats</option>
                <option value="tunis">Grand Tunis (Tunis, Ariana, Lac...)</option>
                <option value="sahel">Sahel (Sousse, Monastir, Mahdia)</option>
                <option value="sfax">Sfax</option>
                <option value="remote">Télétravail / Hybride</option>
              </select>

              {/* Contract Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="all">Tous types de contrats</option>
                <option value="cdi">CDI</option>
                <option value="civp">CIVP / SIVP</option>
                <option value="karama">Contrat Karama</option>
                <option value="stage">Stage PFE / Étudiant</option>
              </select>

              {(selectedPortal !== "all" ||
                selectedLocation !== "all" ||
                selectedCategory !== "all" ||
                personaFilter !== "all" ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPortal("all");
                    setSelectedLocation("all");
                    setSelectedCategory("all");
                    setPersonaFilter("all");
                    setSearchQuery("");
                  }}
                  className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Réinitialiser les filtres</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
            <span>
              Résultats : <strong className="text-slate-900">{jobs.length}</strong> offre
              {jobs.length > 1 ? "s" : ""} disponible{jobs.length > 1 ? "s" : ""}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 font-medium hidden sm:inline">
              Synchronisé en direct avec MongoDB
            </span>
          </div>

          <div className="text-xs text-slate-500">
            {personaFilter === "student" && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                🎓 Mode Étudiant Actif : Stages PFE & d&apos;été
              </span>
            )}
            {personaFilter === "worker" && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                💼 Mode Professionnel Actif : CDI & CIVP
              </span>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-3" />
            <p className="text-xs font-medium text-slate-500">
              Chargement des offres en direct depuis la base de données...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Aucune offre trouvée</h3>
            <p className="text-xs text-slate-500">
              Aucune annonce ne correspond à votre recherche actuelle. Essayez d&apos;élargir vos filtres ou de réinitialiser la recherche.
            </p>
            <button
              onClick={() => {
                setSelectedPortal("all");
                setSelectedLocation("all");
                setSelectedCategory("all");
                setPersonaFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              Afficher toutes les offres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => {
              const portalMeta = TUNISIAN_PORTALS.find(
                (p) => p.name.toLowerCase() === (job.source_site || "").toLowerCase()
              );
              const isStageJob = isStage(job);
              const tags = (job.requirements || "")
                .split(/[,;|]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 1 && s.length < 25)
                .slice(0, 4);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${
                          portalMeta?.badgeColor || "bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        {job.source_site}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isStageJob
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {job.category || (isStageJob ? "Stage PFE" : "CDI")}
                      </span>
                    </div>

                    {/* Job Title */}
                    <div>
                      <h3
                        onClick={() => setActiveJobModal(job)}
                        className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer"
                        title={job.job_title}
                      >
                        {job.job_title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5">
                        <span className="flex items-center gap-1 font-medium truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.company_name}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description || "Consultez l'offre officielle sur le site pour plus de détails."}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {job.predicted_chance || 88}% Match IA
                      </span>
                      <button
                        onClick={() => setActiveJobModal(job)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Voir détails
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {/* Direct Apply Button (No login required) */}
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Postuler</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* AI Resume Match CTA */}
                      <Link
                        href="/register"
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl text-center transition-all flex items-center justify-center gap-1"
                        title="Optimisez votre CV avec l'IA Gemini pour cette offre"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>IA CV</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal for detailed job view */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                  {activeJobModal.source_site}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {activeJobModal.job_title}
                </h3>
                <p className="text-xs text-slate-600">
                  {activeJobModal.company_name} • {activeJobModal.location}
                </p>
              </div>
              <button
                onClick={() => setActiveJobModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description du poste
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {activeJobModal.description || "Aucune description détaillée."}
              </div>
            </div>

            {activeJobModal.requirements && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Compétences & Profil recherché
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeJobModal.requirements
                    .split(/[,;|]/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 1)
                    .map((req, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {req}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={activeJobModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl text-center shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <span>Postuler Directement sur {activeJobModal.source_site}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/register"
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Générer Lettre IA & Scorer CV</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
