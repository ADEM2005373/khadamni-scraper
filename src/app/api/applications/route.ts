import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { forecastApplicationSuccessWithGemini } from "@/services/ai/jobMatcher";
import { getApplicationsForEmail, addApplication, StoredApplication } from "@/lib/applicationStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";

    // 1. Try DB lookup if connected
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          applications: {
            include: { job: true },
            orderBy: { appliedAt: "desc" },
          },
        },
      });

      if (user && user.applications.length > 0) {
        return NextResponse.json({
          success: true,
          applications: user.applications,
        });
      }
    } catch {
      // Database not reachable, fall back to clean in-memory store
    }

    // 2. Return clean in-memory applications for this user (starts empty: [])
    const cleanApps = getApplicationsForEmail(userEmail);

    return NextResponse.json({
      success: true,
      applications: cleanApps,
    });
  } catch (error) {
    console.error("[Applications GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des candidatures.", applications: [] },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";
    const body = await request.json();
    const { jobId, jobTitle, companyName, location, requirements, description, sourceSite, url } = body;

    if (!jobId || !jobTitle) {
      return NextResponse.json(
        { success: false, error: "Identifiant ou titre de l'offre manquant." },
        { status: 400 }
      );
    }

    // 1. Forecast hiring probability with Gemini AI
    const forecast = await forecastApplicationSuccessWithGemini(
      {
        skills: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
        atsScore: 84,
        experienceYears: 3,
      },
      {
        title: jobTitle,
        company: companyName || "Entreprise Tunisienne",
        requirements: requirements || "Next.js, TypeScript, PostgreSQL",
        description: description || "Poste tech à pourvoir en Tunisie.",
      }
    );

    const predictedChance = forecast.predictedChance;

    const newApplication: StoredApplication = {
      id: `app_${Date.now()}`,
      userId: `user_${Date.now()}`,
      userEmail,
      jobId,
      status: "Applied",
      predictedChance,
      appliedAt: new Date().toISOString(),
      job: {
        jobTitle,
        companyName: companyName || "Entreprise",
        location: location || "Tunisie",
        sourceSite: sourceSite || "TanitJobs",
        jobUrl: url || `https://khadamni.tn/jobs/${jobId}`,
      },
      forecast: {
        strengths: forecast.strengths,
        tailoredCoverLetterTip: forecast.tailoredCoverLetterTip,
      },
    };

    // Save in clean application store
    const storedApp = addApplication(newApplication);

    // 2. Persist in database if connected
    try {
      let user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            passwordHash: "secure_hash",
            profile: {
              create: {
                firstName: userEmail.split("@")[0],
                lastName: "",
              },
            },
          },
        });
      }

      let jobRecord = await prisma.scrapedJob.findUnique({
        where: { jobUrl: url || `https://khadamni.tn/jobs/${jobId}` },
      });

      if (!jobRecord) {
        jobRecord = await prisma.scrapedJob.create({
          data: {
            id: jobId,
            sourceSite: sourceSite || "TanitJobs",
            jobTitle: jobTitle,
            companyName: companyName || "Entreprise",
            location: location || "Tunis",
            description: description || jobTitle,
            requirements: requirements || null,
            jobUrl: url || `https://khadamni.tn/jobs/${jobId}`,
            category: "Full-Time",
          },
        });
      }

      await prisma.userApplication.upsert({
        where: {
          userId_jobId: {
            userId: user.id,
            jobId: jobRecord.id,
          },
        },
        update: {
          status: "Applied",
          predictedChance,
          appliedAt: new Date(),
        },
        create: {
          userId: user.id,
          jobId: jobRecord.id,
          status: "Applied",
          predictedChance,
          appliedAt: new Date(),
        },
      });
    } catch {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      message: `Candidature pour "${jobTitle}" enregistrée avec succès !`,
      application: storedApp,
    });
  } catch (error) {
    console.error("[Applications POST Fatal]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement de la candidature." },
      { status: 500 }
    );
  }
}
