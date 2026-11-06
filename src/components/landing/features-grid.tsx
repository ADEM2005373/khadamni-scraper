import React from "react";
import { Bot, Search, Award, TrendingUp, Sparkles, Database, FileText, Check } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      id: "scraper",
      badge: "Moteur Temps Réel",
      badgeColor: "bg-red-100 text-red-700 border-red-200",
      title: "Automated Multi-Portal Scraper",
      description:
        "Playwright bots crawl TanitJobs, Keejob, and Tunisian corporate portals around the clock. Automatic deduplication, clean requirement extraction, and zero expired job listings.",
      icon: Search,
      iconColor: "text-red-600 bg-red-50",
      bullets: [
        "Indexation TanitJobs & Keejob 24/7",
        "Nettoyage automatique des doublons",
        "Filtrage par gouvernorat (Tunis, Sousse, Sfax, etc.)",
      ],
    },
    {
      id: "ats",
      badge: "Gemini 1.5 Pro AI",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      title: "ATS Resume Optimization",
      description:
        "Téléversez votre CV au format PDF. Le moteur Gemini extrait instantanément vos compétences, identifie les mots-clés manquants et vous attribue un score ATS certifié conforme aux recruteurs.",
      icon: FileText,
      iconColor: "text-emerald-600 bg-emerald-50",
      bullets: [
        "Parsing instantané des fichiers PDF",
        "Score ATS sur 100 avec benchmark marché",
        "Recommandations de compétences recherchées en Tunisie",
      ],
    },
    {
      id: "matches",
      badge: "Sélection Sur-Mesure",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
      title: "Top 10 Curated Matches",
      description:
        "Fini de parcourir des centaines d'annonces non pertinentes. Recevez chaque matin les 10 meilleures offres d'emploi tunisiennes alignées au millimètre avec votre profil et vos ambitions.",
      icon: Award,
      iconColor: "text-amber-600 bg-amber-50",
      bullets: [
        "Algorithme de similarité sémantique vectorielle",
        "Classification par type de contrat (CDI, Sivp, Stage)",
        "Alertes instantanées sur les postes à forte valeur",
      ],
    },
    {
      id: "forecaster",
      badge: "IA Prédictive",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      title: "AI Application Success Forecaster",
      description:
        "Estimez avec précision vos chances de décrocher un entretien avant même de postuler. Notre modèle confronte les exigences de l'employeur à vos atouts pour optimiser vos candidatures.",
      icon: TrendingUp,
      iconColor: "text-purple-600 bg-purple-50",
      bullets: [
        "Pourcentage de compatibilité en temps réel",
        "Conseils de personnalisation lettre & CV",
        "Suivi du cycle de vie de candidature",
      ],
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technologies de pointe au service de votre carrière</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Pourquoi choisir <span className="text-red-600">Khadamni Scraper</span> ?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Une suite complète alliant web scraping automatisé et intelligence artificielle pour
            dominer le marché du travail en Tunisie.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feat.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${feat.badgeColor}`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-2.5">
                  {feat.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
