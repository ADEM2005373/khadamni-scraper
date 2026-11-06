export interface StoredApplication {
  id: string;
  userId: string;
  userEmail: string;
  jobId: string;
  status: "Applied" | "Interviewing" | "Rejected" | "Offered" | string;
  predictedChance: number;
  appliedAt: string;
  job?: {
    jobTitle: string;
    companyName: string;
    location: string;
    sourceSite: string;
    jobUrl: string;
  };
  forecast?: {
    strengths?: string[];
    tailoredCoverLetterTip?: string;
  };
}

// Global in-memory list of applications, starting completely empty for clean production tests
const inMemoryApplications: StoredApplication[] = [];

export function getApplicationsForEmail(email?: string): StoredApplication[] {
  if (!email) {
    return inMemoryApplications;
  }
  const normalized = email.toLowerCase().trim();
  return inMemoryApplications.filter(
    (app) => app.userEmail.toLowerCase().trim() === normalized
  );
}

export function addApplication(app: StoredApplication): StoredApplication {
  // Check if already applied to this job by this user
  const existingIdx = inMemoryApplications.findIndex(
    (a) =>
      a.jobId === app.jobId &&
      a.userEmail.toLowerCase().trim() === app.userEmail.toLowerCase().trim()
  );

  if (existingIdx >= 0) {
    inMemoryApplications[existingIdx] = {
      ...inMemoryApplications[existingIdx],
      ...app,
    };
    return inMemoryApplications[existingIdx];
  }

  inMemoryApplications.unshift(app);
  return app;
}
