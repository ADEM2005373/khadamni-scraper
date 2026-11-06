import fs from "fs";
import path from "path";

export interface UserProfileData {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  cvFileUrl: string | null;
  atsScore: number | null;
  hasCompletedOnboarding: boolean;
  userType?: "student" | "worker";
}

// Global in-memory map of profiles keyed by email surviving HMR
const globalForProfiles = globalThis as unknown as {
  globalProfiles?: Map<string, UserProfileData>;
  isStorageInitialized?: boolean;
};

const DATA_FILE_PATH = path.join(process.cwd(), ".data", "profiles.json");

function ensureDirectoryExists() {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignore if cannot create
    }
  }
}

function loadFromDisk(): Map<string, UserProfileData> {
  const map = new Map<string, UserProfileData>();
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const records = JSON.parse(content);
      if (Array.isArray(records)) {
        for (const item of records) {
          if (item && item.email) {
            map.set(item.email.toLowerCase().trim(), item);
          }
        }
      }
    }
  } catch (err) {
    console.warn("[ProfileStore] Could not read profiles from disk:", err);
  }
  return map;
}

function saveToDisk(map: Map<string, UserProfileData>) {
  try {
    ensureDirectoryExists();
    const arr = Array.from(map.values());
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(arr, null, 2), "utf-8");
  } catch (err) {
    console.warn("[ProfileStore] Could not persist profiles to disk:", err);
  }
}

if (!globalForProfiles.globalProfiles) {
  globalForProfiles.globalProfiles = loadFromDisk();
  globalForProfiles.isStorageInitialized = true;
}

const globalProfiles = globalForProfiles.globalProfiles;

/**
 * Returns a profile for a specific email.
 * Ensures data is preserved across requests and reloads.
 */
export function getProfileForEmail(email: string): UserProfileData {
  const normalized = email.toLowerCase().trim();

  if (!globalProfiles.has(normalized)) {
    const isTestUser = normalized === "ouerhaiadem0805@gmail.com";
    const initial: UserProfileData = {
      id: `profile-${Date.now()}`,
      userId: `user-${Date.now()}`,
      email: normalized,
      firstName: isTestUser ? "Adem" : "",
      lastName: isTestUser ? "Ouerhai" : "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      cvFileUrl: null,
      atsScore: null,
      hasCompletedOnboarding: false,
      userType: "student",
    };
    globalProfiles.set(normalized, initial);
    saveToDisk(globalProfiles);
  }

  return globalProfiles.get(normalized)!;
}

/**
 * Updates a user's profile and saves it permanently to disk.
 */
export function updateProfileForEmail(
  email: string,
  updates: Partial<UserProfileData>
): UserProfileData {
  const normalized = email.toLowerCase().trim();
  const current = getProfileForEmail(normalized);
  const updated: UserProfileData = {
    ...current,
    ...updates,
    email: current.email, // preserve normalized email
  };
  globalProfiles.set(normalized, updated);
  saveToDisk(globalProfiles);
  return updated;
}

