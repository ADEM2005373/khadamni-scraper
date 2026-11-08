import { getDb } from "../src/lib/mongodb";

const TUNISIAN_PORTALS = [
  "TanitJobs",
  "LinkedIn Jobs",
  "Keejob",
  "Emploi.nat.tn (ANETI)",
  "Optioncarriere.tn",
  "CRIT Tunisie",
  "CareerJet",
  "Bayt",
  "Farah.tn",
  "Expertini",
];

async function main() {
  const db = await getDb();
  const totalBefore = await db.collection("jobs").countDocuments();
  console.log(`[Clean Mock Jobs] Total documents before cleanup: ${totalBefore}`);

  // Query jobs that are either explicitly marked as KhademniMock / Remotive
  // OR have source_site not in the 10 Tunisian portals
  const deleteResult = await db.collection("jobs").deleteMany({
    $or: [
      { source: "KhademniMock" },
      { source: "Remotive" },
      { source_site: { $nin: TUNISIAN_PORTALS } },
      { source_site: null },
      { url: { $regex: /remotive\.com/i } },
      { location: { $regex: /san francisco|london|remote worldwide/i } },
    ],
  });

  console.log(`[Clean Mock Jobs] Deleted ${deleteResult.deletedCount} old mock/non-Tunisian jobs.`);

  const totalAfter = await db.collection("jobs").countDocuments();
  console.log(`[Clean Mock Jobs] Total Tunisian documents remaining in MongoDB: ${totalAfter}`);

  // Verify portals present
  const portalsInDb = await db.collection("jobs").distinct("source_site");
  console.log("[Clean Mock Jobs] Distinct portals in DB now:", portalsInDb);

  process.exit(0);
}

main().catch((err) => {
  console.error("Error cleaning mock jobs:", err);
  process.exit(1);
});
