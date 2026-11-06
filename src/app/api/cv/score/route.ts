import { NextResponse } from "next/server";
import { calculateJobCompatibility } from "@/services/ai/atsParser";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skills, jobRequirements, jobTitle } = body;

    if (!jobRequirements || !jobTitle) {
      return NextResponse.json(
        { success: false, error: "Titre du poste et exigences requis." },
        { status: 400 }
      );
    }

    const candidateSkills: string[] = Array.isArray(skills) && skills.length > 0
      ? skills
      : ["JavaScript", "TypeScript", "React", "Next.js", "PostgreSQL", "Git"];

    const compatibility = await calculateJobCompatibility(
      candidateSkills,
      jobRequirements,
      jobTitle
    );

    return NextResponse.json({
      success: true,
      compatibility,
    });
  } catch (error) {
    console.error("[Compatibility Scoring Error]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du calcul de compatibilité." },
      { status: 500 }
    );
  }
}
