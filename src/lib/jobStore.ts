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

  // 11. Offres Spéciales Étudiants & Stages PFE Tunisie (10 Portails)
  {
    id: "pfe-tanit-1",
    source_site: "TanitJobs",
    job_title: "Stage PFE : Développeur Full-Stack MEVN (Vue.js / Node.js / MongoDB)",
    company_name: "Focus Corporation",
    location: "Ariana, Technopôle El Ghazala",
    description: "Sujet de PFE : Conception d'une plateforme SaaS collaborative temps réel avec Vue.js 3, Express.js et MongoDB. Pré-embauche envisageable.",
    requirements: "Vue.js, Node.js, Express, MongoDB, Git, Licence ou Mastère en Informatique",
    url: "https://www.tanitjobs.com/job/stage-pfe-mevn-focus-corp",
    scraped_at: new Date(Date.now() - 1200000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 96,
  },
  {
    id: "pfe-keejob-1",
    source_site: "Keejob",
    job_title: "Stage PFE : Ingénieur Intelligence Artificielle & LLM Gemini",
    company_name: "InstaDeep Labs",
    location: "Tunis, Les Berges du Lac / Hybride",
    description: "Développement d'un agent conversationnel RAG avec Vector Database et Gemini API pour l'analyse automatisée de documents.",
    requirements: "Python, PyTorch, Gemini API, FastAPI, Docker, Étudiant en cycle d'ingénieur ou mastère",
    url: "https://www.keejob.com/offres-emploi/stage-pfe-ia-instadeep",
    scraped_at: new Date(Date.now() - 2400000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 98,
  },
  {
    id: "pfe-linkedin-1",
    source_site: "LinkedIn Jobs",
    job_title: "Internship / Stage PFE : Cloud Infrastructure & DevOps Kubernetes",
    company_name: "Orange Digital Center Tunisie",
    location: "Tunis, Les Berges du Lac 1",
    description: "Mise en place de pipelines CI/CD automatisés avec GitHub Actions, conteneurisation Docker et déploiements Kubernetes sur GCP.",
    requirements: "Docker, Kubernetes, Linux, GitHub Actions, Terraform, Connaissances Cloud",
    url: "https://www.linkedin.com/jobs/view/stage-pfe-devops-orange-digital",
    scraped_at: new Date(Date.now() - 3600000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 94,
  },
  {
    id: "pfe-aneti-1",
    source_site: "Emploi.nat.tn (ANETI)",
    job_title: "Stage d'Initiation & PFE : Développement Mobile Flutter / Firebase",
    company_name: "Centre d'Innovation Numérique ANETI",
    location: "Ben Arous / Mégrine",
    description: "Stage conventionné convention établissement universitaire. Création d'une application mobile cross-platform avec Flutter.",
    requirements: "Flutter, Dart, Firebase, REST APIs, Convention de stage obligatoire",
    url: "http://www.emploi.nat.tn/fo/Fr/stage-pfe-flutter-aneti",
    scraped_at: new Date(Date.now() - 4800000).toISOString(),
    category: "Stage / PFE",
    predicted_chance: 92,
  },
  {
    id: "pfe-option-1",
    source_site: "Optioncarriere.tn",
    job_title: "Stage PFE : Développeur Frontend React.js & Next.js 14",
    company_name: "Talan Tunisie",
    location: "Tunis, Charguia 2",
    description: "Refonte de l'interface client d'une banque partenaire avec Next.js App Router, Tailwind CSS et intégration d'APIs REST.",
    requirements: "React, Next.js, TypeScript, Tailwind CSS, Git, Esprit d'équipe",
    url: "https://www.optioncarriere.tn/emploi/stage-pfe-react-talan",
    scraped_at: new Date(Date.now() - 6000000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 95,
  },
  {
    id: "pfe-crit-1",
    source_site: "CRIT Tunisie",
    job_title: "Stage PFE : Business Intelligence & Data Pipelines Power BI",
    company_name: "PwC Tunisie Digital Center",
    location: "Tunis, Lac 2",
    description: "Conception de datamarts décisionnels, modélisation relationnelle et tableaux de bord interactifs Power BI.",
    requirements: "SQL, Power BI, Python, Modélisation de données, Anglais professionnel",
    url: "https://www.crit-tunisie.net/jobs/stage-pfe-data-pwc",
    scraped_at: new Date(Date.now() - 7200000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 90,
  },
  {
    id: "pfe-careerjet-1",
    source_site: "CareerJet",
    job_title: "Stage PFE : Architectures Microservices Java / Spring Boot 3",
    company_name: "Sopra HR Software Tunisie",
    location: "Ariana, Technopôle El Ghazala",
    description: "Implémentation de microservices sécurisés pour notre suite logicielle de gestion des talents avec Spring Boot et PostgreSQL.",
    requirements: "Java, Spring Boot, PostgreSQL, Docker, Architecture REST",
    url: "https://www.careerjet.com.tn/job/stage-pfe-java-sopra-hr",
    scraped_at: new Date(Date.now() - 8400000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 93,
  },
  {
    id: "pfe-bayt-1",
    source_site: "Bayt",
    job_title: "Internship / Stage d'été : UI/UX Design & Prototypage Figma",
    company_name: "FinTech Carthage Hub",
    location: "Sfax / Remote",
    description: "Création de parcours utilisateurs, wireframes et prototypes haute fidélité pour une application mobile de paiement sans contact.",
    requirements: "Figma, Adobe XD, Principes d'ergonomie mobile, Sens du design",
    url: "https://www.bayt.com/en/tunisia/jobs/stage-design-carthage",
    scraped_at: new Date(Date.now() - 9600000).toISOString(),
    category: "Stage / PFE",
    predicted_chance: 91,
  },
  {
    id: "pfe-farah-1",
    source_site: "Farah.tn",
    job_title: "Stage PFE : Développement Web Nuxt.js & E-Commerce",
    company_name: "Carthage Web Studio",
    location: "La Marsa, Tunis",
    description: "Projet de fin d'études axé sur la création d'une marketplace e-commerce avec Nuxt 3, Tailwind CSS et Stripe/Paymee.",
    requirements: "Vue.js / Nuxt, JavaScript, HTML/CSS, Git, Motivation",
    url: "https://www.farah.tn/emploi/stage-pfe-nuxt-marsa",
    scraped_at: new Date(Date.now() - 10800000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 94,
  },
  {
    id: "pfe-expertini-1",
    source_site: "Expertini",
    job_title: "Stage PFE : Cybersécurité & Tests d'Intrusion Web",
    company_name: "CyberShield Méditerranée",
    location: "Sousse, Sahloul",
    description: "Audit de sécurité applicatif (OWASP Top 10), analyse de vulnérabilités et rédaction de rapports de remédiation technique.",
    requirements: "Linux, OWASP, Réseaux, Python/Bash, Éthique professionnelle",
    url: "https://tn.expertini.com/jobs/stage-pfe-cybersecurite-sousse",
    scraped_at: new Date(Date.now() - 12000000).toISOString(),
    category: "Stage PFE",
    predicted_chance: 92,
  },
];

// In-memory cache across serverless / hot reload cycles
declare global {
  var __khadamni_jobs__: StoredJob[] | undefined;
}

/**
 * Robust matcher to identify internships and Stage PFE offers
 * (avoids false positives like 'internationaux' or 'early stage')
 */
export function isInternshipJob(j: {
  category?: string;
  job_title?: string;
  jobTitle?: string;
  description?: string;
}): boolean {
  const c = (j.category || "").toLowerCase();
  const t = (j.job_title || j.jobTitle || "").toLowerCase();
  const d = (j.description || "").toLowerCase();

  const titleRegex = /\b(stage|pfe|stagiaire|internship|intern)\b/i;
  const catRegex = /\b(stage|pfe|stagiaire|internship)\b/i;
  const descRegex = /\b(stage pfe|stage d'été|stage ouvrier|stage de fin d'études|stagiaire|convention de stage|internship)\b/i;

  return titleRegex.test(t) || catRegex.test(c) || descRegex.test(d);
}

function loadJobsFromDiskOrMemory(): StoredJob[] {
  let loadedPool: StoredJob[] = [];
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        loadedPool = parsed;
      }
    }
  } catch (err) {
    console.warn("[jobStore] Could not read disk cache:", err);
  }

  if (loadedPool.length === 0 && global.__khadamni_jobs__ && global.__khadamni_jobs__.length > 0) {
    loadedPool = global.__khadamni_jobs__;
  }

  // Ensure all INITIAL_DIVERSE_JOBS (including student PFE offers) are merged in
  const map = new Map<string, StoredJob>();
  for (const j of loadedPool) {
    map.set(j.id, j);
  }
  let added = false;
  for (const j of INITIAL_DIVERSE_JOBS) {
    if (!map.has(j.id)) {
      map.set(j.id, j);
      added = true;
    }
  }

  const allJobs = Array.from(map.values());
  if (added || !fs.existsSync(CACHE_FILE)) {
    saveJobsToDisk(allJobs);
  }
  global.__khadamni_jobs__ = allJobs;
  return allJobs;
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

  // Background async sync to MongoDB (non-blocking)
  syncJobsToMongo(updatedList).catch((err) => {
    console.warn("[jobStore] Non-blocking Mongo sync warn:", err?.message);
  });

  return addedOrUpdated;
}

/**
 * Bulk upserts jobs into MongoDB 'jobs' collection using high-performance bulkWrite
 */
export async function syncJobsToMongo(
  jobs: (StoredJob | ScrapedJobRaw)[]
): Promise<{ saved: number; failed: number }> {
  try {
    const { getDb, isMongoAvailable } = await import("./mongodb");
    if (!(await isMongoAvailable())) {
      return { saved: 0, failed: 0 };
    }

    const db = await getDb();
    const collection = db.collection("jobs");
    const crypto = await import("crypto");

    const operations = jobs.map((j) => {
      const url = j.url;
      const jobTitle = "job_title" in j ? j.job_title : (j as any).jobTitle;
      const companyName = "company_name" in j ? j.company_name : (j as any).companyName;
      const sourceSite = "source_site" in j ? j.source_site : (j as any).sourceSite;
      const scrapedAt =
        "scraped_at" in j
          ? new Date(j.scraped_at)
          : "scrapedAt" in j
          ? new Date(j.scrapedAt)
          : new Date();

      const dedupHash = crypto
        .createHash("sha256")
        .update(url || `${jobTitle}:::${companyName}`)
        .digest("hex");

      return {
        updateOne: {
          filter: { url },
          update: {
            $set: {
              job_title: jobTitle,
              company_name: companyName,
              location: j.location,
              description: j.description,
              requirements: j.requirements || null,
              source_site: sourceSite,
              category: j.category || "Full-Time",
              url,
              sourceUrl: url,
              dedupHash,
              predicted_chance: "predicted_chance" in j ? j.predicted_chance : 85,
              scraped_at: scrapedAt,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    if (operations.length > 0) {
      const result = await collection.bulkWrite(operations, { ordered: false });
      const saved = (result.upsertedCount || 0) + (result.modifiedCount || 0);
      return { saved, failed: 0 };
    }
  } catch (err: any) {
    console.warn("[MongoDB syncJobsToMongo Warn]:", err?.message);
  }
  return { saved: 0, failed: 0 };
}

/**
 * Queries stored jobs with portal source, location, contract category filtering, and keyword search
 */
export function getScrapedJobs(filters?: {
  source?: string | null;
  search?: string | null;
  location?: string | null;
  category?: string | null;
  userType?: string | null;
}): StoredJob[] {
  let jobs = loadJobsFromDiskOrMemory();

  // If Student mode is specified, filter exclusively for internships / Stages PFE
  if (filters?.userType === "student") {
    jobs = jobs.filter((j) => isInternshipJob(j));
  } else if (filters?.userType === "worker") {
    // If Worker mode is specified, exclude internships unless explicitly asked
    if (filters?.category !== "stage") {
      jobs = jobs.filter((j) => !isInternshipJob(j));
    }
  }

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

  if (filters?.location && filters.location !== "all") {
    const loc = filters.location.toLowerCase().trim();
    jobs = jobs.filter((j) => {
      const l = j.location.toLowerCase();
      if (loc === "tunis") {
        return l.includes("tunis") || l.includes("ariana") || l.includes("ben arous") || l.includes("lac") || l.includes("charguia") || l.includes("ghazala");
      }
      if (loc === "sahel") {
        return l.includes("sousse") || l.includes("monastir") || l.includes("mahdia");
      }
      if (loc === "remote") {
        return l.includes("remote") || l.includes("hybride") || l.includes("hybrid") || l.includes("télétravail");
      }
      return l.includes(loc);
    });
  }

  if (filters?.category && filters.category !== "all") {
    const cat = filters.category.toLowerCase().trim();
    jobs = jobs.filter((j) => {
      const c = (j.category || "").toLowerCase();
      const t = j.job_title.toLowerCase();
      const d = j.description.toLowerCase();
      if (cat === "civp") {
        return c.includes("civp") || t.includes("civp") || d.includes("civp") || j.source_site.includes("ANETI");
      }
      if (cat === "karama") {
        return c.includes("karama") || t.includes("karama") || d.includes("karama");
      }
      if (cat === "cdi") {
        return c.includes("cdi") || (!c.includes("stage") && !c.includes("pfe") && !c.includes("civp"));
      }
      if (cat === "stage") {
        return c.includes("stage") || c.includes("pfe") || c.includes("internship") || t.includes("stage") || t.includes("pfe");
      }
      return c.includes(cat);
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
