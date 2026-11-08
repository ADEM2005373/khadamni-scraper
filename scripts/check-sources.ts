import { getDb } from "../src/lib/mongodb";

async function main() {
  const db = await getDb();
  const sources1 = await db.collection("jobs").distinct("source_site");
  const sources2 = await db.collection("jobs").distinct("source");
  console.log("source_site distinct:", sources1);
  console.log("source distinct:", sources2);

  const nonTunisian = await db
    .collection("jobs")
    .find({
      source_site: {
        $nin: [
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
        ],
      },
    })
    .project({ title: 1, job_title: 1, company: 1, company_name: 1, source: 1, source_site: 1 })
    .toArray();

  console.log("Non-Tunisian / Old jobs count:", nonTunisian.length);
  console.log("Non-Tunisian samples:", nonTunisian.slice(0, 5));
  process.exit(0);
}

main().catch(console.error);
