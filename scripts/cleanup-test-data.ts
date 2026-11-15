import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/khademni";
const DB_NAME = "khademni";

const OWNER_EMAILS = [
  "ouerhaiadem0805@gmail.com",
  "ouerhaniadem0805@gmail.com",
];

async function inspectAndClean() {
  console.log("=== INSPECTING & PURGING ALL TEST DATA ===\n");

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // 1. Check & clean test users in MongoDB
  const usersBefore = await db.collection("users").find({}).toArray();
  console.log(`Current users in MongoDB (${usersBefore.length}):`);
  for (const u of usersBefore) {
    console.log(` - Email: ${u.email}, Role: ${u.role}, UserType: ${u.userType}`);
  }

  // Delete all users EXCEPT owner
  const delUsersResult = await db.collection("users").deleteMany({
    email: { $nin: OWNER_EMAILS },
  });
  console.log(`\n✓ Purged ${delUsersResult.deletedCount} non-owner test users from MongoDB.`);

  // Reset owner profile & purge test profiles
  const profilesBefore = await db.collection("profiles").find({}).toArray();
  console.log(`\nCurrent profiles in MongoDB (${profilesBefore.length}):`);
  for (const p of profilesBefore) {
    console.log(` - Email: ${p.email}, userType: ${p.userType}, sub: ${p.subscriptionTier}`);
  }

  const delProfilesResult = await db.collection("profiles").deleteMany({
    email: { $nin: OWNER_EMAILS },
  });
  console.log(`✓ Purged ${delProfilesResult.deletedCount} non-owner test profiles from MongoDB.`);

  // Reset owner profile in MongoDB to default clean state
  await db.collection("profiles").updateMany(
    { email: { $in: OWNER_EMAILS } },
    {
      $set: {
        subscriptionTier: "free",
        subscriptionExpiresAt: null,
      },
      $unset: {
        testData: "",
      },
    }
  );
  console.log(`✓ Reset owner subscription tier to clean default ("free") in MongoDB.`);

  // 2. Clean test applications in MongoDB
  const appCountBefore = await db.collection("applications").countDocuments();
  if (appCountBefore > 0) {
    const delApps = await db.collection("applications").deleteMany({
      $or: [
        { email: { $nin: OWNER_EMAILS } },
        { isTest: true },
        { status: "Test" },
      ],
    });
    console.log(`✓ Purged ${delApps.deletedCount} test applications from MongoDB.`);
  }

  // 3. Clean test jobs in MongoDB (keep only genuine scraped Tunisian jobs)
  const testJobsDeleted = await db.collection("jobs").deleteMany({
    $or: [
      { source_site: { $regex: /test|partenaire|mock|fake|sample/i } },
      { source: { $regex: /test|partenaire|mock|fake|sample/i } },
      { job_title: { $regex: /^test\b|dummy|mock offer/i } },
      { company_name: { $regex: /^test\b|dummy corp/i } },
    ],
  });
  console.log(`✓ Purged ${testJobsDeleted.deletedCount} test jobs from MongoDB.`);

  const remainingJobs = await db.collection("jobs").countDocuments();
  console.log(`✓ Remaining genuine Tunisian jobs in MongoDB: ${remainingJobs}`);

  await client.close();

  // 4. Clean local file stores in .data/
  console.log("\n--- Cleaning Local File Stores (.data/) ---");
  const dataDir = path.join(process.cwd(), ".data");

  // Clean profiles.json
  const profilesPath = path.join(dataDir, "profiles.json");
  if (fs.existsSync(profilesPath)) {
    try {
      const content = fs.readFileSync(profilesPath, "utf-8");
      const records = JSON.parse(content);
      if (Array.isArray(records)) {
        const cleanedProfiles = records
          .filter((p: any) => p && OWNER_EMAILS.includes(p.email?.toLowerCase().trim()))
          .map((p: any) => ({
            ...p,
            subscriptionTier: "free",
            subscriptionExpiresAt: null,
          }));
        fs.writeFileSync(profilesPath, JSON.stringify(cleanedProfiles, null, 2), "utf-8");
        console.log(`✓ Cleaned .data/profiles.json (Kept only owner profile in clean state).`);
      }
    } catch (e: any) {
      console.warn("Could not clean profiles.json:", e.message);
    }
  }

  // Clean applications.json
  const appsPath = path.join(dataDir, "applications.json");
  if (fs.existsSync(appsPath)) {
    try {
      fs.writeFileSync(appsPath, JSON.stringify([], null, 2), "utf-8");
      console.log(`✓ Reset .data/applications.json to empty clean array.`);
    } catch (e: any) {
      console.warn("Could not clean applications.json:", e.message);
    }
  }

  // Clean test CV uploads in public/uploads/resumes/
  console.log("\n--- Cleaning Test Uploaded CVs ---");
  const resumesDir = path.join(process.cwd(), "public", "uploads", "resumes");
  if (fs.existsSync(resumesDir)) {
    const files = fs.readdirSync(resumesDir);
    let deletedFiles = 0;
    for (const f of files) {
      // Keep only the original base CV, remove timestamped test uploads (cv_179...)
      if (f.startsWith("cv_179") && f.endsWith(".pdf")) {
        fs.unlinkSync(path.join(resumesDir, f));
        deletedFiles++;
        console.log(` - Removed test upload: ${f}`);
      }
    }
    console.log(`✓ Removed ${deletedFiles} test resume uploads. Kept original CV.`);
  }

  console.log("\n=======================================================");
  console.log("   🎉 ALL TEST DATA PURGED & ENVIRONMENT IS CLEAN!     ");
  console.log("=======================================================");
}

inspectAndClean().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
