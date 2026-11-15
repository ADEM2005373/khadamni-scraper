import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/khademni";
const DB_NAME = "khademni";

const ADMIN_EMAIL = "ouerhaiadem0805@gmail.com";
const ADMIN_PASSWORD_RAW = "ademadem0808";
const ADMIN_NAME = "Adem Ouerhani";

async function createAdmin() {
  console.log("=== CREATING OFFICIAL ADMINISTRATOR ACCOUNT ===\n");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD_RAW, 10);
  const now = new Date();

  // 1. Seed into MongoDB
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const userDoc = {
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
    userType: "worker",
    name: ADMIN_NAME,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("users").updateOne(
    { email: ADMIN_EMAIL },
    { $set: userDoc },
    { upsert: true }
  );

  const profileDoc = {
    email: ADMIN_EMAIL,
    firstName: "Adem",
    lastName: "Ouerhani",
    userType: "worker",
    role: "admin",
    subscriptionTier: "pro",
    subscriptionExpiresAt: null,
    linkedinUrl: "https://www.linkedin.com/in/adem-ouerhani-724743349/",
    githubUrl: "https://github.com/ADEM2005373",
    portfolioUrl: "",
    cvFileUrl: null,
    atsScore: null,
    hasCompletedOnboarding: true,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("profiles").updateOne(
    { email: ADMIN_EMAIL },
    { $set: profileDoc },
    { upsert: true }
  );

  console.log("✓ MongoDB: Admin user & profile created successfully.");
  await client.close();

  // 2. Seed into .data/profiles.json
  const dataDir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const profilesPath = path.join(dataDir, "profiles.json");
  const localProfile = {
    id: `profile-admin-${Date.now()}`,
    userId: `user-admin-${Date.now()}`,
    email: ADMIN_EMAIL,
    firstName: "Adem",
    lastName: "Ouerhani",
    linkedinUrl: "https://www.linkedin.com/in/adem-ouerhani-724743349/",
    githubUrl: "https://github.com/ADEM2005373",
    portfolioUrl: "",
    cvFileUrl: null,
    atsScore: null,
    hasCompletedOnboarding: true,
    userType: "worker",
    subscriptionTier: "pro",
    subscriptionExpiresAt: null,
    lettersCount: 0,
  };

  fs.writeFileSync(profilesPath, JSON.stringify([localProfile], null, 2), "utf-8");
  console.log("✓ .data/profiles.json: Admin profile registered.");

  console.log("\n=======================================================");
  console.log("   👑 OFFICIAL ADMIN ACCOUNT READY!                    ");
  console.log("=======================================================");
  console.log(`   Email        : ${ADMIN_EMAIL}`);
  console.log(`   Password     : ${ADMIN_PASSWORD_RAW}`);
  console.log(`   Role         : admin`);
  console.log(`   Login Portal : http://localhost:3000/admin/login`);
  console.log("=======================================================\n");
}

createAdmin().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});
