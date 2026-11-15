import { scrapeTanitJobs } from "./tanitjobs";
import { scrapeKeejob } from "./keejob";
import { scrapePFEBooks } from "./pfebooks";
import {
  scrapeLinkedInJobs,
  scrapeAnetiJobs,
  scrapeOptionCarriere,
  scrapeCritTunisie,
  scrapeCareerJet,
  scrapeBayt,
  scrapeFarah,
  scrapeExpertini,
} from "./allPortalsScraper";
import { ScrapedJobRaw, ScraperResult, TUNISIAN_PORTALS, TunisianJobSource } from "./types";

export interface AggregatedScrapeResult {
  totalJobs: number;
  uniqueJobs: number;
  sources: Record<string, ScraperResult>;
  jobs: ScrapedJobRaw[];
  executionTimeMs: number;
}

export async function runAllScrapers(): Promise<AggregatedScrapeResult> {
  const startTime = Date.now();
  console.log("[ScraperEngine] Launching multi-portal scraping sequence for all Tunisian job boards and PFEBooks.com...");

  // Execute all scrapers in parallel with safe error isolation
  const results = await Promise.allSettled([
    scrapeTanitJobs(),
    scrapeLinkedInJobs(),
    scrapeKeejob(),
    scrapeAnetiJobs(),
    scrapeOptionCarriere(),
    scrapeCritTunisie(),
    scrapeCareerJet(),
    scrapeBayt(),
    scrapeFarah(),
    scrapeExpertini(),
    scrapePFEBooks(),
  ]);

  const sourcesRecord: Record<string, ScraperResult> = {};
  const rawJobs: ScrapedJobRaw[] = [];

  const portalKeys = [
    "TanitJobs",
    "LinkedIn Jobs",
    "Keejob",
    "Emploi.nat.tn (ANETI)",
    "Optioncarriere.tn",
    "CRIT Tunisie",
    "CareerJet",
    "Bayt",
    "Farah.tn",
    "Expertini",
    "PFEBooks.com",
  ];

  results.forEach((res, index) => {
    const portalName = portalKeys[index];
    if (res.status === "fulfilled") {
      sourcesRecord[portalName] = res.value;
      rawJobs.push(...res.value.jobs);
    } else {
      console.error(`[ScraperEngine] Error on ${portalName}:`, res.reason);
      sourcesRecord[portalName] = {
        source: portalName,
        success: false,
        jobsFound: 0,
        jobs: [],
        errors: [res.reason?.message || "Unknown error"],
        executionTimeMs: 0,
      };
    }
  });

  // Deduplicate by URL and auto-tag internships (Stages / PFE)
  const seenUrls = new Set<string>();
  const uniqueJobs: ScrapedJobRaw[] = [];

  for (const job of rawJobs) {
    if (!seenUrls.has(job.url)) {
      seenUrls.add(job.url);
      const titleLower = job.job_title.toLowerCase();
      const descLower = (job.description || "").toLowerCase();
      if (
        titleLower.includes("stage") ||
        titleLower.includes("pfe") ||
        titleLower.includes("stagiaire") ||
        titleLower.includes("intern") ||
        descLower.includes("stage pfe") ||
        descLower.includes("stage de fin d'études") ||
        descLower.includes("stage d'été") ||
        descLower.includes("stagiaire")
      ) {
        job.category = "Stage / PFE";
      }
      uniqueJobs.push(job);
    }
  }

  console.log(
    `[ScraperEngine] Scraping complete across 10 portals: ${rawJobs.length} raw jobs collected, ${uniqueJobs.length} unique in ${Date.now() - startTime}ms`
  );

  return {
    totalJobs: rawJobs.length,
    uniqueJobs: uniqueJobs.length,
    sources: sourcesRecord,
    jobs: uniqueJobs,
    executionTimeMs: Date.now() - startTime,
  };
}

export * from "./types";
export * from "./tanitjobs";
export * from "./keejob";
export * from "./pfebooks";
export * from "./allPortalsScraper";
export * from "./userAgentRotator";
