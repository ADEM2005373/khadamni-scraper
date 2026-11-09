/**
 * Seed & Verification Script for MongoDB (Local MongoDB Compass & Atlas)
 * Run with: npx tsx scripts/seed-mongo.ts
 */

import { getDb, isMongoAvailable, initializeMongoIndexes } from "../src/lib/mongodb";
import { getScrapedJobs, syncJobsToMongo } from "../src/lib/jobStore";
import bcrypt from "bcryptjs";

async function main() {
  console.log("============================================================");
  console.log("[MongoDB Seed & Migration] Starting MongoDB setup...");
  console.log("============================================================\n");

  const available = await isMongoAvailable();
  if (!available) {
    console.error("❌ Cannot connect to MongoDB. Check that MongoDB service or Compass is running.");
    process.exit(1);
  }

  console.log("✓ Connected successfully to MongoDB server.");

  // 1. Initialize Indexes
  console.log("\n[1/4] Building MongoDB indexes...");
  await initializeMongoIndexes();

  const db = await getDb();

  // 2. Sync all 100+ Tunisian jobs and PFE offers into 'jobs' collection
  console.log("\n[2/4] Syncing Tunisian job postings into 'jobs' collection...");
  const allJobs = getScrapedJobs();
  const syncResult = await syncJobsToMongo(allJobs);
  const totalJobsInDb = await db.collection("jobs").countDocuments();
  console.log(`✓ Processed ${allJobs.length} offers. Total in 'jobs' collection: ${totalJobsInDb}`);

  // 3. Seed Users & Profiles
  console.log("\n[3/4] Ensuring default accounts in 'users' and 'profiles'...");
  const defaultPasswordHash = await bcrypt.hash("ademadem0808", 10);

  // Remove legacy test accounts
  await db.collection("users").deleteOne({ email: "adem@khadamni.com" });
  await db.collection("profiles").deleteOne({ email: "adem@khadamni.com" });

  const defaultUsers = [
    {
      email: "ouerhaiadem0805@gmail.com",
      name: "Adem Ouerhani",
      userType: "worker",
      role: "admin",
    },
  ];

  for (const user of defaultUsers) {
    const userRes = await db.collection("users").findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          email: user.email,
          passwordHash: defaultPasswordHash,
          role: user.role || "admin",
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
      { email: user.email },
      {
        $set: {
          userId,
          email: user.email,
          firstName: "Adem",
          lastName: "Ouerhani",
          userType: user.userType,
          linkedinUrl: "https://linkedin.com/in/adem-ouerhani",
          githubUrl: "https://github.com/adem-ouerhani",
          portfolioUrl: "https://adem-portfolio.tn",
          atsScore: 85,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          cvFileUrl: null,
        },
      },
      { upsert: true }
    );

    console.log(`✓ User synced: ${user.email} (Type: ${user.userType}, Password: ademadem0808)`);
  }

  // 4. Verification breakdown
  console.log("\n[4/4] Verifying MongoDB Collections & Statistics:");
  const collections = ["users", "profiles", "jobs", "user_applications"];
  for (const col of collections) {
    const count = await db.collection(col).countDocuments();
    console.log(`  - Collection '${col}': ${count} documents`);
  }

  console.log("\n============================================================");
  console.log("🎉 MongoDB Migration completed successfully!");
  console.log("Open MongoDB Compass and refresh to inspect your 'khademni' database.");
  console.log("============================================================\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error during MongoDB setup:", err);
  process.exit(1);
});
