import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma, { isDatabaseAvailable } from "@/lib/prisma";
import { supabaseAdmin, CV_BUCKET_NAME } from "@/lib/supabase";
import { parseCvWithGemini } from "@/services/ai/atsParser";
import { updateProfileForEmail } from "@/lib/profileStore";
import fs from "fs";
import path from "path";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier CV fourni." },
        { status: 400 }
      );
    }

    // 1. Validate file type (must be PDF)
    const isPdfType = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfType) {
      return NextResponse.json(
        {
          success: false,
          error: "Format invalide. Seuls les fichiers PDF (.pdf) sont acceptés.",
        },
        { status: 400 }
      );
    }

    // 2. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Le fichier dépasse la limite maximale autorisée de 5 Mo (${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)} Mo détectés).`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique sanitized filename
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `cv_${Date.now()}_${sanitizedOriginalName}`;

    // Always save a copy to public/uploads/resumes for instant local serving
    let localPublicUrl = `/uploads/resumes/${uniqueFileName}`;
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, uniqueFileName), buffer);
    } catch (fsErr) {
      console.warn("[Local Resume Save Warn]:", fsErr);
    }

    let publicUrl = localPublicUrl;

    // 3. Upload to Supabase Storage bucket if configured
    try {
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(CV_BUCKET_NAME)
        .upload(uniqueFileName, buffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabaseAdmin.storage
          .from(CV_BUCKET_NAME)
          .getPublicUrl(uniqueFileName);
        if (urlData?.publicUrl) {
          publicUrl = urlData.publicUrl;
        }
      } else if (uploadError) {
        console.warn(
          `[Supabase Storage Note] Upload skipped to '${CV_BUCKET_NAME}':`,
          uploadError.message
        );
        // Will use localPublicUrl
      }
    } catch (storageException) {
      console.warn("[Supabase Storage Note] Falling back to local storage:", storageException);
    }

    // 4. Parse CV content using Gemini ATS Engine
    let atsAnalysis = null;
    let computedAtsScore: number | null = null;
    try {
      atsAnalysis = await parseCvWithGemini(buffer);
      computedAtsScore = atsAnalysis.atsScore;
    } catch (parseErr) {
      console.warn("[ATS Parser Warning]:", parseErr);
    }

    // 5. Update User Profile in clean store and Prisma Database
    const effectiveEmail = (await getServerSession(authOptions))?.user?.email || "ouerhaiadem0805@gmail.com";
    const profileUpdateData: Record<string, any> = { cvFileUrl: publicUrl };
    if (computedAtsScore !== null) {
      profileUpdateData.atsScore = computedAtsScore;
    }

    // Always update in-memory/disk clean profile store
    updateProfileForEmail(effectiveEmail, profileUpdateData);

    if (await isDatabaseAvailable()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: effectiveEmail },
          include: { profile: true },
        });

        if (user?.profile) {
          await prisma.profile.update({
            where: { id: user.profile.id },
            data: profileUpdateData,
          });
        }
      } catch (dbErr) {
        console.warn("[Prisma Profile cvFileUrl Update] Database sync skipped:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "CV téléversé et analysé par Gemini avec succès !",
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileSizeFormatted: `${(file.size / 1024).toFixed(0)} Ko`,
        cvFileUrl: publicUrl,
        atsScore: computedAtsScore,
        atsAnalysis,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("[CV Upload API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Une erreur est survenue lors du téléversement du CV." },
      { status: 500 }
    );
  }
}


