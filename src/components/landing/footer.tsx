import React from "react";
import Link from "next/link";
import { Briefcase, Heart, Shield, Globe2, Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                K
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Khadamni <span className="text-red-500">Scraper</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              La plateforme intelligente de scraping d&apos;offres d&apos;emploi et d&apos;optimisation de CV par IA, spécialement conçue pour les talents et le marché du travail en Tunisie.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Globe2 className="w-4 h-4 text-red-500" />
              <span>Conçu pour le marché tunisien • Tunis, Sousse, Sfax</span>
            </div>
          </div>

          {/* Column 1: Plateforme */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plateforme</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Scraping Playwright
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Analyse ATS Gemini
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors text-red-400 font-semibold">
                  Toutes les Offres (220+)
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Flux TanitJobs & 10 Portails
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Prédiction d&apos;Embauche
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Candidats */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Candidats</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-white transition-colors">
                  Téléverser mon CV PDF
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portails Indexés */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Écosystème</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>TanitJobs.com</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Keejob.com</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>OptionCarriere (Soon)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>LinkedIn TN (Roadmap)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Khadamni Scraper. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Confidentialité</span>
            <span className="hover:text-slate-400 cursor-pointer">Conditions d&apos;utilisation</span>
            <span className="hover:text-slate-400 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
