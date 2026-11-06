import fs from "fs";
import path from "path";
import { ScrapedJobRaw, TunisianJobSource } from "@/services/scraper/types";

export interface StoredJob {
  id: string;
  source_site: TunisianJobSource;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  requirements: string | null;
  url: string;
  scraped_at: string;
  category: string;
  predicted_chance: number;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(DATA_DIR, "scraped_jobs.json");

// Rich, high-diversity pre-seeded Tunisian jobs across all 10 official portals
const INITIAL_DIVERSE_JOBS: StoredJob[] = [
  // 1. TanitJobs
  {
    id: "tanit-1",
    source_site: "TanitJobs",
    job_title: "Développeur Full-Stack Next.js / TypeScript",
    company_name: "TechSolutions Tunisia",
    location: "Tunis, Les Berges du Lac",
    description: "Développement d'applications cloud scalables avec Next.js 14, Node.js et PostgreSQL pour le marché européen.",
    requirements: "Next.js, TypeScript, PostgreSQL, Tailwind CSS, Docker, Git",
    url: "https://www.tanitjobs.com/job/dev-fullstack-nextjs-tunis-8841",
    scraped_at: new Date(Date.now() - 3600000).toISOString(),
    category: "CDI",
    predicted_chance: 94,
  },
  {
    id: "tanit-2",
    source_site: "TanitJobs",
    job_title: "Comptable Confirmé(e) & Contrôleur de Gestion",
    company_name: "Ben Yedder Consulting & Audit",
    location: "Ariana, Centre Urbain",
    description: "Tenue intégrale de la comptabilité générale et analytique, déclarations fiscales et bilans de fin d'exercice.",
    requirements: "Master ou Licence Comptabilité/Finance, Sage, Excel avancé, 3+ ans d'expérience",
    url: "https://www.tanitjobs.com/job/comptable-confirme-ariana-2063",
    scraped_at: new Date(Date.now() - 7200000).toISOString(),
    category: "CDI",
    predicted_chance: 86,
  },
  {
    id: "tanit-3",
    source_site: "TanitJobs",
    job_title: "Superviseur Télévente & Opérations BPO (Français)",
    company_name: "Infopro Digital Méditerranée",
    location: "Tunis, Charguia 1",
    description: "Encadrement et montée en compétences d'une équipe de 15 conseillers commerciaux, suivi des KPI et du chiffre d'affaires.",
    requirements: "Expérience managériale en centre d'appels, Français bilingue, Maîtrise des CRM",
    url: "https://www.tanitjobs.com/job/superviseur-televente-fr-2055",
    scraped_at: new Date(Date.now() - 10800000).toISOString(),
    category: "CDI",
    predicted_chance: 88,
  },

  // 2. LinkedIn Jobs
  {
    id: "linkedin-1",
    source_site: "LinkedIn Jobs",
    job_title: "Staff Software Engineer - Cloud Architecture",
    company_name: "Expensya (Medius Group)",
    location: "Tunis, Les Berges du Lac 1",
    description: "Conception et scaling de l'architecture microservices cloud pour notre plateforme Fintech internationale de gestion des dépenses.",
    requirements: "TypeScript, Node.js, C#, Azure Cloud, Kubernetes, Microservices, Event-Driven Architecture",
    url: "https://www.linkedin.com/jobs/view/expensya-cloud-staff-tunis-9921",
    scraped_at: new Date(Date.now() - 1800000).toISOString(),
    category: "CDI",
    predicted_chance: 92,
  },
  {
    id: "linkedin-2",
    source_site: "LinkedIn Jobs",
    job_title: "AI Research Scientist & LLM Specialist",
    company_name: "InstaDeep Labs",
    location: "Tunis / Hybrid",
    description: "Recherche appliquée sur les modèles fondation, apprentissage par renforcement et agents conversationnels multi-tâches.",
    requirements: "Python, PyTorch, Gemini API, Transformer Models, PhD ou Master Recherche",
    url: "https://www.linkedin.com/jobs/view/instadeep-ai-scientist-tunis-8842",
    scraped_at: new Date(Date.now() - 5400000).toISOString(),
    category: "Full-Time",
    predicted_chance: 95,
  },
  {
    id: "linkedin-3",
    source_site: "LinkedIn Jobs",
    job_title: "Mechanical & Systems Engineer (Automotive)",
    company_name: "SEGULA Technologies",
    location: "Tunis, Ben Arous",
    description: "Conception CAO 3D de pièces automobiles, calculs de structures et suivi de l'homologation selon les normes ISO/TS.",
    requirements: "Catia V5, SolidWorks, Calcul FEM, Matériaux composites, Anglais technique",
    url: "https://www.linkedin.com/jobs/view/segula-mechanical-engineer-tunis-7712",
    scraped_at: new Date(Date.now() - 9000000).toISOString(),
    category: "CDI",
    predicted_chance: 85,
  },

  // 3. Keejob
  {
    id: "keejob-1",
    source_site: "Keejob",
    job_title: "Ingénieur Cloud DevOps & Kubernetes (AWS / Terraform)",
    company_name: "CloudBridge North Africa",
    location: "Sousse / Hybride",
    description: "Administration de clusters Kubernetes scalables sur AWS, gestion des manifests Terraform et pipelines GitHub Actions.",
    requirements: "Docker, Kubernetes, AWS, Terraform, Linux, CI/CD, Scripting Bash/Python",
    url: "https://www.keejob.com/offres-emploi/248075/cloud-devops-sousse-3312",
    scraped_at: new Date(Date.now() - 4200000).toISOString(),
    category: "CDI",
    predicted_chance: 91,
  },
  {
    id: "keejob-2",
    source_site: "Keejob",
    job_title: "Ingénieur Électrique et Automatisation Industrielle",
    company_name: "Sagemcom Energy & Telecom",
    location: "Ben Arous, Mégrine",
    description: "Programmation des automates programmables Siemens S7, supervision SCADA et mise en service sur bancs d'essai.",
    requirements: "Diplôme d'Ingénieur Électrique/Automatique, Siemens TIA Portal, SCADA, Schémas électriques",
    url: "https://www.keejob.com/offres-emploi/248075/ingenieur-electrique-automatisation-4412",
    scraped_at: new Date(Date.now() - 8400000).toISOString(),
    category: "CDI",
    predicted_chance: 87,
  },
  {
    id: "keejob-3",
    source_site: "Keejob",
    job_title: "Product Manager Tech & Agile Coach",
    company_name: "InnoTech Sahel",
    location: "Monastir / Remote",
    description: "Pilotage de la roadmap produit SaaS, gestion des backlogs Scrum et coordination des équipes de développement.",
    requirements: "Expérience Product Owner / PM, Jira, Méthodes Agiles, Anglais courant",
    url: "https://www.keejob.com/offres-emploi/248891/product-manager-monastir-5512",
    scraped_at: new Date(Date.now() - 12600000).toISOString(),
    category: "CDI",
    predicted_chance: 89,
  },

  // 4. Emploi.nat.tn (ANETI)
  {
    id: "aneti-1",
    source_site: "Emploi.nat.tn (ANETI)",
    job_title: "Ingénieur Réseaux, Télécoms & Sécurité (Contrat CIVP)",
    company_name: "Société Industrielle & Télécoms de Tunis",
    location: "Ben Arous / Mégrine",
    description: "Offre visée ANETI dans le cadre du programme CIVP : administration réseau LAN/WAN, pare-feux Fortinet et support utilisateur.",
    requirements: "Diplôme national d'Ingénieur en Télécommunications, Éligibilité CIVP, Cisco CCNA",
    url: "https://www.emploi.nat.tn/fo/Fr/global.php?page=3&ref=CIVP-8821",
    scraped_at: new Date(Date.now() - 5000000).toISOString(),
    category: "Contrat CIVP",
    predicted_chance: 88,
  },
  {
    id: "aneti-2",
    source_site: "Emploi.nat.tn (ANETI)",
    job_title: "Développeur Web & ERP Odoo (Programme Karama)",
    company_name: "Cabinet Conseil Digital Ariana",
    location: "Ariana, Borj Louzir",
    description: "Recrutement sous contrat Karama ANETI : personnalisation des flux de facturation et stocks sur l'ERP Odoo en Python.",
    requirements: "Licence ou Master Informatique, Python, PostgreSQL, Odoo Framework, Éligibilité Karama",
    url: "https://www.emploi.nat.tn/fo/Fr/global.php?page=3&ref=KARAMA-3392",
    scraped_at: new Date(Date.now() - 9500000).toISOString(),
    category: "Contrat Karama",
    predicted_chance: 84,
  },
  {
    id: "aneti-3",
    source_site: "Emploi.nat.tn (ANETI)",
    job_title: "Technicien Supérieur en Maintenance Industrielle & Électromécanique",
    company_name: "Complexe Agroalimentaire du Centre",
    location: "Sfax, Route de Gabès",
    description: "Maintenance préventive et curative des lignes automatisées de conditionnement, détection des pannes et sécurité.",
    requirements: "BTS Électromécanique ou Maintenance Industrielle, Éligibilité ANETI, Rigueur",
    url: "https://www.emploi.nat.tn/fo/Fr/global.php?page=3&ref=ANETI-SFAX-1102",
    scraped_at: new Date(Date.now() - 14000000).toISOString(),
    category: "CDI / CIVP",
    predicted_chance: 82,
  },

  // 5. Optioncarriere.tn
  {
    id: "option-1",
    source_site: "Optioncarriere.tn",
    job_title: "Consultant Salesforce & Développeur CRM Apex",
    company_name: "PwC Tunisie Digital Center",
    location: "Tunis, Les Berges du Lac 2",
    description: "Intégration et customisation de solutions Salesforce CRM pour de grands groupes bancaires et assurances nord-africains.",
    requirements: "Certification Salesforce Admin/Dev, Apex, Lightning Web Components, SOQL",
    url: "https://www.optioncarriere.tn/emploi/salesforce-consultant-tunis-8841",
    scraped_at: new Date(Date.now() - 6200000).toISOString(),
    category: "CDI",
    predicted_chance: 90,
  },
  {
    id: "option-2",
    source_site: "Optioncarriere.tn",
    job_title: "Architecte Solutions Java / Spring Boot & Microservices",
    company_name: "Sopra HR Software Tunisie",
    location: "Ariana, Technopôle El Ghazala",
    description: "Conception de briques logicielles RH innovantes en architecture microservices réactive avec Kafka et Docker.",
    requirements: "Java 21, Spring Boot 3, Kafka, Docker, Kubernetes, Architecture Microservices",
    url: "https://www.optioncarriere.tn/emploi/java-architecte-sopra-2231",
    scraped_at: new Date(Date.now() - 11000000).toISOString(),
    category: "CDI",
    predicted_chance: 93,
  },

  // 6. CRIT Tunisie
  {
    id: "crit-1",
    source_site: "CRIT Tunisie",
    job_title: "Responsable ICT & Systèmes d'Information (Oil & Gas)",
    company_name: "Groupe Énergétique International (Client CRIT)",
    location: "Tunis, Centre Urbain Nord",
    description: "Gestion de l'infrastructure informatique, gouvernance des données et sécurité du système d'information de sites industriels.",
    requirements: "Bac+5 Ingénieur Informatique/Télécoms, ITIL, Cybersécurité, 5+ ans d'expérience",
    url: "https://www.crit-tunisie.net/jobs/responsable-ict-tunisie-239819",
    scraped_at: new Date(Date.now() - 3100000).toISOString(),
    category: "CDI",
    predicted_chance: 89,
  },
  {
    id: "crit-2",
    source_site: "CRIT Tunisie",
    job_title: "Expert en Conformité Financière et LCB-FT (AML)",
    company_name: "Banque Internationale de Développement (Client CRIT)",
    location: "Tunis, Lac 2",
    description: "Mise en œuvre des procédures de lutte contre le blanchiment et conformité aux standards FATF et Banque Centrale de Tunisie.",
    requirements: "Master Droit Bancaire / Finance, Certification CAMS, Expérience audit bancaire",
    url: "https://www.crit-tunisie.net/jobs/expert-conformite-lcbft-239816",
    scraped_at: new Date(Date.now() - 7500000).toISOString(),
    category: "CDI",
    predicted_chance: 91,
  },
  {
    id: "crit-3",
    source_site: "CRIT Tunisie",
    job_title: "Coordinateur Logistique et Achats Internationaux",
    company_name: "Multinationale Aéronautique & Défense",
    location: "Ben Arous, Fouchana",
    description: "Pilotage des flux d'approvisionnement import/export, dédouanement avec la douane tunisienne et négociation fournisseurs.",
    requirements: "Master Logistique/Commerce International, Incoterms 2020, ERP SAP, Anglais courant",
    url: "https://www.crit-tunisie.net/jobs/coordinateur-logistique-achats-239087",
    scraped_at: new Date(Date.now() - 13200000).toISOString(),
    category: "CDI",
    predicted_chance: 85,
  },

  // 7. CareerJet
  {
    id: "careerjet-1",
    source_site: "CareerJet",
    job_title: "Ingénieur BI & Décisionnel Power BI / Snowflake",
    company_name: "DataMetrics North Africa",
    location: "Tunis, Montplaisir",
    description: "Modélisation de data warehouses analytiques, pipelines ETL et création de tableaux de bord décisionnels Power BI interactifs.",
    requirements: "Power BI, Snowflake, SQL Server, DAX, Python, Data Modeling",
    url: "https://www.careerjet.com.tn/job/bi-snowflake-montplaisir-8831",
    scraped_at: new Date(Date.now() - 4800000).toISOString(),
    category: "CDI",
    predicted_chance: 89,
  },
  {
    id: "careerjet-2",
    source_site: "CareerJet",
    job_title: "Développeur React.js / Node.js Full-Stack",
    company_name: "Nexus Digital Agency Sfax",
    location: "Sfax, Route de Téniour",
    description: "Création d'applications web e-commerce performantes avec Next.js, GraphQL et bases de données PostgreSQL.",
    requirements: "React, Next.js, GraphQL, Node.js, Tailwind CSS, PostgreSQL",
    url: "https://www.careerjet.com.tn/job/react-nexus-sfax-7711",
    scraped_at: new Date(Date.now() - 9800000).toISOString(),
    category: "CDI",
    predicted_chance: 93,
  },

  // 8. Bayt
  {
    id: "bayt-1",
    source_site: "Bayt",
    job_title: "Senior Cloud Solutions Architect (GCP / AWS)",
    company_name: "Teleperformance MENA Hub",
    location: "Tunis, Charguia 2",
    description: "Leading the transition of customer operations to hybrid cloud platforms with high reliability, automated scaling and zero downtime.",
    requirements: "AWS/GCP Certified Solutions Architect, Terraform, Docker, Python, Microservices",
    url: "https://www.bayt.com/en/tunisia/jobs/cloud-architect-tp-3312",
    scraped_at: new Date(Date.now() - 2500000).toISOString(),
    category: "Full-Time",
    predicted_chance: 95,
  },
  {
    id: "bayt-2",
    source_site: "Bayt",
    job_title: "Technical Support Lead & SysAdmin Linux",
    company_name: "Transcom Worldwide Tunisia",
    location: "Ariana / Charguia",
    description: "Supervising tier-3 infrastructure tickets, Linux server clusters monitoring, VoIP trunks and LDAP directories.",
    requirements: "Linux Debian/RedHat, Bash scripting, Asterisk VoIP, Network diagnostics",
    url: "https://www.bayt.com/en/tunisia/jobs/sysadmin-transcom-4491",
    scraped_at: new Date(Date.now() - 8900000).toISOString(),
    category: "Full-Time",
    predicted_chance: 87,
  },

  // 9. Farah.tn
  {
    id: "farah-1",
    source_site: "Farah.tn",
    job_title: "Développeur Frontend Vue.js / Nuxt 3",
    company_name: "Carthage Web Studio",
    location: "La Marsa, Tunis",
    description: "Intégration de maquettes Figma pixel-perfect pour des applications web e-santé, tourisme et réservations en ligne.",
    requirements: "Vue.js 3, Nuxt 3, TypeScript, Tailwind CSS, Pinia, REST APIs",
    url: "https://www.farah.tn/emploi-vuejs-marsa-3312",
    scraped_at: new Date(Date.now() - 6500000).toISOString(),
    category: "CDI",
    predicted_chance: 92,
  },
  {
    id: "farah-2",
    source_site: "Farah.tn",
    job_title: "Community Manager & Rédacteur SEO Bilingue",
    company_name: "Agence Média Maghreb",
    location: "Tunis, Lac 2",
    description: "Création de contenu engageant sur LinkedIn, gestion des campagnes publicitaires Meta et optimisation du référencement naturel SEO.",
    requirements: "Excellente maîtrise du français et de l'anglais, SEO, Meta Business Suite, Canva",
    url: "https://www.farah.tn/emploi-community-manager-lac-9921",
    scraped_at: new Date(Date.now() - 11500000).toISOString(),
    category: "CDI",
    predicted_chance: 86,
  },

  // 10. Expertini
  {
    id: "expertini-1",
    source_site: "Expertini",
    job_title: "Ingénieur Test & Validation Électronique Embarquée",
    company_name: "Yazaki Tunisie / Sagemcom",
    location: "Bizerte, Parc d'Activités Économiques",
    description: "Développement de bancs de tests automatisés LabVIEW, validation des calculateurs automobiles et protocoles CAN/LIN.",
    requirements: "Ingénieur Électronique/Automatique, LabVIEW, Bus CAN, Normes ISO 26262",
    url: "https://tn.expertini.com/jobs/electronic-test-bizerte-5541",
    scraped_at: new Date(Date.now() - 4500000).toISOString(),
    category: "CDI",
    predicted_chance: 88,
  },
  {
    id: "expertini-2",
    source_site: "Expertini",
    job_title: "Développeur Golang & Microservices Hautes Performances",
    company_name: "FinTech Sahara Gateway",
    location: "Monastir / Remote",
    description: "Développement d'APIs de paiement en temps réel avec Golang, Redis et message brokers RabbitMQ pour les banques partenaires.",
    requirements: "Go (Golang), gRPC, Redis, PostgreSQL, Docker, Architecture Microservices",
    url: "https://tn.expertini.com/jobs/golang-developer-monastir-6632",
    scraped_at: new Date(Date.now() - 8800000).toISOString(),
    category: "CDI",
    predicted_chance: 94,
  },
];

// In-memory cache across serverless / hot reload cycles
declare global {
  var __khadamni_jobs__: StoredJob[] | undefined;
}

function loadJobsFromDiskOrMemory(): StoredJob[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__khadamni_jobs__ = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[jobStore] Could not read disk cache, initializing with default pool:", err);
  }

  if (global.__khadamni_jobs__ && global.__khadamni_jobs__.length > 0) {
    return global.__khadamni_jobs__;
  }

  // Pre-seed with the diverse 10-portal pool
  global.__khadamni_jobs__ = [...INITIAL_DIVERSE_JOBS];
  saveJobsToDisk(global.__khadamni_jobs__);
  return global.__khadamni_jobs__;
}

function saveJobsToDisk(jobs: StoredJob[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(jobs, null, 2), "utf-8");
  } catch (err) {
    console.warn("[jobStore] Could not persist to disk cache:", err);
  }
}

/**
 * Saves or updates raw scraped jobs into the store, deduplicating by URL and by title+company
 */
export function saveScrapedJobs(newJobs: ScrapedJobRaw[]): number {
  const currentJobs = loadJobsFromDiskOrMemory();
  const urlMap = new Map<string, StoredJob>();
  const titleCompanyMap = new Map<string, string>(); // key -> url

  // Index existing jobs
  for (const j of currentJobs) {
    urlMap.set(j.url, j);
    const key = `${j.job_title.toLowerCase().trim()}:::${j.company_name.toLowerCase().trim()}`;
    titleCompanyMap.set(key, j.url);
  }

  let addedOrUpdated = 0;

  for (const raw of newJobs) {
    const key = `${raw.job_title.toLowerCase().trim()}:::${raw.company_name.toLowerCase().trim()}`;
    const mappedUrl = titleCompanyMap.get(key);
    const existing = urlMap.get(raw.url) || (mappedUrl ? urlMap.get(mappedUrl) : undefined);

    const predictedChance =
      existing?.predicted_chance ?? Math.floor(Math.random() * 18 + 80); // 80-98%

    const effectiveUrl = existing ? existing.url : raw.url;

    const stored: StoredJob = {
      id: existing ? existing.id : `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      source_site: raw.source_site,
      job_title: raw.job_title,
      company_name: raw.company_name,
      location: raw.location,
      description: raw.description,
      requirements: raw.requirements || null,
      url: effectiveUrl,
      scraped_at: raw.scrapedAt ? new Date(raw.scrapedAt).toISOString() : new Date().toISOString(),
      category: raw.category || "Full-Time",
      predicted_chance: predictedChance,
    };

    urlMap.set(effectiveUrl, stored);
    titleCompanyMap.set(key, effectiveUrl);
    addedOrUpdated++;
  }

  // Deduplicate by title+company as final safety
  const finalMap = new Map<string, StoredJob>();
  for (const j of urlMap.values()) {
    const key = `${j.job_title.toLowerCase().trim()}:::${j.company_name.toLowerCase().trim()}`;
    if (!finalMap.has(key)) {
      finalMap.set(key, j);
    }
  }

  const updatedList = Array.from(finalMap.values()).sort(
    (a, b) => new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime()
  );

  global.__khadamni_jobs__ = updatedList;
  saveJobsToDisk(updatedList);

  return addedOrUpdated;
}

/**
 * Queries stored jobs with portal source filtering and keyword search
 */
export function getScrapedJobs(filters?: { source?: string | null; search?: string | null }): StoredJob[] {
  let jobs = loadJobsFromDiskOrMemory();

  if (filters?.source && filters.source !== "all") {
    const targetSource = filters.source.toLowerCase().trim();
    jobs = jobs.filter((j) => {
      const s = j.source_site.toLowerCase();
      return (
        s === targetSource ||
        s.includes(targetSource) ||
        targetSource.includes(s) ||
        (targetSource === "aneti" && s.includes("aneti")) ||
        (targetSource === "optioncarriere" && s.includes("optioncarriere"))
      );
    });
  }

  if (filters?.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    jobs = jobs.filter(
      (j) =>
        j.job_title.toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.requirements && j.requirements.toLowerCase().includes(q))
    );
  }

  return jobs;
}

/**
 * Returns all stored jobs formatted for AI matching
 */
export function getAllJobsForMatcher(): StoredJob[] {
  return loadJobsFromDiskOrMemory();
}
