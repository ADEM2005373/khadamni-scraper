import { NextResponse } from "next/server";
import { verifyAdminSession, unauthorizedAdminResponse } from "@/lib/adminAuth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const db = await getDb();
    const users = await db.collection("users").find({}).toArray();
    const profiles = await db.collection("profiles").find({}).toArray();

    const profileMap = new Map<string, any>();
    for (const p of profiles) {
      if (p.email) profileMap.set(p.email.toLowerCase().trim(), p);
    }

    const result = users.map((u) => {
      const email = (u.email || "").toLowerCase().trim();
      const p = profileMap.get(email) || {};

      return {
        id: u._id.toString(),
        email: u.email,
        name: u.name || `${p.firstName || ""} ${p.lastName || ""}`.trim() || email.split("@")[0],
        role: u.role || (["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(email) ? "admin" : "candidate"),
        userType: p.userType || u.userType || "student",
        atsScore: p.atsScore || null,
        cvFileUrl: p.cvFileUrl || null,
        createdAt: u.createdAt || u.updatedAt || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      total: result.length,
      users: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json();
    const { id, email, role, userType } = body;

    if (!id && !email) {
      return NextResponse.json({ success: false, error: "ID ou Email manquant." }, { status: 400 });
    }

    const db = await getDb();
    const userQuery: any = id ? { _id: new ObjectId(id) } : { email };
    const user = await db.collection("users").findOne(userQuery);

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé." }, { status: 404 });
    }

    const targetEmail = user.email.toLowerCase().trim();

    // Prevent removing admin role from owner accounts
    if (["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(targetEmail) && role === "candidate") {
      return NextResponse.json(
        { success: false, error: "Impossible de retirer le rôle Admin du propriétaire de la plateforme." },
        { status: 400 }
      );
    }

    // Update user collection
    const userUpdate: any = {};
    if (role) userUpdate.role = role;
    if (userType) userUpdate.userType = userType;
    if (Object.keys(userUpdate).length > 0) {
      await db.collection("users").updateOne(userQuery, { $set: userUpdate });
    }

    // Update profiles collection
    const profileUpdate: any = {};
    if (userType) profileUpdate.userType = userType;
    if (Object.keys(profileUpdate).length > 0) {
      await db.collection("profiles").updateOne({ email: targetEmail }, { $set: profileUpdate });
    }

    return NextResponse.json({
      success: true,
      message: `Compte ${targetEmail} mis à jour avec succès.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID manquant." }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable." }, { status: 404 });
    }

    if (["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(user.email.toLowerCase().trim())) {
      return NextResponse.json(
        { success: false, error: "Impossible de supprimer le compte du propriétaire de Khadamni." },
        { status: 400 }
      );
    }

    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    await db.collection("profiles").deleteOne({ email: user.email });

    return NextResponse.json({
      success: true,
      message: `Utilisateur ${user.email} supprimé.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
