import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Briefcase, FileText, ChevronRight } from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { StatsTicker } from "@/components/landing/stats-ticker";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { JobPreviewSection } from "@/components/landing/job-preview-card";
import { InstantCvScanner } from "@/components/landing/instant-cv-scanner";
import { PricingSection } from "@/components/landing/pricing-section";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-red-500/20 selection:text-red-700">
      {/* Navigation Header */}
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-red-200/30 via-slate-100/50 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Tunisia AI Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-bold tracking-wide shadow-xs animate-in fade-in duration-500">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span>Plateforme IA N°1 du Marché de l&apos;Emploi Tunisien</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.1]">
              Automate Your Job Hunt in{" "}
              <span className="text-red-600 underline decoration-red-300 decoration-wavy">
                Tunisia
              </span>{" "}
              with AI
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Fini la recherche manuelle sur les <strong>10 portails d&apos;emploi tunisiens</strong> (TanitJobs, LinkedIn Jobs, Keejob, ANETI, Optioncarriere, CRIT, CareerJet, Bayt, Farah & Expertini).
              Khadamni Scraper extrait les annonces en direct, optimise votre CV avec
              l&apos;IA <strong>Gemini</strong> et prédit vos chances d&apos;embauche.
            </p>

            {/* Prominent CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-xl shadow-red-600/25 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition-all"
              >
                <Briefcase className="w-5 h-5 text-slate-500" />
                <span>Explorer les Offres (Live)</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Indexation continue des 10 portails tunisiens
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Scoring ATS certifié par IA Gemini
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% adapté aux profils tunisiens
              </span>
            </div>
          </div>
        </section>

        {/* Live Instant Free CV Scanner (Freemium Hook) */}
        <InstantCvScanner />

        {/* Live Platform Stats Ticker */}
        <StatsTicker />

        {/* Live Scraped Jobs Preview Section */}
        <JobPreviewSection />

        {/* Features Grid */}
        <FeaturesGrid />

        {/* How It Works 3-Step Timeline */}
        <section id="how-it-works" className="py-24 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-red-600">
                Processus Intelligent
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Comment fonctionne Khadamni Scraper ?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Trois étapes simples pour transformer votre recherche d&apos;emploi en succès mesurable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 space-y-4 text-left relative">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-600/20">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Importez votre CV (PDF)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Téléversez votre curriculum vitae en quelques secondes. Vos données restent sécurisées sur notre infrastructure chiffrée.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 space-y-4 text-left relative">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-lg flex items-center justify-center shadow-md">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Analyse ATS & Scraping Automatisé
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Notre modèle Gemini extrait vos forces et compétences tandis que les robots Playwright scannent les portails tunisiens en direct.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 space-y-4 text-left relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-600/20">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recevez vos Matchs & Postulez
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Consultez votre Top 10 quotidien avec les pourcentages de prédiction de réussite et candidatez en priorité sur les meilleures opportunités.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (15-25 DT / month) */}
        <PricingSection />

        {/* High Converting Bottom CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/30">
              <Zap className="w-3.5 h-3.5" />
              <span>Accélérez votre carrière dès aujourd&apos;hui</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Prêt à trouver votre prochain job en Tunisie ?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Rejoignez plus de 3,400 professionnels tunisiens qui utilisent Khadamni Scraper pour
              optimiser leur recherche d&apos;emploi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xl shadow-red-600/30 transition-all hover:scale-105"
              >
                Créer un Compte Gratuit
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all"
              >
                Accéder au Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
