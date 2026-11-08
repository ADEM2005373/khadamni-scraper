import { NextResponse } from "next/server";
import prisma, { isDatabaseAvailable } from "@/lib/prisma";
import { getScrapedJobs } from "@/lib/jobStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const search = searchParams.get("q");
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const userType = searchParams.get("userType");

    // 1. Query live MongoDB database if available
    try {
      const { getDb, isMongoAvailable } = await import("@/lib/mongodb");
      if (await isMongoAvailable()) {
        const db = await getDb();
        const query: any = {};

        // Source filter
        if (source && source !== "all") {
          query.source_site = { $regex: new RegExp(source, "i") };
        }

        // Student vs Worker filter
        if (userType === "student") {
          query.$or = [
            { category: { $regex: /stage|pfe|intern/i } },
            { job_title: { $regex: /\b(stage|pfe|stagiaire|internship|intern)\b/i } },
            { description: { $regex: /stage pfe|stage d'été|stage ouvrier|stage de fin d'études/i } },
          ];
        } else if (userType === "worker") {
          query.$and = [
            { category: { $not: { $regex: /stage|pfe|intern/i } } },
            { job_title: { $not: { $regex: /\b(stage|pfe|stagiaire|internship|intern)\b/i } } },
            { description: { $not: { $regex: /stage pfe|stage d'été|stage ouvrier|stage de fin d'études/i } } },
          ];
        }

        // Contract Category filter
        if (category && category !== "all") {
          if (category === "civp") {
            query.category = { $regex: /civp|sivp/i };
          } else if (category === "karama") {
            query.category = { $regex: /karama/i };
          } else if (category === "cdi") {
            query.category = { $regex: /cdi|full-time/i };
          } else if (category === "stage") {
            query.category = { $regex: /stage|pfe/i };
          }
        }

        // Location filter
        if (location && location !== "all") {
          if (location === "tunis") {
            query.location = { $regex: /tunis|ariana|ben arous|lac|charguia|ghazala/i };
          } else if (location === "sahel") {
            query.location = { $regex: /sousse|monastir|mahdia/i };
          } else if (location === "sfax") {
            query.location = { $regex: /sfax/i };
          } else if (location === "remote") {
            query.location = { $regex: /remote|hybride|hybrid|télétravail/i };
          }
        }

        // Search text / keyword filter
        if (search && search.trim() !== "") {
          const sRegex = new RegExp(search.trim(), "i");
          query.$or = [
            ...(query.$or || []),
            { job_title: sRegex },
            { company_name: sRegex },
            { location: sRegex },
            { description: sRegex },
          ];
        }

        const mongoJobs = await db
          .collection("jobs")
          .find(query)
          .sort({ scraped_at: -1 })
          .limit(100)
          .toArray();

        if (mongoJobs && mongoJobs.length > 0) {
          return NextResponse.json({
            success: true,
            source: "mongodb",
            total: mongoJobs.length,
            jobs: mongoJobs.map((j: any) => ({
              id: j._id ? j._id.toString() : j.id || String(Math.random()),
              source_site: j.source_site || j.source || "TanitJobs",
              job_title: j.job_title || j.title,
              company_name: j.company_name || j.company,
              location:
                typeof j.location === "object"
                  ? `${j.location?.city || ""}, ${j.location?.country || ""}`
                  : j.location,
              description: j.description || "",
              requirements:
                j.requirements || (Array.isArray(j.skills) ? j.skills.join(", ") : null),
              url: j.url || j.sourceUrl || "#",
              scraped_at: j.scraped_at
                ? new Date(j.scraped_at).toISOString()
                : new Date().toISOString(),
              category: j.category || j.contractType || "Full-Time",
              predicted_chance: j.predicted_chance || 84,
            })),
          });
        }
      }
    } catch (mongoErr) {
      console.warn("[Jobs API] MongoDB query note, falling back to local store:", mongoErr);
    }

    // 2. High-availability persistent store across all 10 official portals
    const storedJobs = getScrapedJobs({ source, search, location, category, userType });

    return NextResponse.json({
      success: true,
      total: storedJobs.length,
      jobs: storedJobs,
    });
  } catch (error) {
    console.error("[Jobs API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs from database." },
      { status: 500 }
    );
  }
}
