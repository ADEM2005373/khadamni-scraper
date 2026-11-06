import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerNewUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Veuillez fournir un email valide et un mot de passe d'au moins 6 caractères." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name || normalizedEmail.split("@")[0];
    const passwordHash = await bcrypt.hash(password, 10);

    // Save in in-memory registry
    registerNewUser(normalizedEmail, passwordHash, displayName);

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
