/**
 * Standalone background crawler worker for Khadamni Scraper.
 * Can be run manually or invoked on a schedule via cron/worker:
 *   npm run scrape:cron
 */

import { runAllScrapers } from "../src/services/scraper";
import { saveScrapedJobs } from "../src/lib/jobStore";
import prisma, { isDatabaseAvailable } from "../src/lib/prisma";

async function main() {
  const startTime = Date.now();
  console.log("============================================================");
  console.log(`[Crawler Worker] Starting multi-portal scraping sequence...`);
  console.log(`[Crawler Worker] Timestamp: ${new Date().toISOString()}`);
  console.log("============================================================\n");

  try {
    // 1. Scrape all 10 Tunisian job portals
    const results = await runAllScrapers();

    console.log("\n---------------- SCRAPE BREAKDOWN ----------------");
    for (const [sourceName, data] of Object.entries(results.sources)) {
      const statusIcon = data.success ? "✓" : "✗";
      console.log(
        `  ${statusIcon} ${sourceName.padEnd(25)}: ${data.jobsFound} jobs in ${data.executionTimeMs}ms`
      );
      if (data.errors && data.errors.length > 0) {
        console.log(`    Errors: ${data.errors.join(", ")}`);
      }
    }

    console.log("\n---------------- DEDUPLICATION & CACHE ----------------");
    console.log(`Raw Offers Gathered : ${results.totalJobs}`);
    console.log(`Unique Clean Offers : ${results.uniqueJobs}`);

    // 2. Persist to high-availability local store
    const cachedCount = saveScrapedJobs(results.jobs);
    console.log(`Synced to JobStore  : ${cachedCount} offers`);

    // 3. Persist to MongoDB NoSQL Database
    const { syncJobsToMongo } = await import("../src/lib/jobStore");
    const mongoRes = await syncJobsToMongo(results.jobs);
    if (mongoRes.saved > 0) {
      console.log(`Synced to MongoDB   : ${mongoRes.saved} offers (NoSQL Collection 'jobs')`);
    } else {
      console.log(`MongoDB status      : In-sync / Local`);
    }

    // 4. Sync to legacy PostgreSQL if database connection is live
    if (await isDatabaseAvailable()) {
      let dbSaved = 0;
      let dbFailed = 0;

      for (const job of results.jobs) {
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
          dbSaved++;
        } catch {
          dbFailed++;
        }
      }
      console.log(`Synced to PostgreSQL: ${dbSaved} saved / ${dbFailed} failed`);
    } else {
      console.log("PostgreSQL status   : Offline (Resilient local cache preserved)");
    }

    const elapsed = Date.now() - startTime;
    console.log(`\n[Crawler Worker] Finished successfully in ${(elapsed / 1000).toFixed(2)}s.`);
    console.log("============================================================\n");
    process.exit(0);
  } catch (error) {
    console.error("[Crawler Worker Fatal Error]:", error);
    process.exit(1);
  }
}

main();
