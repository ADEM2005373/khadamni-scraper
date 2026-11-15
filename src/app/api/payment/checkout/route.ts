import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfileForEmail, updateProfileForEmail } from "@/lib/profileStore";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "ouerhaiadem0805@gmail.com";

    const body = await request.json();
    const { plan, paymentMethod, billingCycle = "monthly" } = body;

    if (!plan || !["student", "pro"].includes(plan)) {
      return NextResponse.json(
        { success: false, error: "Formule invalide. Choisissez 'student' (15 DT) ou 'pro' (25 DT)." },
        { status: 400 }
      );
    }

    const priceMap: Record<string, Record<string, number>> = {
      student: { monthly: 15, quarterly: 35 },
      pro: { monthly: 25, quarterly: 59 },
    };

    const amountTnd = priceMap[plan]?.[billingCycle] || (plan === "student" ? 15 : 25);
    const validUntil = new Date();
    if (billingCycle === "quarterly") {
      validUntil.setMonth(validUntil.getMonth() + 3);
    } else {
      validUntil.setMonth(validUntil.getMonth() + 1);
    }

    // Update profile subscription status in clean store
    const updated = updateProfileForEmail(userEmail, {
      subscriptionTier: plan,
      subscriptionExpiresAt: validUntil.toISOString(),
    });

    // Sync to MongoDB if available
    try {
      const { getDb, isMongoAvailable } = await import("@/lib/mongodb");
      if (await isMongoAvailable()) {
        const db = await getDb();
        await db.collection("profiles").updateOne(
          { email: userEmail },
          { $set: { subscriptionTier: plan, subscriptionExpiresAt: validUntil.toISOString() } },
          { upsert: true }
        );
      }
    } catch (mErr) {
      console.warn("[Payment Checkout] Mongo sync warn:", mErr);
    }

    return NextResponse.json({
      success: true,
      message: `Félicitations ! Votre abonnement Khadamni ${plan === "student" ? "Pack Étudiant (15 DT)" : "Pack Pro (25 DT)"} est activé.`,
      data: {
        email: userEmail,
        plan,
        amountTnd,
        currency: "TND",
        paymentMethod: paymentMethod || "flouci",
        expiresAt: validUntil.toISOString(),
        subscriptionTier: updated.subscriptionTier,
      },
    });
  } catch (error: any) {
    console.error("[Payment Checkout Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erreur lors de la validation du paiement." },
      { status: 500 }
    );
  }
}
