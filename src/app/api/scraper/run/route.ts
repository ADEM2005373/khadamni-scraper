import { NextResponse } from "next/server";
import { runAllScrapers } from "@/services/scraper";
import prisma, { isDatabaseAvailable } from "@/lib/prisma";
import { saveScrapedJobs } from "@/lib/jobStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleScraperExecution();
}

export async function GET(request: Request) {
  return handleScraperExecution();
}

async function handleScraperExecution() {
  const startTime = Date.now();
  const logs: string[] = [];
  const errors: string[] = [];

  logs.push(`[${new Date().toISOString()}] Début de l'indexation globale des 10 portails tunisiens...`);

  try {
    // 1. Run multi-portal scraping across all 10 sources
    const scrapeResults = await runAllScrapers();
    logs.push(
      `[ScraperEngine] Total offres extraites: ${scrapeResults.totalJobs} (${scrapeResults.uniqueJobs} uniques) sur ${Object.keys(scrapeResults.sources).length} portails.`
    );

    // Aggregate any portal-level error reports
    for (const [sourceName, result] of Object.entries(scrapeResults.sources)) {
      if (result.errors && result.errors.length > 0) {
        errors.push(...result.errors.map((err) => `[${sourceName}] ${err}`));
      }
    }

    // 2. Persist scraped jobs to local/in-memory store for instant zero-loss retrieval
    const storedCount = saveScrapedJobs(scrapeResults.jobs);
    logs.push(`[JobStore] ${storedCount} offres synchronisées avec succès dans le cache persistant.`);

    // 3. Bulk upsert into MongoDB 'jobs' collection
    try {
      const { syncJobsToMongo } = await import("@/lib/jobStore");
      const mongoResult = await syncJobsToMongo(scrapeResults.jobs);
      if (mongoResult.saved > 0) {
        logs.push(`[MongoDB] ${mongoResult.saved} offres indexées en masse avec succès dans MongoDB.`);
      }
    } catch (mErr: any) {
      console.warn("[Scraper MongoDB Sync Note]:", mErr?.message);
    }

    // 4. Upsert into legacy PostgreSQL via Prisma if database is available
    let savedCount = 0;
    let failedCount = 0;

    if (await isDatabaseAvailable()) {
      for (const job of scrapeResults.jobs) {
        try {
          await prisma.scrapedJob.upsert({
            where: { jobUrl: job.url },
            update: {
              jobTitle: job.job_title,
              companyName: job.company_name,
              location: job.location,
              description: job.description,
              requirements: job.requirements || null,
              sourceSite: job.source_site,
              category: job.category || "Full-Time",
              scrapedAt: new Date(),
            },
            create: {
              sourceSite: job.source_site,
              jobTitle: job.job_title,
              companyName: job.company_name,
              location: job.location,
              description: job.description,
              requirements: job.requirements || null,
              jobUrl: job.url,
              category: job.category || "Full-Time",
              scrapedAt: new Date(),
            },
          });
          savedCount++;
        } catch (dbErr: any) {
          failedCount++;
          if (failedCount === 1) {
            console.warn("[Scraper DB Sync Note]:", dbErr?.message);
          }
        }
      }
      logs.push(
        `[DatabaseSync] Synchronisation PostgreSQL terminée: ${savedCount} offres enregistrées.`
      );
    } else {
      logs.push("[DatabaseSync] PostgreSQL hors ligne - Offres stockées en haute disponibilité dans le JobStore.");
    }

    const totalDuration = Date.now() - startTime;
    logs.push(`[ScraperEngine] Pipeline des 10 portails exécuté avec succès en ${totalDuration}ms.`);

    const portalBreakdown: Record<string, number> = {};
    for (const [name, res] of Object.entries(scrapeResults.sources)) {
      portalBreakdown[name] = res.jobsFound;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        jobsScraped: scrapeResults.totalJobs,
        uniqueJobs: scrapeResults.uniqueJobs,
        jobsSavedOrUpdated: savedCount > 0 ? savedCount : storedCount,
        sourcesScraped: Object.keys(scrapeResults.sources),
        portalBreakdown,
        executionTimeMs: totalDuration,
      },
      errors: errors.length > 0 ? errors : [],
      logs,
    });
  } catch (error: any) {
    const errorMsg = error?.message || "Erreur interne lors de l'exécution du scraper.";
    console.error("[Scraper API Fatal Error]:", error);
    logs.push(`[FATAL] ${errorMsg}`);

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
        logs,
      },
      { status: 500 }
    );
  }
}
