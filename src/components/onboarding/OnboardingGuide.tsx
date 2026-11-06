"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  FileText,
  LineChart,
  UserCheck,
  Globe,
  Share2,
  UploadCloud,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OnboardingGuideProps {
  hasCompletedOnboarding?: boolean;
  forceOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export function OnboardingGuide({
  hasCompletedOnboarding,
  forceOpen = false,
  onClose,
  onComplete,
}: OnboardingGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (hasCompletedOnboarding !== undefined) {
      setIsOpen(!hasCompletedOnboarding);
      return;
    }

    // Check localStorage fallback for first-time visitor status
    const storedStatus =
      localStorage.getItem("hasCompletedOnboarding") ||
      localStorage.getItem("khadamni_onboarding_completed");

    if (storedStatus !== "true") {
      setIsOpen(true);
    }
  }, [forceOpen, hasCompletedOnboarding]);

  const handleFinish = async () => {
    // 1. Persist to localStorage
    localStorage.setItem("hasCompletedOnboarding", "true");
    localStorage.setItem("khadamni_onboarding_completed", "true");

    // 2. Optional background sync with API profile if authenticated
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hasCompletedOnboarding: true }),
      });
    } catch (e) {
      // Non-blocking fail-safe
    }

    setIsOpen(false);
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header & Progress */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-red-500/20">
              K
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-red-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Virtual Onboarding Guide
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Step {currentStep} of {totalSteps}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? "w-7 bg-red-600"
                      : step < currentStep
                      ? "w-2.5 bg-emerald-500"
                      : "w-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to step ${step}`}
                />
              ))}
            </div>

            {/* Close / Skip X Button */}
            <button
              onClick={handleFinish}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Skip / Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Walkthrough Step Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: Welcome to Khadamni Scraper — How automated Tunisian job scraping works */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
                <Globe className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome to Khadamni Scraper 🇹🇳
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Discover how automated Tunisian job scraping revolutionizes your search across <strong>TanitJobs</strong>, <strong>Keejob</strong>, and corporate portals.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-red-50/30 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-red-600" />
                  Continuous Playwright Web Scraping Engine
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">TanitJobs.com</span>
                      <p className="text-slate-500 text-[11px]">Real-time tech, finance, and engineering listings</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">Keejob.com</span>
                      <p className="text-slate-500 text-[11px]">Direct corporate enterprise recruitment pipelines</p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Every offer is cleansed, deduplicated, and synchronized daily into our PostgreSQL database with zero expired listings.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Profile & Portfolio Setup — Linking LinkedIn, GitHub, and personal portfolio */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <UserCheck className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Profile & Portfolio Setup
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Link your professional accounts to enrich your AI candidate profile and boost recruiter engagement in the Tunisian ecosystem.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center font-bold">
                      in
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">LinkedIn Profile URL</span>
                      <p className="text-slate-500 text-[11px]">Enables automatic skill cross-referencing</p>
                    </div>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded text-[11px]">
                    Recommended
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                      GH
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">GitHub Profile URL</span>
                      <p className="text-slate-500 text-[11px]">Highlights repositories, open source contributions, and commits</p>
                    </div>
                  </div>
                  <span className="text-slate-700 bg-slate-200 font-medium px-2 py-0.5 rounded text-[11px]">
                    Optional
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Personal Portfolio Website</span>
                      <p className="text-slate-500 text-[11px]">Showcases case studies and interactive project demos</p>
                    </div>
                  </div>
                  <span className="text-slate-700 bg-slate-200 font-medium px-2 py-0.5 rounded text-[11px]">
                    Optional
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ATS CV Uploader — Why uploading a PDF CV enables smart AI matching */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <FileText className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  ATS CV Uploader & AI Matching
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Uploading your resume in <strong>PDF format</strong> activates our Gemini AI engine to extract skills, compute your ATS score, and benchmark your readiness.
                </p>
              </div>

              <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    How Gemini ATS Parsing Works:
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    ATS Score / 100
                  </span>
                </div>

                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Deep Skill Extraction:</strong> Detects technical frameworks, certifications, and years of experience.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ATS Formatting Diagnosis:</strong> Flags layout blockers, missing keywords, and readability issues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Encrypted Supabase Storage:</strong> Your PDF is securely stored and private to your account.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 4: Intelligence Dashboard — Reading charts, matching scores, and top 10 jobs */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Intelligence Dashboard & Top 10 Curated Jobs
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your personalized dashboard analyzes daily market dynamics and ranks Tunisian job opportunities with predictive hireability scores.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                    <LineChart className="w-3.5 h-3.5" />
                    Recharts Analytics
                  </div>
                  <p className="text-xs text-slate-600">
                    Track the daily flow of scraped jobs across Tunisian governorates and your application rate.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Top 10 Curated Matches
                  </div>
                  <p className="text-xs text-slate-600">
                    Each job features an AI predicted success rate (e.g. 89% High Chance) to prioritize your applications.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                <span>You are all set to start automating your job search in Tunisia!</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFinish}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Skip / Get Started
            </Button>
          </div>

          <div className="flex items-center gap-2.5">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="text-xs border-slate-300 text-slate-700 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleNext}
              className={`text-xs font-bold px-4 ${
                currentStep === totalSteps
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25"
              }`}
            >
              {currentStep === totalSteps ? (
                <>
                  <span>Get Started</span>
                  <CheckCircle2 className="w-3.5 h-3.5 ml-1.5" />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingGuide;
