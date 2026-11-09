"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  Users,
  Briefcase,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  Trash2,
  Star,
  PlusCircle,
  Download,
  AlertCircle,
  CheckCircle2,
  Globe2,
  Clock,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Settings,
  Flame,
  Radio,
  FileText,
  Sliders,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface AdminStats {
  totalJobs: number;
  totalUsers: number;
  studentUsers: number;
  workerUsers: number;
  stageOffers: number;
  cdiOffers: number;
  civpOffers: number;
  portalCounts: Record<string, number>;
  techDemand: { tech: string; count: number }[];
  activeModel: string;
  announcement?: { enabled: boolean; message: string; type: string } | null;
  serverTime: string;
}

interface PortalItem {
  name: string;
  baseUrl: string;
  badgeColor: string;
  totalJobs: number;
  status: string;
  lastRun: string;
  rateLimitDelayMs: number;
}

interface AdminJob {
  id: string;
  source_site: string;
  job_title: string;
  company_name: string;
  location: string;
  category: string;
  requirements?: string;
  url: string;
  isFeatured: boolean;
  scraped_at: string;
  predicted_chance: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "candidate";
  userType: "student" | "worker";
  atsScore?: number | null;
  cvFileUrl?: string | null;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<"overview" | "scrapers" | "jobs" | "users" | "settings">("overview");

  // States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [portals, setPortals] = useState<PortalItem[]>([]);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isScrapingTarget, setIsScrapingTarget] = useState<string | null>(null);

  // Job Filters
  const [jobSearch, setJobSearch] = useState("");
  const [jobPortalFilter, setJobPortalFilter] = useState("all");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("all");

  // Add Job Modal
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("Tunis");
  const [newJobCategory, setNewJobCategory] = useState("CDI");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobRequirements, setNewJobRequirements] = useState("");
  const [newJobUrl, setNewJobUrl] = useState("");
  const [newJobFeatured, setNewJobFeatured] = useState(true);

  // Settings
  const [geminiModel, setGeminiModel] = useState("gemini-1.5-pro");
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerMessage, setBannerMessage] = useState(
    "🎉 Bienvenue sur Khadamni Scraper : Plus de 220 offres tunisiennes et stages PFE indexés en direct !"
  );
  const [scraperInterval, setScraperInterval] = useState(6);

  // Auth Guard
  const userEmail = session?.user?.email?.toLowerCase().trim() || "";
  const isOwner = ["ouerhaiadem0805@gmail.com", "adem@khadamni.com"].includes(userEmail);
  const isAdmin = (session?.user as any)?.role === "admin" || isOwner;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin");
    } else if (status === "authenticated" && !isAdmin) {
      // not an admin, deny access
    }
  }, [status, isAdmin, router]);

  // Load Initial Admin Data
  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, scrapersRes, jobsRes, usersRes, settingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/scrapers"),
        fetch("/api/admin/jobs?limit=50"),
        fetch("/api/admin/users"),
        fetch("/api/admin/settings"),
      ]);

      const statsData = await statsRes.json();
      const scrapersData = await scrapersRes.json();
      const jobsData = await jobsRes.json();
      const usersData = await usersRes.json();
      const settingsData = await settingsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (scrapersData.success) setPortals(scrapersData.portals);
      if (jobsData.success) setJobs(jobsData.jobs);
      if (usersData.success) setUsers(usersData.users);
      if (settingsData.success && settingsData.config) {
        setGeminiModel(settingsData.config.geminiModel || "gemini-1.5-pro");
        if (settingsData.config.announcement) {
          setBannerEnabled(!!settingsData.config.announcement.enabled);
          setBannerMessage(settingsData.config.announcement.message || "");
        }
        if (settingsData.config.scraperIntervalHours) {
          setScraperInterval(settingsData.config.scraperIntervalHours);
        }
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Scraper
  const handleTriggerScraper = async (portalName?: string) => {
    setIsScrapingTarget(portalName || "all");
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin/scrapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: portalName }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(
          `✓ Scraping terminé avec succès ! ${data.summary.newlyScraped} offres collectées sur ${data.summary.target}.`
        );
        loadAllAdminData();
      } else {
        setActionMessage(`✗ Erreur de scraping : ${data.error}`);
      }
    } catch {
      setActionMessage("✗ Erreur réseau lors du déclenchement du scraper.");
    } finally {
      setIsScrapingTarget(null);
      setTimeout(() => setActionMessage(null), 6000);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (jobId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, isFeatured: !currentFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, isFeatured: !currentFeatured } : j))
        );
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre du catalogue ?")) return;
    try {
      const res = await fetch(`/api/admin/jobs?id=${encodeURIComponent(jobId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        if (stats) setStats({ ...stats, totalJobs: Math.max(0, stats.totalJobs - 1) });
      }
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  // Create Manual Partner Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: newJobTitle,
          company_name: newJobCompany,
          location: newJobLocation,
          category: newJobCategory,
          description: newJobDescription,
          requirements: newJobRequirements,
          url: newJobUrl,
          isFeatured: newJobFeatured,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddJobModal(false);
        setNewJobTitle("");
        setNewJobCompany("");
        setNewJobDescription("");
        setNewJobRequirements("");
        setNewJobUrl("");
        loadAllAdminData();
        setActionMessage("✓ Offre partenaire publiée avec succès dans le catalogue !");
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        alert(data.error || "Erreur lors de la création de l'offre.");
      }
    } catch (err) {
      console.error("Failed to create job:", err);
    }
  };

  // Toggle User Persona
  const handleToggleUserPersona = async (userId: string, currentPersona: "student" | "worker") => {
    const newPersona = currentPersona === "student" ? "worker" : "student";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, userType: newPersona }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, userType: newPersona } : u))
        );
      }
    } catch (err) {
      console.error("Failed to toggle persona:", err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geminiModel,
          announcement: {
            enabled: bannerEnabled,
            message: bannerMessage,
            type: "info",
          },
          scraperIntervalHours: scraperInterval,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("✓ Paramètres système et IA Gemini enregistrés !");
        setTimeout(() => setActionMessage(null), 4000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  // Access Denied Screen for non-admins
  if (status === "authenticated" && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Accès Réservé au Propriétaire</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cet espace de supervision est réservé exclusivement à l&apos;administrateur et propriétaire de Khadamni Scraper. Votre compte actuel n&apos;a pas les autorisations nécessaires.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retourner au Dashboard Candidat</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Jobs List
  const filteredJobs = jobs.filter((j) => {
    if (jobPortalFilter !== "all" && !j.source_site.toLowerCase().includes(jobPortalFilter.toLowerCase())) {
      return false;
    }
    if (jobCategoryFilter !== "all") {
      if (jobCategoryFilter === "stage" && !/\b(stage|pfe)\b/i.test(`${j.job_title} ${j.category}`)) return false;
      if (jobCategoryFilter === "cdi" && !/cdi/i.test(j.category)) return false;
      if (jobCategoryFilter === "civp" && !/civp/i.test(j.category)) return false;
    }
    if (jobSearch.trim() !== "") {
      const q = jobSearch.toLowerCase();
      return (
        j.job_title.toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500/20 selection:text-red-400">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-base shadow-md shadow-red-600/30">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                  Khadamni <span className="text-red-500">Owner Hub</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Espace Propriétaire
                </span>
              </div>
            </Link>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Quick Link back to candidate dashboard */}
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Vue Candidat</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Download MongoDB JSON Backup button */}
            <a
              href="/api/admin/backup"
              download
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Exporter une sauvegarde complète de la base de données MongoDB en JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Sauvegarde JSON</span>
            </a>

            {/* Global Scraper Trigger Button */}
            <button
              onClick={() => handleTriggerScraper()}
              disabled={isScrapingTarget !== null}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isScrapingTarget === "all" ? "animate-spin" : ""}`}
              />
              <span>Scraping Global (10 Portails)</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "overview"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4 text-red-500" />
            <span>Vue d&apos;Ensemble & Marché</span>
          </button>

          <button
            onClick={() => setActiveTab("scrapers")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "scrapers"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Moteur des 10 Scrapers</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
              10/10
            </span>
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "jobs"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Gestion des Offres</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
              {stats?.totalJobs || 220}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "users"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Utilisateurs & Candidats</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
              {stats?.totalUsers || 2}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === "settings"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Paramètres IA & Système</span>
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="bg-red-950/80 border-b border-red-500/40 px-4 py-2.5 text-center text-xs font-bold text-red-200 animate-in fade-in">
          {actionMessage}
        </div>
      )}

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto" />
            <p className="text-xs text-slate-400">Chargement de la console d&apos;administration...</p>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW & TUNISIAN MARKET INTEL */}
            {/* ========================================================================= */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in">
                {/* 4 Core Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <span>Offres Indexées</span>
                      <Briefcase className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-3xl font-black text-white">{stats?.totalJobs || 220}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <span className="text-amber-400 font-semibold">{stats?.stageOffers || 10} Stages PFE</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{stats?.cdiOffers || 180} CDI/CIVP</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <span>Candidats Inscrits</span>
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-3xl font-black text-white">{stats?.totalUsers || 2}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <span className="text-purple-400 font-semibold">{stats?.studentUsers || 1} Étudiants</span>
                      <span>•</span>
                      <span className="text-blue-400 font-semibold">{stats?.workerUsers || 1} Salariés</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <span>Portails Tunisiens</span>
                      <Globe2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-black text-emerald-400">10 / 10</div>
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Tous les connecteurs opérationnels</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <span>Moteur IA Gemini</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-amber-300">Gemini 1.5</div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Modèle : <strong className="text-white">{geminiModel}</strong>
                    </div>
                  </div>
                </div>

                {/* 2-Column Market Intel Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Top Tech in Tunisia (Left) */}
                  <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-red-500" />
                          <span>Observatoire : Technologies les plus demandées en Tunisie</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Calculé en temps réel sur les 220+ offres des 10 portails tunisiens.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {(stats?.techDemand || []).map((item, idx) => {
                        const maxCount = stats?.techDemand[0]?.count || 1;
                        const percentage = Math.round((item.count / maxCount) * 100);

                        return (
                          <div key={item.tech} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500 w-4 font-mono">
                                  #{idx + 1}
                                </span>
                                {item.tech}
                              </span>
                              <span className="text-slate-400 font-bold">{item.count} offres</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Portals Volume Distribution (Right) */}
                  <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <span>Volume d&apos;Offres par Portail</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab("scrapers")}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold"
                      >
                        Gérer les scrapers →
                      </button>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {portals.map((p) => (
                        <div
                          key={p.name}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="font-semibold text-slate-200">{p.name}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-slate-700/80 font-bold text-slate-300">
                            {p.totalJobs} offres
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: SCRAPER ENGINE CONTROL ROOM */}
            {/* ========================================================================= */}
            {activeTab === "scrapers" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe2 className="w-5 h-5 text-emerald-400" />
                      <span>Salle de Contrôle des 10 Scrapers Tunisiens</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Contrôlez l&apos;extraction, testez les connecteurs et surveillez les temps de réponse de chaque portail.
                    </p>
                  </div>

                  <button
                    onClick={() => handleTriggerScraper()}
                    disabled={isScrapingTarget !== null}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isScrapingTarget === "all" ? "animate-spin" : ""}`}
                    />
                    <span>Exécuter tous les Scrapers</span>
                  </button>
                </div>

                {/* 10 Portails Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {portals.map((portal) => {
                    const isRunning = isScrapingTarget === portal.name;

                    return (
                      <div
                        key={portal.name}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border ${portal.badgeColor}`}
                            >
                              {portal.name}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Opérationnel
                            </span>
                          </div>

                          <div>
                            <div className="text-2xl font-black text-white">{portal.totalJobs}</div>
                            <div className="text-[11px] text-slate-400">
                              offres indexées en base de données
                            </div>
                          </div>

                          <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800">
                            <div className="flex items-center justify-between">
                              <span>Délai anti-ban :</span>
                              <strong className="text-slate-200">{portal.rateLimitDelayMs} ms</strong>
                            </div>
                            <div className="flex items-center justify-between truncate">
                              <span>Source :</span>
                              <a
                                href={portal.baseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-300 hover:text-white flex items-center gap-1 truncate"
                              >
                                <span className="truncate">{portal.baseUrl.replace("https://", "")}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800">
                          <button
                            onClick={() => handleTriggerScraper(portal.name)}
                            disabled={isScrapingTarget !== null}
                            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 border border-slate-700"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
                            <span>{isRunning ? "Scraping en cours..." : "Scraper ce portail"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: JOBS & CMS MANAGEMENT */}
            {/* ========================================================================= */}
            {activeTab === "jobs" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      <span>Catalogue & Gestion des Offres</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {filteredJobs.length} offre{filteredJobs.length > 1 ? "s" : ""} affichée{filteredJobs.length > 1 ? "s" : ""} sur {jobs.length} au total.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddJobModal(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Ajouter une Offre Partenaire</span>
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrer par titre, entreprise, ville..."
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <select
                    value={jobPortalFilter}
                    onChange={(e) => setJobPortalFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
                  >
                    <option value="all">Tous les 10 portails tunisiens</option>
                    {portals.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
                  >
                    <option value="all">Tous types de contrats</option>
                    <option value="cdi">CDI</option>
                    <option value="civp">CIVP / SIVP</option>
                    <option value="stage">Stage PFE / Étudiant</option>
                  </select>
                </div>

                {/* Jobs Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Vedette</th>
                          <th className="p-3.5">Poste & Entreprise</th>
                          <th className="p-3.5">Portail</th>
                          <th className="p-3.5">Contrat</th>
                          <th className="p-3.5">Lieu</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {filteredJobs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                              Aucune offre ne correspond à ces critères.
                            </td>
                          </tr>
                        ) : (
                          filteredJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3.5">
                                <button
                                  onClick={() => handleToggleFeatured(job.id, job.isFeatured)}
                                  className={`p-1 rounded-lg transition-colors ${
                                    job.isFeatured
                                      ? "text-amber-400 bg-amber-400/10"
                                      : "text-slate-600 hover:text-slate-400"
                                  }`}
                                  title={
                                    job.isFeatured
                                      ? "Offre mise en avant (cliquez pour retirer)"
                                      : "Mettre en avant cette offre"
                                  }
                                >
                                  <Star
                                    className={`w-4 h-4 ${job.isFeatured ? "fill-amber-400" : ""}`}
                                  />
                                </button>
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-white line-clamp-1">
                                  {job.job_title}
                                </div>
                                <div className="text-[11px] text-slate-400 line-clamp-1">
                                  {job.company_name}
                                </div>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  {job.source_site}
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    /\b(stage|pfe)\b/i.test(`${job.job_title} ${job.category}`)
                                      ? "bg-purple-900/40 text-purple-300 border border-purple-700/50"
                                      : "bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  {job.category}
                                </span>
                              </td>
                              <td className="p-3.5 whitespace-nowrap text-slate-400">
                                {job.location}
                              </td>
                              <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Ouvrir l'offre originale"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors"
                                  title="Supprimer cette offre"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: USERS & CANDIDATES GOVERNANCE */}
            {/* ========================================================================= */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>Répertoire des Utilisateurs & Candidats</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Gérez les comptes, vérifiez les scores ATS et ajustez les rôles ou statuts Étudiant vs Salarié.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Utilisateur</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Statut Cible</th>
                          <th className="p-3.5">Rôle</th>
                          <th className="p-3.5">Score ATS</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {users.map((u) => {
                          const isStudent = u.userType === "student";
                          const isUserAdmin = u.role === "admin";

                          return (
                            <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3.5 font-bold text-white flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                                  {u.name.slice(0, 1).toUpperCase()}
                                </div>
                                <span>{u.name}</span>
                              </td>
                              <td className="p-3.5 text-slate-400">{u.email}</td>
                              <td className="p-3.5">
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    isStudent
                                      ? "bg-purple-900/40 text-purple-300 border border-purple-700/50"
                                      : "bg-red-900/40 text-red-300 border border-red-700/50"
                                  }`}
                                >
                                  {isStudent ? "🎓 Étudiant (PFE)" : "💼 Professionnel"}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    isUserAdmin
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-slate-800 text-slate-400"
                                  }`}
                                >
                                  {isUserAdmin ? "👑 Admin" : "Candidat"}
                                </span>
                              </td>
                              <td className="p-3.5">
                                {u.atsScore !== null && u.atsScore !== undefined ? (
                                  <span className="text-emerald-400 font-bold text-xs">
                                    {u.atsScore} / 100
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">Pas de CV</span>
                                )}
                              </td>
                              <td className="p-3.5 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleToggleUserPersona(u.id, u.userType)}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                                  title="Basculer entre Étudiant et Salarié"
                                >
                                  Changer en {isStudent ? "Salarié" : "Étudiant"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: SYSTEM SETTINGS & GEMINI AI */}
            {/* ========================================================================= */}
            {activeTab === "settings" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl animate-in fade-in">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-amber-400" />
                    <span>Paramètres Globaux du Système & IA</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Configurez le modèle Gemini, la bannière d&apos;annonce et les fréquences de synchronisation.
                  </p>
                </div>

                {/* Gemini Model Selection */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Modèle d&apos;Intelligence Artificielle Actif</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        geminiModel === "gemini-1.5-pro"
                          ? "border-amber-500 bg-amber-500/10 text-white"
                          : "border-slate-800 bg-slate-800/40 text-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="geminiModel"
                        value="gemini-1.5-pro"
                        checked={geminiModel === "gemini-1.5-pro"}
                        onChange={(e) => setGeminiModel(e.target.value)}
                        className="sr-only"
                      />
                      <div className="font-bold text-xs">Gemini 1.5 Pro (Recommandé)</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Raisonnement maximal pour scorings ATS complexes et lettres sur-mesure.
                      </div>
                    </label>

                    <label
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        geminiModel === "gemini-1.5-flash"
                          ? "border-amber-500 bg-amber-500/10 text-white"
                          : "border-slate-800 bg-slate-800/40 text-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="geminiModel"
                        value="gemini-1.5-flash"
                        checked={geminiModel === "gemini-1.5-flash"}
                        onChange={(e) => setGeminiModel(e.target.value)}
                        className="sr-only"
                      />
                      <div className="font-bold text-xs">Gemini 1.5 Flash (Ultra Rapide)</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Vitesse d&apos;exécution extrême et coûts d&apos;inférence minimaux.
                      </div>
                    </label>
                  </div>
                </div>

                {/* Site Announcement Banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <span>Bannière d&apos;Annonce Globale (Broadcast)</span>
                    </h3>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bannerEnabled}
                        onChange={(e) => setBannerEnabled(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-0"
                      />
                      <span>Activer sur tout le site</span>
                    </label>
                  </div>

                  <textarea
                    rows={2}
                    value={bannerMessage}
                    onChange={(e) => setBannerMessage(e.target.value)}
                    placeholder="Message affiché à tous les visiteurs et candidats..."
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Scraper Frequency */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Fréquence du Scraper Automatique</span>
                  </h3>
                  <select
                    value={scraperInterval}
                    onChange={(e) => setScraperInterval(Number(e.target.value))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value={2}>Toutes les 2 heures (Intensif)</option>
                    <option value={6}>Toutes les 6 heures (Recommandé)</option>
                    <option value={12}>Toutes les 12 heures</option>
                    <option value={24}>Toutes les 24 heures (Quotidien)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer les Paramètres Système</span>
                </button>
              </form>
            )}
          </>
        )}
      </main>

      {/* Modal: Add Partner Job */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Publier une Offre Partenaire Exclusive</span>
              </h3>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Titre du poste *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ingénieur DevOps Cloud / Stage PFE IA"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Entreprise *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: InstaDeep Labs / Focus Corp"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Localisation *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Tunis, Lac 2"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Type de Contrat</label>
                  <select
                    value={newJobCategory}
                    onChange={(e) => setNewJobCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CIVP">CIVP / SIVP</option>
                    <option value="Karama">Karama</option>
                    <option value="Stage PFE">Stage PFE</option>
                    <option value="Stage Été">Stage d&apos;été</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Lien de Candidature</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newJobUrl}
                    onChange={(e) => setNewJobUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Compétences Requises</label>
                <input
                  type="text"
                  placeholder="ex: React, Node.js, Docker, Git"
                  value={newJobRequirements}
                  onChange={(e) => setNewJobRequirements(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Description détaillée de l'offre..."
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={newJobFeatured}
                  onChange={(e) => setNewJobFeatured(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-0"
                />
                <label htmlFor="featuredCheck" className="text-slate-300 font-medium">
                  Épingler cette offre en tête de liste (Sponsorisée / Vedette)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Publier l&apos;Offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
