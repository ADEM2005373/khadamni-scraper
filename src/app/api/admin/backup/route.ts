import { NextResponse } from "next/server";
import { verifyAdminSession, unauthorizedAdminResponse } from "@/lib/adminAuth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const db = await getDb();
    const jobs = await db.collection("jobs").find({}).toArray();
    const users = await db.collection("users").find({}).project({ passwordHash: 0 }).toArray();
    const profiles = await db.collection("profiles").find({}).toArray();
    const settings = await db.collection("settings").find({}).toArray();

    const backupPayload = {
      app: "Khademni Scraper",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      counts: {
        jobs: jobs.length,
        users: users.length,
        profiles: profiles.length,
      },
      data: {
        jobs,
        users,
        profiles,
        settings,
      },
    };

    const fileName = `khadamni_backup_${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(backupPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
