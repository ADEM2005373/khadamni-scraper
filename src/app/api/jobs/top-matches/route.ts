import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getProfileForEmail } from "@/lib/profileStore";
import { getTopCuratedMatches } from "@/services/ai/jobMatcher";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";

    const profile = getProfileForEmail(userEmail);
    const candidateSkills: string[] = ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"];
    const atsScore = profile.atsScore !== null ? Math.round(profile.atsScore) : undefined;

    // Check DB profile if available
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { profile: true },
      });
      if (user?.profile?.atsScore) {
        // use DB score if present
      }
    } catch {
      // offline fallback
    }

    const matches = await getTopCuratedMatches(
      {
        skills: candidateSkills,
        atsScore,
      },
      10
    );

    return NextResponse.json({
      success: true,
      totalMatches: matches.length,
      matches,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[TopMatches API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du calcul du Top 10 des offres." },
      { status: 500 }
    );
  }
}
