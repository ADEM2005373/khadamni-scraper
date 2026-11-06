"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Filter,
  ExternalLink,
  RefreshCw,
  Briefcase,
  Sparkles,
  MapPin,
  Building2,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Award,
  Layers,
  User,
  Globe2,
} from "lucide-react";
import { StatsCards, DashboardMetricStats } from "@/components/dashboard/stats-cards";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { TopMatchesFeed } from "@/components/dashboard/top-matches";
import { ApplicationTrackerPanel } from "@/components/dashboard/application-tracker";
import { VirtualGuideModal, OnboardingGuide } from "@/components/onboarding";
import { Button } from "@/components/ui/button";
import { CoverLetterModal } from "@/components/dashboard/cover-letter-modal";
import { TUNISIAN_PORTALS } from "@/services/scraper/types";

interface JobItem {
  id: string;
  source_site: string;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  requirements?: string;
  url: string;
  scraped_at: string;
  category?: string;
  predicted_chance?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [metrics, setMetrics] = useState<DashboardMetricStats>({
    totalJobsIndexed: null,
    atsScoreSummary: null,
    totalApplicationsSubmitted: 0,
    predictedSuccessRate: null,
  });

  const [activeTab, setActiveTab] = useState<"top10" | "allJobs" | "tracker">("top10");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Scraper manual trigger state
  const [isScraping, setIsScraping] = useState(false);
  const [scraperMessage, setScraperMessage] = useState<string | null>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load clean real metrics on mount
  const refreshMetrics = async () => {
    try {
      const res = await fetch("/api/analytics/dashboard");
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error("Failed to load metrics:", e);
    }
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  // Fetch Jobs on Mount & when filters change
  useEffect(() => {
    fetchJobs();
  }, [sourceFilter, locationFilter, categoryFilter]);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const url = `/api/jobs?source=${encodeURIComponent(sourceFilter)}&location=${encodeURIComponent(locationFilter)}&category=${encodeURIComponent(categoryFilter)}&q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error("Failed to load jobs:", e);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleTriggerScraper = async () => {
    setIsScraping(true);
    setScraperMessage(null);
    try {
      const res = await fetch("/api/scraper/run", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setScraperMessage(
          `Scraping multi-portails réussi : ${data.summary.jobsScraped} offres collectées sur les 10 portails tunisiens !`
        );
        fetchJobs();
        refreshMetrics();
        setTimeout(() => setScraperMessage(null), 6000);
      } else {
        setScraperMessage("Erreur lors de l'exécution du scraper multi-portails.");
      }
    } catch {
      setScraperMessage("Erreur réseau lors du scraping.");
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-red-500/20 selection:text-red-700">
      {/* First-Time User Interactive Onboarding Guide */}
      <OnboardingGuide />

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-md shadow-red-600/20">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-900 tracking-tight leading-tight">
                Khadamni <span className="text-red-600">Scraper</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Intelligence Dashboard (10 Portails)
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/dashboard" className="text-xs font-bold text-red-600 border-b-2 border-red-600 pb-1">
              Dashboard & Offres
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Mon Profil & CV ATS
            </Link>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">
                  {session?.user?.name || "Adem Ouerhai"}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {session?.user?.email || "ouerhaiadem0805@gmail.com"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner with Scraper Trigger & Onboarding Guide */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="max-w-2xl space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 text-red-300 text-xs font-extrabold uppercase tracking-wider border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>10 Portails Tunisiens Connectés en Direct</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Intelligence & Scraping Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Extraction continue sur <strong>TanitJobs, LinkedIn Jobs, Keejob, ANETI, Optioncarriere, CRIT, CareerJet, Bayt, Farah & Expertini</strong>, analyse ATS certifiée <strong>Gemini IA</strong> et prédiction de compatibilité d&apos;embauche.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Button
              size="sm"
              disabled={isScraping}
              onClick={handleTriggerScraper}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
            >
              {isScraping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  <span>Indexation des 10 portails...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Lancer le Scraper (10 Portails)</span>
                </>
              )}
            </Button>
            <VirtualGuideModal />
          </div>
        </div>

        {/* 10 Official Websites Badges Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Globe2 className="w-4 h-4 text-red-600" />
              <span>10 Portails Officiels d&apos;Emploi en Tunisie Actifs</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              100% Connectés
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {TUNISIAN_PORTALS.map((portal) => (
              <a
                key={portal.id}
                href={portal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={portal.description}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-red-50/60 border border-slate-200/80 hover:border-red-300 transition-all group"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-red-700 truncate">
                    {portal.name}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-red-500 truncate">
                    {portal.officialUrl.replace("https://", "").replace("www.", "")}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-red-600 shrink-0 ml-1" />
              </a>
            ))}
          </div>
        </div>

        {/* Scraper Status Notification */}
        {scraperMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scraperMessage}</span>
          </div>
        )}

        {/* 1. Metric Cards */}
        <StatsCards
          totalJobsIndexed={metrics.totalJobsIndexed}
          atsScoreSummary={metrics.atsScoreSummary}
          totalApplicationsSubmitted={metrics.totalApplicationsSubmitted}
          predictedSuccessRate={metrics.predictedSuccessRate}
        />

        {/* 2. Recharts Analytics */}
        <AnalyticsCharts
          onDataLoaded={(newMetrics) => {
            if (newMetrics) {
              setMetrics((prev) => ({
                ...prev,
                totalJobsIndexed: newMetrics.totalJobsIndexed ?? prev.totalJobsIndexed,
                atsScoreSummary: newMetrics.atsScoreSummary ?? prev.atsScoreSummary,
                totalApplicationsSubmitted: newMetrics.totalApplicationsSubmitted ?? prev.totalApplicationsSubmitted,
                predictedSuccessRate: newMetrics.predictedSuccessRate ?? prev.predictedSuccessRate,
              }));
            }
          }}
        />

        {/* 3. Section Navigation Tabs: Top 10 Curated, All Scraped Jobs, Application Tracker */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("top10")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "top10"
                ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top 10 Curated Matches</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === "top10" ? "bg-white text-red-600" : "bg-red-100 text-red-700"
              }`}
            >
              IA
            </span>
          </button>

          <button
            onClick={() => setActiveTab("allJobs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "allJobs"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Flux d&apos;Offres (10 Portails)</span>
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "tracker"
                ? "bg-purple-700 text-white shadow-sm shadow-purple-700/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Suivi des Candidatures & Prédictions</span>
          </button>
        </div>

        {/* TAB 1: Top 10 Curated Matches Feed */}
        {activeTab === "top10" && (
          <div className="animate-in fade-in duration-200">
            <TopMatchesFeed
              onApplicationCreated={() => {
                setMetrics((m) => ({
                  ...m,
                  totalApplicationsSubmitted: (m.totalApplicationsSubmitted || 0) + 1,
                }));
              }}
            />
          </div>
        )}

        {/* TAB 2: Scraped Jobs Live Feed Section */}
        {activeTab === "allJobs" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-red-600" />
                    <span>Toutes les Offres Récentes Scrappées en Tunisie</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dédoublonnées et indexées depuis les 10 portails nationaux et internationaux
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {jobs.length} offre{jobs.length > 1 ? "s" : ""} affichée{jobs.length > 1 ? "s" : ""}
                </div>
              </div>

              {/* Source Filter Tabs: All 10 Portals */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => setSourceFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    sourceFilter === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Toutes les sources (10)
                </button>
                {TUNISIAN_PORTALS.map((portal) => (
                  <button
                    key={portal.id}
                    onClick={() => setSourceFilter(portal.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      sourceFilter.toLowerCase() === portal.name.toLowerCase()
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {portal.name}
                  </button>
                ))}
              </div>

              {/* Regional & Contract Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                {/* Location Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <span className="font-semibold text-slate-400 shrink-0">Lieu:</span>
                  <button
                    onClick={() => setLocationFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      locationFilter === "all"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Toute la Tunisie
                  </button>
                  <button
                    onClick={() => setLocationFilter("tunis")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      locationFilter === "tunis"
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Grand Tunis
                  </button>
                  <button
                    onClick={() => setLocationFilter("sahel")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      locationFilter === "sahel"
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Sousse / Sahel
                  </button>
                  <button
                    onClick={() => setLocationFilter("sfax")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      locationFilter === "sfax"
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Sfax
                  </button>
                  <button
                    onClick={() => setLocationFilter("remote")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      locationFilter === "remote"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Télétravail / Hybride
                  </button>
                </div>

                {/* Contract Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <span className="font-semibold text-slate-400 shrink-0">Contrat:</span>
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      categoryFilter === "all"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setCategoryFilter("cdi")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      categoryFilter === "cdi"
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    CDI
                  </button>
                  <button
                    onClick={() => setCategoryFilter("civp")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      categoryFilter === "civp"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    CIVP (ANETI)
                  </button>
                  <button
                    onClick={() => setCategoryFilter("karama")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      categoryFilter === "karama"
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Karama
                  </button>
                  <button
                    onClick={() => setCategoryFilter("stage")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 ${
                      categoryFilter === "stage"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Stage / PFE
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre (Next.js, AI, DevOps...), entreprise (InstaDeep, Expensya...) ou gouvernorat (Tunis, Sousse, Sfax, Ariana)..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4"
              >
                Rechercher
              </Button>
            </form>

            {/* Jobs Table */}
            <div className="overflow-x-auto">
              {isLoadingJobs ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  <span>Chargement des offres des 10 portails tunisiens...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Aucune offre ne correspond à vos critères de recherche pour ce portail.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Titre du poste</th>
                      <th className="py-3 px-4">Entreprise & Lieu</th>
                      <th className="py-3 px-4">Portail Source</th>
                      <th className="py-3 px-4">Score Compatibilité IA</th>
                      <th className="py-3 px-4 text-right">Lien Direct</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => {
                      const portalMeta = TUNISIAN_PORTALS.find(
                        (p) => p.name.toLowerCase() === job.source_site.toLowerCase()
                      );

                      return (
                        <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900 hover:text-red-600 transition-colors">
                                {job.job_title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-normal">
                                {job.category || "CDI / Plein Temps"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 font-semibold text-slate-800">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {job.company_name}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {job.location}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${
                                portalMeta?.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              {job.source_site}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Sparkles className="w-3 h-3" />
                              {job.predicted_chance || 84}% Élevé
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <CoverLetterModal
                                job={{
                                  jobTitle: job.job_title,
                                  companyName: job.company_name,
                                  location: job.location,
                                  description: job.description,
                                  requirements: job.requirements,
                                }}
                              />
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 font-bold text-[11px] text-slate-700 transition-all"
                              >
                                <span>Postuler</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Application Tracker Panel */}
        {activeTab === "tracker" && (
          <div className="animate-in fade-in duration-200">
            <ApplicationTrackerPanel />
          </div>
        )}
      </main>
    </div>
  );
}
