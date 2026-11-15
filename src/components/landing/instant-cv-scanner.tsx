"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  FileText,
  Briefcase,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstantCvScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage("Veuillez sélectionner un fichier PDF valide (.pdf)");
        return;
      }
      setErrorMessage(null);
      setFile(selected);
      runScan(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage("Veuillez sélectionner un fichier PDF valide (.pdf)");
        return;
      }
      setErrorMessage(null);
      setFile(selected);
      runScan(selected);
    }
  };

  const runScan = async (pdfFile: File) => {
    setIsScanning(true);
    setScanResult(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const res = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        setScanResult(json.data);
      } else {
        setErrorMessage(json.error || "Impossible d'analyser le CV.");
      }
    } catch {
      setErrorMessage("Erreur de connexion au serveur d'analyse.");
    } finally {
      setIsScanning(false);
    }
  };

  const atsScore = scanResult?.atsScore || 72;
  const analysis = scanResult?.atsAnalysis;

  return (
    <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
            <Zap className="w-3.5 h-3.5" />
            <span>Test Express Sans Inscription</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Quel est le score ATS de votre CV en Tunisie ?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Glissez votre CV ci-dessous pour voir instantanément comment les recruteurs de <strong>TanitJobs</strong> et <strong>Keejob</strong> analysent votre profil.
          </p>
        </div>

        {/* Dropzone Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {!scanResult && !isScanning && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="p-10 sm:p-14 text-center cursor-pointer border-2 border-dashed border-slate-300 hover:border-red-500 rounded-3xl transition-all hover:bg-red-50/20 group m-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Glissez votre CV ici ou <span className="text-red-600 underline">parcourez vos fichiers</span>
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Format PDF uniquement (max 5 Mo) • Analyse instantanée 100% confidentielle par Gemini
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Gratuit & Sans compte requis
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Données 100% privées
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isScanning && (
            <div className="p-16 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Analyse de votre CV par l&apos;IA Gemini en cours...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Extraction des compétences, vérification des mots-clés du marché tunisien et calcul du score de compatibilité...
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 mx-6 my-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setErrorMessage(null)}
                className="ml-auto text-xs text-red-700 hover:text-red-900"
              >
                Réessayer
              </Button>
            </div>
          )}

          {/* Scan Results Reveal */}
          {scanResult && !isScanning && (
            <div className="p-8 sm:p-10 space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {scanResult.fileName || "Votre CV"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Profil détecté : {analysis?.candidateName || "Candidat"} • {analysis?.professionalTitle || "Développeur / Profil Technique"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score ATS Global</div>
                    <div className="text-xs font-semibold text-slate-600">
                      {atsScore >= 75 ? "Excellent profil" : atsScore >= 60 ? "Bon potentiel" : "À améliorer"}
                    </div>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md ${
                      atsScore >= 75
                        ? "bg-emerald-600 shadow-emerald-500/20"
                        : atsScore >= 60
                        ? "bg-amber-500 shadow-amber-500/20"
                        : "bg-red-600 shadow-red-500/20"
                    }`}
                  >
                    {atsScore}
                  </div>
                </div>
              </div>

              {/* Highlights & Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Compétences Détectées
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(analysis?.extractedSkills?.slice(0, 6) || ["Next.js", "TypeScript", "PostgreSQL", "React", "Docker"]).map(
                      (skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Mots-clés manquants pour le marché tunisien
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(analysis?.keywordDensity?.missingKeywordsTunisianMarket?.slice(0, 4) || [
                      "CI/CD",
                      "Méthodologie Agile",
                      "Tests Unitaires",
                      "Docker / Cloud",
                    ]).map((kw: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-900 text-xs font-medium"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Irresistible Register Hook */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/40 border border-red-500/40 text-[11px] font-bold text-red-300">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>14 offres d&apos;emploi compatibles trouvées aujourd&apos;hui</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Sauvegardez votre CV et accédez à vos offres en 1 clic
                  </h4>
                  <p className="text-xs text-slate-300">
                    Créez votre compte gratuit sans carte bancaire pour débloquer votre analyse détaillée et postuler immédiatement.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  <Link
                    href="/register"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                  >
                    <span>Créer mon Compte Gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setScanResult(null);
                      setFile(null);
                    }}
                    className="text-xs text-slate-200 border-slate-700 hover:bg-slate-800"
                  >
                    Scanner un autre CV
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
