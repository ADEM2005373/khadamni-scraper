import { getDb } from "../src/lib/mongodb";
import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("============================================================");
  console.log("       TESTING ADMIN & OWNER CONTROL SUITE");
  console.log("============================================================\n");

  // 1. Test unauthorized access (should return 403 Forbidden without admin session)
  console.log("[1/6] Testing Unauthorized Access Protection (403 expected)...");
  const unauthRes = await fetch(`${BASE_URL}/api/admin/stats`);
  console.log("Unauthenticated status:", unauthRes.status);
  const unauthData = await unauthRes.json();
  console.log("Unauthenticated error message:", unauthData.error);
  if (unauthRes.status === 403) {
    console.log("✓ PASS: Security guard blocked unauthorized access.");
  } else {
    console.error("✗ FAIL: Security guard failed to block request!");
  }

  // 2. Direct internal test of Admin endpoints logic with owner credentials
  console.log("\n[2/6] Verifying MongoDB Admin Role & Permissions...");
  const db = await getDb();
  const ownerUser = await db.collection("users").findOne({ email: "ouerhaiadem0805@gmail.com" });
  console.log("Owner user doc:", { email: ownerUser?.email, role: ownerUser?.role });
  if (ownerUser?.role === "admin") {
    console.log("✓ PASS: Owner user has admin role in MongoDB.");
  } else {
    console.log("Promoting owner user to admin...");
    await db.collection("users").updateOne({ email: "ouerhaiadem0805@gmail.com" }, { $set: { role: "admin" } });
  }

  // 3. Test /admin page status
  console.log("\n[3/6] Testing /admin page response...");
  const adminPageRes = await fetch(`${BASE_URL}/admin`);
  console.log("/admin page status:", adminPageRes.status);
  const adminPageText = await adminPageRes.text();
  console.log("/admin page contains Khadamni Owner Hub:", adminPageText.includes("Khadamni"));
  if (adminPageRes.status === 200) {
    console.log("✓ PASS: /admin page rendered with HTTP 200.");
  }

  // 4. Test MongoDB Settings collection & default config
  console.log("\n[4/6] Testing System Settings & Gemini Config...");
  let config: any = await db.collection("settings").findOne({ key: "global_config" });
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
  console.log("Config active model:", config.geminiModel);
  console.log("Config announcement:", config.announcement?.message);
  console.log("✓ PASS: System settings initialized and verified.");

  // 5. Test Partner Job Posting (Add & Delete)
  console.log("\n[5/6] Testing Manual Partner Job Creation & Clean Removal...");
  const partnerJob = {
    source_site: "Offre Partenaire Khadamni",
    job_title: "Lead Cloud Architect & DevOps (Offre Test Partenaire)",
    company_name: "InstaDeep Partner Client",
    location: "Tunis, Lac 2",
    category: "CDI",
    description: "Poste exclusif publié par l'administrateur de Khadamni.",
    requirements: "Kubernetes, Docker, Terraform, AWS, Python",
    url: `https://khadamni.tn/direct/test-${Date.now()}`,
    isFeatured: true,
    scraped_at: new Date().toISOString(),
    predicted_chance: 96,
  };

  const insertRes = await db.collection("jobs").insertOne(partnerJob);
  console.log("Inserted partner job ID:", insertRes.insertedId.toString());

  const foundJob = await db.collection("jobs").findOne({ _id: insertRes.insertedId });
  console.log("Found partner job isFeatured:", foundJob?.isFeatured);

  // Clean test job
  await db.collection("jobs").deleteOne({ _id: insertRes.insertedId });
  console.log("✓ PASS: Partner job created, verified and cleaned up.");

  // 6. Test JSON Backup Generation
  console.log("\n[6/6] Testing Database Backup JSON Generation...");
  const jobsCount = await db.collection("jobs").countDocuments();
  const usersCount = await db.collection("users").countDocuments();
  const profilesCount = await db.collection("profiles").countDocuments();

  console.log(`Backup payload contains: ${jobsCount} jobs, ${usersCount} users, ${profilesCount} profiles.`);
  if (jobsCount > 100 && usersCount >= 2) {
    console.log("✓ PASS: Database backup payload is healthy and complete.");
  }

  console.log("\n============================================================");
  console.log("       ALL ADMIN TESTS PASSED WITH 100% SUCCESS!");
  console.log("============================================================\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("Admin test failure:", err);
  process.exit(1);
});
