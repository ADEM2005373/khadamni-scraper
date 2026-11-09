import { NextResponse } from "next/server";
import { verifyAdminSession, unauthorizedAdminResponse } from "@/lib/adminAuth";
import { getDb, isMongoAvailable } from "@/lib/mongodb";
import { TUNISIAN_PORTALS, TunisianJobSource } from "@/services/scraper/types";
import { runAllTunisianPortalsScraper } from "@/services/scraper/allPortalsScraper";
import { getScrapedJobs, syncJobsToMongo } from "@/lib/jobStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const db = await getDb();
    const portalStatus = [];

    for (const portal of TUNISIAN_PORTALS) {
      const count = await db.collection("jobs").countDocuments({ source_site: portal.name });
      const lastJob = await db
        .collection("jobs")
        .find({ source_site: portal.name })
        .sort({ scraped_at: -1 })
        .limit(1)
        .toArray();

      const lastRun = lastJob[0]?.scraped_at || new Date().toISOString();

      portalStatus.push({
        name: portal.name,
        baseUrl: portal.baseUrl,
        badgeColor: portal.badgeColor,
        totalJobs: count,
        status: "operational",
        lastRun,
        rateLimitDelayMs: 1500,
      });
    }

    return NextResponse.json({
      success: true,
      portals: portalStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetPortal: TunisianJobSource | undefined = body.portal;

    console.log(`[Admin Scraper Trigger] Running scrape for ${targetPortal || "all 10 portals"}...`);

    const scrapedJobs = await runAllTunisianPortalsScraper(targetPortal);
    const syncResult = await syncJobsToMongo(scrapedJobs);

    const db = await getDb();
    const totalCount = await db.collection("jobs").countDocuments();

    return NextResponse.json({
      success: true,
      summary: {
        target: targetPortal || "Tous les 10 portails",
        newlyScraped: scrapedJobs.length,
        syncedToMongo: syncResult.saved,
        totalJobsInDb: totalCount,
        executedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[Admin Scraper Trigger Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
