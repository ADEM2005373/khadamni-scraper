export type TunisianJobSource =
  | "TanitJobs"
  | "LinkedIn Jobs"
  | "Keejob"
  | "Emploi.nat.tn (ANETI)"
  | "Optioncarriere.tn"
  | "CRIT Tunisie"
  | "CareerJet"
  | "Bayt"
  | "Farah.tn"
  | "Expertini"
  | "PFEBooks.com"
  | string;

export interface PortalMetadata {
  id: string;
  name: TunisianJobSource;
  officialUrl: string;
  searchUrl: string;
  description: string;
  badgeColor: string;
}

export const TUNISIAN_PORTALS: PortalMetadata[] = [
  {
    id: "tanitjobs",
    name: "TanitJobs",
    officialUrl: "https://www.tanitjobs.com",
    searchUrl: "https://www.tanitjobs.com/jobs/?searchId=1&action=search",
    description: "Portail leader de recrutement et d'offres d'emploi en Tunisie",
    badgeColor: "bg-red-100 text-red-800 border-red-200",
  },
  {
    id: "linkedin",
    name: "LinkedIn Jobs",
    officialUrl: "https://www.linkedin.com/jobs",
    searchUrl: "https://www.linkedin.com/jobs/search?location=Tunisia",
    description: "Offres professionnelles tech et cadres en Tunisie et à l'international",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
  },
  {
    id: "keejob",
    name: "Keejob",
    officialUrl: "https://www.keejob.com",
    searchUrl: "https://www.keejob.com/offres-emploi/",
    description: "Plateforme tunisienne d'offres certifiées CDI, CDD et stages",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "aneti",
    name: "Emploi.nat.tn (ANETI)",
    officialUrl: "https://www.emploi.nat.tn",
    searchUrl: "https://www.emploi.nat.tn",
    description: "Agence Nationale pour l'Emploi et le Travail Indépendant",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "optioncarriere",
    name: "Optioncarriere.tn",
    officialUrl: "https://www.optioncarriere.tn",
    searchUrl: "https://www.optioncarriere.tn/emploi-tunisie.html",
    description: "Moteur de recherche d'emploi et agrégateur d'annonces en Tunisie",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "crit",
    name: "CRIT Tunisie",
    officialUrl: "https://www.crit-tunisie.net",
    searchUrl: "https://www.crit-tunisie.net/offres-d-emploi",
    description: "Cabinet de recrutement international et travail temporaire en Tunisie",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
  },
  {
    id: "careerjet",
    name: "CareerJet",
    officialUrl: "https://www.careerjet.com.tn",
    searchUrl: "https://www.careerjet.com.tn/emploi-tunisie.html",
    description: "Agrégateur multi-sources d'offres d'emploi tunisiennes",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    id: "bayt",
    name: "Bayt",
    officialUrl: "https://www.bayt.com/en/tunisia",
    searchUrl: "https://www.bayt.com/en/tunisia/jobs/",
    description: "Plateforme majeure d'emploi dans la région MENA et Tunisie",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  {
    id: "farah",
    name: "Farah.tn",
    officialUrl: "https://www.farah.tn",
    searchUrl: "https://www.farah.tn",
    description: "Portail tunisien d'annonces d'emploi et de formation",
    badgeColor: "bg-violet-100 text-violet-800 border-violet-200",
  },
  {
    id: "expertini",
    name: "Expertini",
    officialUrl: "https://tn.expertini.com",
    searchUrl: "https://tn.expertini.com/jobs/",
    description: "Moteur de recherche d'offres qualifiées et carrières en Tunisie",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    id: "pfebooks",
    name: "PFEBooks.com",
    officialUrl: "https://pfebooks.com",
    searchUrl: "https://pfebooks.com/catalogue/",
    description: "Portail n°1 des catalogues PFE Book et stages de fin d'études en Tunisie",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
];

export interface ScrapedJobRaw {
  source_site: TunisianJobSource;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  requirements?: string;
  url: string;
  category?: "Full-Time" | "Internship" | "Part-Time" | "Freelance" | string;
  scraped_at?: Date;
  scrapedAt?: Date;
}

export interface ScraperResult {
  source: string;
  success: boolean;
  jobsFound: number;
  jobs: ScrapedJobRaw[];
  errors?: string[];
  executionTimeMs: number;
}
