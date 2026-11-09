import { NextResponse } from "next/server";
import { verifyAdminSession, unauthorizedAdminResponse } from "@/lib/adminAuth";
import { getDb, isMongoAvailable } from "@/lib/mongodb";
import { TUNISIAN_PORTALS } from "@/services/scraper/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const mongoUp = await isMongoAvailable();
    if (!mongoUp) {
      return NextResponse.json({ success: false, error: "MongoDB non disponible" }, { status: 500 });
    }

    const db = await getDb();

    // 1. Total jobs and breakdown by portal
    const totalJobs = await db.collection("jobs").countDocuments();
    const portalCounts: Record<string, number> = {};
    for (const portal of TUNISIAN_PORTALS) {
      portalCounts[portal.name] = await db.collection("jobs").countDocuments({
        source_site: portal.name,
      });
    }

    // 2. User statistics
    const totalUsers = await db.collection("users").countDocuments();
    const studentUsers = await db.collection("profiles").countDocuments({ userType: "student" });
    const workerUsers = await db.collection("profiles").countDocuments({ userType: "worker" });

    // 3. Contracts breakdown
    const stageOffers = await db.collection("jobs").countDocuments({
      $or: [
        { category: { $regex: /stage|pfe/i } },
        { job_title: { $regex: /\b(stage|pfe|stagiaire|intern)\b/i } },
      ],
    });
    const cdiOffers = await db.collection("jobs").countDocuments({
      category: { $regex: /cdi|full-time/i },
    });
    const civpOffers = await db.collection("jobs").countDocuments({
      category: { $regex: /civp|sivp/i },
    });

    // 4. Tunisian Tech Demand Matrix
    const techStacks = [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Node.js",
      "Python",
      "Docker",
      "Kubernetes",
      "Spring Boot",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Azure",
      "DevOps",
      "Salesforce",
      "Flutter",
    ];

    const techDemand: { tech: string; count: number }[] = [];
    for (const tech of techStacks) {
      const count = await db.collection("jobs").countDocuments({
        $or: [
          { job_title: { $regex: new RegExp(tech, "i") } },
          { requirements: { $regex: new RegExp(tech, "i") } },
          { description: { $regex: new RegExp(tech, "i") } },
        ],
      });
      techDemand.push({ tech, count });
    }
    techDemand.sort((a, b) => b.count - a.count);

    // 5. System metrics
    const settingsDoc = await db.collection("settings").findOne({ key: "global_config" });

    return NextResponse.json({
      success: true,
      stats: {
        totalJobs,
        totalUsers,
        studentUsers,
        workerUsers,
        stageOffers,
        cdiOffers,
        civpOffers,
        portalCounts,
        techDemand: techDemand.slice(0, 10),
        activeModel: settingsDoc?.geminiModel || "gemini-1.5-pro",
        announcement: settingsDoc?.announcement || null,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[Admin Stats API Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
