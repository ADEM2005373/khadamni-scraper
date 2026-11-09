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
    let config = await db.collection("settings").findOne({ key: "global_config" });

    if (!config) {
      config = {
        key: "global_config",
        geminiModel: "gemini-1.5-pro",
        announcement: {
          enabled: true,
          message: "🎉 Bienvenue sur Khadamni Scraper : Plus de 220 offres tunisiennes et stages PFE indexés en direct !",
          type: "info",
        },
        scraperIntervalHours: 6,
        antiBanDelayMs: 1500,
        updatedAt: new Date(),
      };
      await db.collection("settings").insertOne(config);
    }

    return NextResponse.json({
      success: true,
      config,
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
    const { geminiModel, announcement, scraperIntervalHours, antiBanDelayMs } = body;

    const db = await getDb();
    const updateData: any = { updatedAt: new Date() };

    if (geminiModel) updateData.geminiModel = geminiModel;
    if (announcement !== undefined) updateData.announcement = announcement;
    if (scraperIntervalHours) updateData.scraperIntervalHours = Number(scraperIntervalHours);
    if (antiBanDelayMs) updateData.antiBanDelayMs = Number(antiBanDelayMs);

    await db.collection("settings").updateOne(
      { key: "global_config" },
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Paramètres système mis à jour avec succès !",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
