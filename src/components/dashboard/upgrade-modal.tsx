"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Check,
  CreditCard,
  GraduationCap,
  Briefcase,
  X,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPlan?: "student" | "pro";
}

export function UpgradeModal({
  isOpen,
  onClose,
  onSuccess,
  initialPlan = "pro",
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"student" | "pro">(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<"flouci" | "konnect" | "d17" | "carte">("flouci");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          paymentMethod,
          billingCycle: "monthly",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 2200);
      } else {
        setErrorMessage(data.error || "Impossible d'initier le paiement.");
      }
    } catch {
      setErrorMessage("Erreur de connexion avec la passerelle de paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Abonnement Activé avec Succès !
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Bienvenue dans Khadamni {selectedPlan === "student" ? "Pack Étudiant (15 DT)" : "Pack Pro (25 DT)"}. Toutes les fonctionnalités avancées de l&apos;IA sont débloquées.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Accélérez vos Candidatures</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Passez à Khadamni Pro
              </h3>
              <p className="text-xs text-slate-500">
                Générez des lettres de motivation illimitées et optimisez votre CV pour chaque offre.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan("student")}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedPlan === "student"
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-800 mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Étudiant / PFE</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-black text-slate-900">15</span>
                    <span className="text-xs font-bold text-slate-700">DT</span>
                    <span className="text-[10px] text-slate-400">/mois</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Scans ATS illimités & lettres de stage PFE
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("pro")}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  selectedPlan === "pro"
                    ? "border-red-600 bg-red-50/60 ring-2 ring-red-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                  Recommandé
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-red-800 mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pack Pro & CDI</span>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-black text-slate-900">25</span>
                    <span className="text-xs font-bold text-slate-700">DT</span>
                    <span className="text-[10px] text-slate-400">/mois</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Lettres IA illimitées & réécriture de CV
                </p>
              </button>
            </div>

            {/* Payment Method Selector (Tunisian Local) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Moyen de Paiement Sécurisé (Tunisie)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("flouci")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    paymentMethod === "flouci"
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-1 ring-indigo-500/30"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Flouci Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("konnect")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    paymentMethod === "konnect"
                      ? "border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-500/30"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Konnect / Paymee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("carte")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    paymentMethod === "carte"
                      ? "border-red-600 bg-red-50/60 text-red-900 ring-1 ring-red-500/30"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-red-600" />
                  <span>Carte Bancaire GIE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("d17")}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    paymentMethod === "d17"
                      ? "border-amber-600 bg-amber-50/60 text-amber-900 ring-1 ring-amber-500/30"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>D17 / La Poste</span>
                </button>
              </div>
            </div>

            {/* Reassurance text */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Paiement sécurisé en Dinars Tunisiens • Sans engagement, résiliable en 1 clic.</span>
            </div>

            {/* Action Button */}
            <Button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all hover:scale-101"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Connexion avec {paymentMethod.toUpperCase()}...</span>
                </>
              ) : (
                <span>
                  Activer mon Pack ({selectedPlan === "student" ? "15 DT" : "25 DT"} / mois)
                </span>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
