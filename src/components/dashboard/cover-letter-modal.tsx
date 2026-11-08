"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Loader2,
  X,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoverLetterModalProps {
  job: {
    jobTitle: string;
    companyName: string;
    location?: string;
    description?: string;
    requirements?: string;
  };
  userType?: "student" | "worker";
  triggerClassName?: string;
  buttonVariant?: "default" | "secondary" | "outline" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export function CoverLetterModal({
  job,
  userType,
  triggerClassName = "",
  buttonVariant = "outline",
  buttonSize = "sm",
}: CoverLetterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isStage =
    userType === "student" ||
    (userType !== "worker" &&
      /\b(stage|pfe|stagiaire|internship|intern)\b/i.test(job.jobTitle));

  const generateLetter = async (lang: "fr" | "en" = language) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          description: job.description,
          requirements: job.requirements,
          language: lang,
          userType: userType || (isStage ? "student" : "worker"),
        }),
      });

      const data = await res.json();
      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
      } else {
        setErrorMessage(data.error || "Impossible de générer la lettre.");
      }
    } catch {
      setErrorMessage("Erreur de connexion au service IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!coverLetter) {
      generateLetter(language);
    }
  };

  const handleLanguageChange = (newLang: "fr" | "en") => {
    setLanguage(newLang);
    generateLetter(newLang);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch (e) {
      console.error("Could not copy to clipboard:", e);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const sanitizedTitle = job.jobTitle.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
    element.download = `Lettre_Motivation_${sanitizedTitle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleOpen}
        className={`text-xs font-semibold gap-1.5 transition-all ${triggerClassName}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>{isStage ? "Demande Stage IA" : "Lettre IA"}</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-b from-slate-50 to-white">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Rédigé par Gemini IA</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {isStage ? "Demande de Stage PFE Sur-Mesure" : "Lettre de Motivation Sur-Mesure"}
                </h3>
                <p className="text-xs text-slate-500">
                  Personnalisée pour {isStage ? "le stage" : "le poste"} de{" "}
                  <strong className="text-slate-700">{job.jobTitle}</strong> chez{" "}
                  <strong className="text-slate-700">{job.companyName}</strong>
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Toolbar & Actions */}
            <div className="px-5 sm:px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-600">Langue :</span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      language === "fr"
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      language === "en"
                        ? "bg-red-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generateLetter(language)}
                  disabled={isLoading}
                  className="text-xs font-semibold h-8"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  )}
                  <span>Régénérer</span>
                </Button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Génération de votre lettre personnalisée par Gemini IA...
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-sm text-center">
                    Alignement des compétences avec les exigences du recruteur et adaptation au marché tunisien.
                  </p>
                </div>
              ) : errorMessage ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMessage}
                </div>
              ) : (
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-80 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-xs sm:text-sm font-sans leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none shadow-inner"
                  placeholder="Votre lettre apparaîtra ici..."
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Vous pouvez modifier le texte avant de le copier.
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!coverLetter || isLoading}
                  className="text-xs font-semibold gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Télécharger</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleCopy}
                  disabled={!coverLetter || isLoading}
                  className={`text-xs font-bold gap-1.5 ${
                    hasCopied
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier la lettre</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CoverLetterModal;
