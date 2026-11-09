import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Khadamni Scraper database...");

  // Sample Scraped Tunisian Jobs
  const job1 = await prisma.scrapedJob.upsert({
    where: { jobUrl: "https://www.tanitjobs.com/job/fullstack-nextjs-tunis" },
    update: {},
    create: {
      sourceSite: "TanitJobs",
      jobTitle: "Développeur Full-Stack Next.js / TypeScript",
      companyName: "TechSolutions Tunisia",
      location: "Tunis, Les Berges du Lac",
      description:
        "Nous recrutons un Ingénieur d'Études et Développement Full-Stack (Next.js, Node.js, PostgreSQL) pour participer à la refonte de nos plateformes SaaS.",
      requirements: "Next.js, React, TypeScript, Node.js, Prisma, PostgreSQL, Tailwind CSS, Git",
      jobUrl: "https://www.tanitjobs.com/job/fullstack-nextjs-tunis",
      category: "Full-Time",
      scrapedAt: new Date(),
    },
  });

  const job2 = await prisma.scrapedJob.upsert({
    where: { jobUrl: "https://www.keejob.com/offres-emploi/devops-cloud-sousse" },
    update: {},
    create: {
      sourceSite: "Keejob",
      jobTitle: "Ingénieur Cloud DevOps & Kubernetes",
      companyName: "CloudBridge North Africa",
      location: "Sousse / Hybride",
      description:
        "Gestion et automatisation des infrastructures Cloud AWS, conteneurisation Docker / Kubernetes et sécurisation des déploiements CI/CD.",
      requirements: "Docker, Kubernetes, AWS, Terraform, GitHub Actions, Linux",
      jobUrl: "https://www.keejob.com/offres-emploi/devops-cloud-sousse",
      category: "Full-Time",
      scrapedAt: new Date(),
    },
  });

  const job3 = await prisma.scrapedJob.upsert({
    where: { jobUrl: "https://www.tanitjobs.com/job/data-ai-engineer-sfax" },
    update: {},
    create: {
      sourceSite: "TanitJobs",
      jobTitle: "Data & AI Engineer (Python / Gemini / LLMs)",
      companyName: "DataSense Sfax",
      location: "Sfax / Remote",
      description:
        "Intégration de modèles de langage (LLM), fine-tuning et pipelines de parsing de documents volumineux.",
      requirements: "Python, FastAPI, Gemini API, LangChain, PostgreSQL, Vector Databases",
      jobUrl: "https://www.tanitjobs.com/job/data-ai-engineer-sfax",
      category: "Full-Time",
      scrapedAt: new Date(),
    },
  });

  console.log(`Seeded ${[job1.id, job2.id, job3.id].length} sample jobs.`);

  // Seed Clean User Account for final production test
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash("ademadem0808", 10);

  const testUser = await prisma.user.upsert({
    where: { email: "ouerhaiadem0805@gmail.com" },
    update: { passwordHash },
    create: {
      email: "ouerhaiadem0805@gmail.com",
      passwordHash,
      profile: {
        create: {
          firstName: "Adem",
          lastName: "Ouerhai",
          linkedinUrl: null,
          githubUrl: null,
          portfolioUrl: null,
          cvFileUrl: null,
          atsScore: null,
        },
      },
    },
  });

  console.log(`Seeded user account: ${testUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
