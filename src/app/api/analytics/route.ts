import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      analytics: {
        totalScrapedJobs: 1248,
        activeApplications: 14,
        averageAtsScore: 78.5,
        predictedSuccessRate: 64.2,
        portalDistribution: [
          { name: "TanitJobs", count: 780 },
          { name: "Keejob", count: 468 },
        ],
        monthlyApplicationTrends: [
          { month: "Mai", applied: 3, interviews: 1 },
          { month: "Juin", applied: 7, interviews: 2 },
          { month: "Juil", applied: 10, interviews: 4 },
          { month: "Août", applied: 6, interviews: 2 },
          { month: "Sept", applied: 12, interviews: 5 },
          { month: "Oct", applied: 15, interviews: 7 },
        ],
        topPredictedJobs: [
          {
            id: "job-1",
            title: "Développeur Full-Stack Next.js",
            company: "TechSolutions Tunisia",
            predictedChance: 89,
          },
          {
            id: "job-2",
            title: "Ingénieur React / Node.js",
            company: "Digital Spark Sfax",
            predictedChance: 85,
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors du calcul des statistiques" },
      { status: 500 }
    );
  }
}
