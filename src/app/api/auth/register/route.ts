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

    const isOwner = ["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(normalizedEmail);
    const assignedRole = isOwner ? "admin" : "candidate";

    // Save in in-memory registry
    const regUser = registerNewUser(normalizedEmail, passwordHash, displayName, validUserType);
    regUser.role = assignedRole;

    // Save in clean profile store
    updateProfileForEmail(normalizedEmail, {
      firstName: displayName,
      userType: validUserType,
    });

    // 3. Save in MongoDB if available
    try {
      const { getDb, isMongoAvailable } = await import("@/lib/mongodb");
      if (await isMongoAvailable()) {
        const db = await getDb();
        const userRes = await db.collection("users").findOneAndUpdate(
          { email: normalizedEmail },
          {
            $set: {
              email: normalizedEmail,
              passwordHash,
              role: assignedRole,
              userType: validUserType,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true, returnDocument: "after" }
        );

        const userId = userRes?._id ? userRes._id.toString() : `user_${Date.now()}`;

        await db.collection("profiles").updateOne(
          { email: normalizedEmail },
          {
            $set: {
              userId,
              email: normalizedEmail,
              firstName: displayName,
              lastName: "",
              userType: validUserType,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
              atsScore: null,
              cvFileUrl: null,
            },
          },
          { upsert: true }
        );
      }
    } catch (mErr: any) {
      console.warn("[Register API Note] MongoDB sync:", mErr?.message);
    }

    // 4. Save in legacy Prisma DB if available

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
