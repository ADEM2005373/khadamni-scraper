import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerNewUser } from "@/lib/auth";
import { updateProfileForEmail } from "@/lib/profileStore";

export async function POST(request: Request) {
  try {
    const { email, password, name, userType = "student" } = await request.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Veuillez fournir un email valide et un mot de passe d'au moins 6 caractères." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name || normalizedEmail.split("@")[0];
    const passwordHash = await bcrypt.hash(password, 10);
    const validUserType: "student" | "worker" = userType === "worker" ? "worker" : "student";

    // Save in in-memory registry
    registerNewUser(normalizedEmail, passwordHash, displayName, validUserType);

    // Save in clean profile store
    updateProfileForEmail(normalizedEmail, {
      firstName: displayName,
      userType: validUserType,
    });

    // Save in DB if available
    try {
      await prisma.user.upsert({
        where: { email: normalizedEmail },
        update: { passwordHash },
        create: {
          email: normalizedEmail,
          passwordHash,
          profile: {
            create: {
              firstName: displayName,
              lastName: "",
              userType: validUserType,
            },
          },
        },
      });
    } catch {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès.",
    });
  } catch (error) {
    console.error("[Register API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du compte." },
      { status: 500 }
    );
  }
}
