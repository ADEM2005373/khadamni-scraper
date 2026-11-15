import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/khademni";
const DB_NAME = "khademni";

async function totalWipeAllAccounts() {
  console.log("=== EXECUTING 100% TOTAL WIPE OF ALL ACCOUNTS & PROFILES ===\n");

  // 1. Wipe MongoDB users, profiles, applications
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const delUsers = await db.collection("users").deleteMany({});
  console.log(`✓ MongoDB users wiped: ${delUsers.deletedCount} account(s) deleted.`);

  const delProfiles = await db.collection("profiles").deleteMany({});
  console.log(`✓ MongoDB profiles wiped: ${delProfiles.deletedCount} profile(s) deleted.`);

  const delApps = await db.collection("applications").deleteMany({});
  console.log(`✓ MongoDB applications wiped: ${delApps.deletedCount} application(s) deleted.`);

  // Verify counts
  const remainingUsers = await db.collection("users").countDocuments();
  const remainingProfiles = await db.collection("profiles").countDocuments();
  const remainingApps = await db.collection("applications").countDocuments();
  console.log(`Remaining in MongoDB -> Users: ${remainingUsers}, Profiles: ${remainingProfiles}, Applications: ${remainingApps}`);

  await client.close();

  // 2. Wipe Local file stores in .data/
  console.log("\n--- Wiping Local .data/ stores ---");
  const dataDir = path.join(process.cwd(), ".data");

  const profilesPath = path.join(dataDir, "profiles.json");
  fs.writeFileSync(profilesPath, JSON.stringify([], null, 2), "utf-8");
  console.log(`✓ .data/profiles.json wiped (reset to empty array []).`);

  const appsPath = path.join(dataDir, "applications.json");
  fs.writeFileSync(appsPath, JSON.stringify([], null, 2), "utf-8");
  console.log(`✓ .data/applications.json wiped (reset to empty array []).`);

  // 3. Wipe all uploaded CVs in public/uploads/resumes/
  console.log("\n--- Wiping All Uploaded CVs ---");
  const resumesDir = path.join(process.cwd(), "public", "uploads", "resumes");
  if (fs.existsSync(resumesDir)) {
    const files = fs.readdirSync(resumesDir);
    let deletedCount = 0;
    for (const file of files) {
      if (file.endsWith(".pdf") || file.endsWith(".docx") || file.endsWith(".txt")) {
        fs.unlinkSync(path.join(resumesDir, file));
        deletedCount++;
        console.log(` - Deleted resume: ${file}`);
      }
    }
    console.log(`✓ Wiped ${deletedCount} file(s) from public/uploads/resumes/. Directory is now 100% empty.`);
  }

  console.log("\n=======================================================");
  console.log("   🎉 ALL ACCOUNTS & PROFILES 100% WIPED CLEAN!         ");
  console.log("   Zero users, zero profiles, zero resumes remaining.  ");
  console.log("=======================================================");
}

totalWipeAllAccounts().catch((err) => {
  console.error("Wipe error:", err);
  process.exit(1);
});
