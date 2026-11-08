async function main() {
  console.log("Checking Homepage (http://localhost:3000/)...");
  const rHome = await fetch("http://localhost:3000/");
  const tHome = await rHome.text();
  console.log("Homepage status:", rHome.status);
  console.log("Homepage has /jobs link:", tHome.includes('href="/jobs"'));
  console.log("Homepage has live preview section:", tHome.includes('id="live-preview"'));

  console.log("\nChecking Public Explorer (http://localhost:3000/jobs)...");
  const rJobs = await fetch("http://localhost:3000/jobs");
  const tJobs = await rJobs.text();
  console.log("Jobs page status:", rJobs.status);
  console.log("Jobs page title rendered:", tJobs.includes("Explorer les Offres"));

  console.log("\nChecking /api/jobs endpoint...");
  const rApi = await fetch("http://localhost:3000/api/jobs");
  const dataApi = await rApi.json();
  console.log("API success:", dataApi.success);
  console.log("API source:", dataApi.source);
  console.log("API total jobs:", dataApi.total);
  if (dataApi.jobs?.length > 0) {
    console.log("Sample job 1:", {
      title: dataApi.jobs[0].job_title,
      company: dataApi.jobs[0].company_name,
      portal: dataApi.jobs[0].source_site,
      location: dataApi.jobs[0].location,
    });
  }

  console.log("\nChecking /api/jobs?userType=student endpoint...");
  const rStudent = await fetch("http://localhost:3000/api/jobs?userType=student");
  const dataStudent = await rStudent.json();
  console.log("Student offers count:", dataStudent.total);
  if (dataStudent.jobs?.length > 0) {
    console.log("Sample student stage:", {
      title: dataStudent.jobs[0].job_title,
      company: dataStudent.jobs[0].company_name,
      portal: dataStudent.jobs[0].source_site,
    });
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
