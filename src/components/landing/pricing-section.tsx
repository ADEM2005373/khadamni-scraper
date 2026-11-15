"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  Briefcase,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">("monthly");

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-red-100/40 via-slate-100/60 to-red-50/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-700 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investissement Rentable & Accessible</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Des tarifs simples, transparents et en <span className="text-red-600">Dinars Tunisiens</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Moins cher que deux cafés par semaine pour décrocher votre job ou stage PFE 3 fois plus vite. Inscription 100% gratuite sans carte bancaire requise.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold ${
                billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Mensuel
            </span>
            <button
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "quarterly" : "monthly")
              }
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors focus:outline-none"
              style={{ backgroundColor: billingCycle === "quarterly" ? "#dc2626" : undefined }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "quarterly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-bold ${
                  billingCycle === "quarterly" ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Trimestriel (Spécial PFE)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Économisez 25%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* 1. Free Discovery Tier */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  Découverte
                </span>
                <h3 className="text-2xl font-bold text-slate-900">Gratuit</h3>
                <p className="text-xs text-slate-500">
                  Idéal pour explorer les offres d&apos;emploi et tester l&apos;IA sans débourser un millime.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">0</span>
                <span className="text-xl font-bold text-slate-700">DT</span>
                <span className="text-xs text-slate-400 font-medium">/ pour toujours</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 font-medium pt-4 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accès complet aux 10 portails tunisiens en direct</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1 Scan ATS de CV offert</strong> avec rapport de score</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Aperçu de vos 3 meilleures correspondances d&apos;emploi</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Tableau de bord de suivi de candidatures (Kanban)</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all"
              >
                Commencer Gratuitement
              </Link>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Aucune carte bancaire requise
              </p>
            </div>
          </div>

          {/* 2. Pack Étudiant / Stage PFE */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Pack Étudiant & PFE
                </span>
                <h3 className="text-2xl font-bold text-slate-900">Spécial Stages</h3>
                <p className="text-xs text-slate-500">
                  Conçu sur-mesure pour les étudiants cherchant leur stage PFE ou 1er emploi CIVP.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  {billingCycle === "monthly" ? "15" : "35"}
                </span>
                <span className="text-xl font-bold text-slate-700">DT</span>
                <span className="text-xs text-slate-400 font-medium">
                  {billingCycle === "monthly" ? "/ mois" : "/ trimestre (3 mois)"}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 font-medium pt-4 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Scans ATS illimités</strong> avec re-scoring en direct</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Générateur de <strong>demandes de Stage PFE</strong> & conventions IA</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Filtre exclusif offres Stages PFE & contrats CIVP vérifiés</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Alertes instantanées dès qu&apos;une entreprise publie un sujet</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/register?plan=student"
                className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-102"
              >
                Choisir le Pack Étudiant
              </Link>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Paiement par Flouci, Konnect ou D17
              </p>
            </div>
          </div>

          {/* 3. Pack Pro / Chercheur d'emploi (Featured) */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 border-2 border-red-500 shadow-xl flex flex-col justify-between relative transform lg:-translate-y-3">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-red-600/40">
              🔥 Le Plus Populaire en Tunisie
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                  <Zap className="w-3.5 h-3.5" />
                  Pack Pro & Reconversion
                </span>
                <h3 className="text-2xl font-bold text-white">Candidat VIP</h3>
                <p className="text-xs text-slate-300">
                  Pour les professionnels et développeurs qui veulent maximiser leurs entretiens.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">
                  {billingCycle === "monthly" ? "25" : "59"}
                </span>
                <span className="text-xl font-bold text-red-400">DT</span>
                <span className="text-xs text-slate-400 font-medium">
                  {billingCycle === "monthly" ? "/ mois" : "/ trimestre"}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200 font-medium pt-4 border-t border-slate-800">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Lettres de motivation IA illimitées</strong> (Français & Anglais)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Optimisation de CV sur-mesure</strong> pour chaque offre</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Calcul prédictif des <strong>chances de réussite</strong> par poste</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Alertes WhatsApp prioritaires dès qu&apos;une offre correspond</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Support prioritaire et conseils d&apos;optimisation</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/register?plan=pro"
                className="w-full inline-flex items-center justify-center py-4 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105"
              >
                <span>Débloquer le Pack Pro</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Sans engagement • Annulable à tout moment en 1 clic
              </p>
            </div>
          </div>
        </div>

        {/* Local Payment Badges & Trust Banner */}
        <div className="mt-16 max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Moyens de paiement 100% locaux & sécurisés
            </h4>
            <p className="text-xs text-slate-500">
              Payez en toute simplicité en Dinars Tunisiens (TND) sans carte internationale.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-red-600" />
              <span>Carte Bancaire (GIE Monétique)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-indigo-700">
              <span>Flouci (Mobile Wallet)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-emerald-700">
              <span>Konnect / Paymee</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-amber-700">
              <span>D17 / La Poste Tunisienne</span>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Micro */}
        <div className="mt-16 max-w-3xl mx-auto space-y-4">
          <h3 className="text-lg font-bold text-center text-slate-900 mb-6">
            Questions Fréquentes sur les Abonnements
          </h3>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Dois-je payer dès mon inscription ?</h4>
            <p className="text-slate-600">
              Non, absolument pas ! L&apos;inscription est 100% gratuite. Vous pouvez consulter toutes les offres des 10 portails et tester votre premier scan de CV gratuitement. Vous ne passez au pack Pro (15 ou 25 DT) que si vous souhaitez générer des lettres de motivation illimitées et booster votre profil.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Puis-je annuler mon abonnement quand je veux ?</h4>
            <p className="text-slate-600">
              Oui, en 1 clic directement depuis votre tableau de bord. Il n&apos;y a aucun engagement de durée. Une fois que vous avez décroché votre job ou votre stage, vous pouvez résilier immédiatement.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900">Que faire si je n&apos;ai pas de carte bancaire ?</h4>
            <p className="text-slate-600">
              Vous pouvez régler directement via l&apos;application Flouci, par carte e-Dinar D17 de la Poste Tunisienne, ou par simple virement bancaire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
