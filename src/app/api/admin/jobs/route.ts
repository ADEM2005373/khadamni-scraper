import { NextResponse } from "next/server";
import { verifyAdminSession, unauthorizedAdminResponse } from "@/lib/adminAuth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const featuredOnly = searchParams.get("featured") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25")));

    const db = await getDb();
    const query: any = {};

    if (source && source !== "all") {
      query.source_site = { $regex: new RegExp(source, "i") };
    }

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (featuredOnly) {
      query.isFeatured = true;
    }

    if (search && search.trim() !== "") {
      const sRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { job_title: sRegex },
        { company_name: sRegex },
        { location: sRegex },
        { description: sRegex },
      ];
    }

    const total = await db.collection("jobs").countDocuments(query);
    const jobs = await db
      .collection("jobs")
      .find(query)
      .sort({ isFeatured: -1, scraped_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      jobs: jobs.map((j) => ({
        id: j._id.toString(),
        source_site: j.source_site || j.source || "TanitJobs",
        job_title: j.job_title || j.title,
        company_name: j.company_name || j.company,
        location: j.location,
        category: j.category || "CDI",
        requirements: j.requirements,
        url: j.url || "#",
        isFeatured: !!j.isFeatured,
        scraped_at: j.scraped_at,
        predicted_chance: j.predicted_chance || 88,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { isAuthorized } = await verifyAdminSession();
  if (!isAuthorized) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json();
    const {
      job_title,
      company_name,
      location,
      category = "CDI",
      description,
      requirements,
      url,
      source_site = "Offre Partenaire Khadamni",
      isFeatured = false,
    } = body;

    if (!job_title || !company_name || !location) {
      return NextResponse.json(
        { success: false, error: "Titre, entreprise et localisation sont obligatoires." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const cleanUrl = url && url.trim() !== "" ? url : `https://khadamni.tn/direct/${Date.now()}`;
    const dedupHash = crypto.createHash("sha256").update(cleanUrl).digest("hex");

    const newJobDoc = {
      source_site,
      job_title,
      company_name,
      location,
      category,
      description: description || "Offre partenaire exclusive publiée sur Khadamni Scraper.",
      requirements: requirements || null,
      url: cleanUrl,
      dedupHash,
      isFeatured: !!isFeatured,
      scraped_at: new Date().toISOString(),
      predicted_chance: 95,
      createdAt: new Date(),
    };

    const insertResult = await db.collection("jobs").insertOne(newJobDoc);

    return NextResponse.json({
      success: true,
      message: "Offre ajoutée avec succès !",
      jobId: insertResult.insertedId.toString(),
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
    const { id, isFeatured, category, job_title, company_name } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID requis." }, { status: 400 });
    }

    const db = await getDb();
    const updateDoc: any = {};
    if (typeof isFeatured === "boolean") updateDoc.isFeatured = isFeatured;
    if (category) updateDoc.category = category;
    if (job_title) updateDoc.job_title = job_title;
    if (company_name) updateDoc.company_name = company_name;

    await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    return NextResponse.json({ success: true, message: "Offre mise à jour !" });
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
    const res = await db.collection("jobs").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      deletedCount: res.deletedCount,
      message: "Offre supprimée du catalogue.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
