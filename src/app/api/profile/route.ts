import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma, { isDatabaseAvailable } from "@/lib/prisma";
import { getProfileForEmail, updateProfileForEmail } from "@/lib/profileStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";

    // 1. Try PostgreSQL lookup if available
    if (await isDatabaseAvailable()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
          include: { profile: true },
        });

        if (user && user.profile) {
          return NextResponse.json({
            success: true,
            profile: {
              id: user.profile.id,
              userId: user.id,
              email: user.email,
              firstName: user.profile.firstName || "",
              lastName: user.profile.lastName || "",
              linkedinUrl: user.profile.linkedinUrl || "",
              githubUrl: user.profile.githubUrl || "",
              portfolioUrl: user.profile.portfolioUrl || "",
              cvFileUrl: user.profile.cvFileUrl || null,
              atsScore: user.profile.atsScore ?? null,
              userType: (user.profile as any).userType || "student",
            },
          });
        }
      } catch {
        // Fallback to resilient in-memory store
      }
    }

    // 2. Return clean profile from store (zero fake data)
    const cleanProfile = getProfileForEmail(userEmail);

    return NextResponse.json({
      success: true,
      profile: cleanProfile,
    });
  } catch (error) {
    console.error("[Profile API GET Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération du profil",
        profile: getProfileForEmail("ouerhaiadem0805@gmail.com"),
      },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";
    const body = await request.json();
    const { firstName, lastName, linkedinUrl, githubUrl, portfolioUrl, cvFileUrl, atsScore, userType } = body;

    // 1. Update in clean profile store
    const updatedProfile = updateProfileForEmail(userEmail, {
      firstName: firstName !== undefined ? firstName : undefined,
      lastName: lastName !== undefined ? lastName : undefined,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
      githubUrl: githubUrl !== undefined ? githubUrl : undefined,
      portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : undefined,
      cvFileUrl: cvFileUrl !== undefined ? cvFileUrl : undefined,
      atsScore: atsScore !== undefined ? atsScore : undefined,
      userType: userType !== undefined ? userType : undefined,
    });

    // 2. Sync to PostgreSQL if database is connected
    if (await isDatabaseAvailable()) {
      try {
        let user = await prisma.user.findUnique({
          where: { email: userEmail },
          include: { profile: true },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: userEmail,
              passwordHash: "secure_hash",
              profile: {
                create: {
                  firstName: updatedProfile.firstName,
                  lastName: updatedProfile.lastName,
                  linkedinUrl: updatedProfile.linkedinUrl,
                  githubUrl: updatedProfile.githubUrl,
                  portfolioUrl: updatedProfile.portfolioUrl,
                  cvFileUrl: updatedProfile.cvFileUrl,
                  atsScore: updatedProfile.atsScore,
                },
              },
            },
            include: { profile: true },
          });
        } else if (user.profile) {
          await prisma.profile.update({
            where: { id: user.profile.id },
            data: {
              firstName: updatedProfile.firstName,
              lastName: updatedProfile.lastName,
              linkedinUrl: updatedProfile.linkedinUrl,
              githubUrl: updatedProfile.githubUrl,
              portfolioUrl: updatedProfile.portfolioUrl,
              cvFileUrl: updatedProfile.cvFileUrl,
              atsScore: updatedProfile.atsScore,
            },
          });
        }
      } catch {
        // Offline fallback
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("[Profile API PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
