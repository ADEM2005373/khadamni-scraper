/**
 * MongoDB Connection Management for Khadamni Scraper
 * Optimized according to MongoDB official driver best practices:
 * - Singleton client pattern across Next.js hot reloads / serverless invocations
 * - Tuned connection pool (maxPoolSize: 20, minPoolSize: 2, maxIdleTimeMS: 30000)
 * - Safe fail-fast connection checks with offline resilience
 */

import { MongoClient, Db, ServerApiVersion } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL?.startsWith("mongodb")
    ? (process.env.MONGODB_URI || process.env.DATABASE_URL!)
    : "mongodb://127.0.0.1:27017/khademni";

const dbName = process.env.MONGODB_DB_NAME || "khademni";

// Global cache to prevent multiple client instances across Next.js HMR cycles
declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
  var __mongoClientInstance__: MongoClient | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const mongoOptions = {
  maxPoolSize: 20, // Concurrency headroom for concurrent API routes and background crawlers
  minPoolSize: 2, // Pre-warmed connections ready for instant response
  maxIdleTimeMS: 30000, // Prune connections idle for >30s
  connectTimeoutMS: 5000, // Fail fast (5s) if server is unreachable
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
};

function createClient(): MongoClient {
  if (uri.startsWith("mongodb+srv://")) {
    // Atlas Cloud Cluster
    return new MongoClient(uri, {
      ...mongoOptions,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
    });
  }
  // Local MongoDB (Compass / standalone)
  return new MongoClient(uri, mongoOptions);
}

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClientPromise__) {
    client = createClient();
    global.__mongoClientInstance__ = client;
    global.__mongoClientPromise__ = client.connect();
  }
  clientPromise = global.__mongoClientPromise__;
} else {
  client = createClient();
  clientPromise = client.connect();
}

/**
 * Returns the connected MongoClient instance
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Returns the default Khadamni MongoDB Database
 */
export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

/**
 * Checks if MongoDB is reachable with a lightweight ping
 */
export async function isMongoAvailable(): Promise<boolean> {
  try {
    const c = await Promise.race([
      clientPromise,
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 8000)
      ),
    ]);
    if (!c) return false;
    await c.db(dbName).command({ ping: 1 });
    return true;
  } catch (err: any) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[MongoDB Availability Check Note]:", err?.message);
    }
    return false;
  }
}

/**
 * Initializes database indexes for optimal search and uniqueness
 */
export async function initializeMongoIndexes(): Promise<void> {
  try {
    const db = await getDb();

    // 1. Jobs Collection indexes
    const jobs = db.collection("jobs");
    // Use sparse: true so legacy documents without 'url' do not cause E11000 duplicate key errors
    await jobs.createIndex({ url: 1 }, { unique: true, sparse: true });
    await jobs.createIndex({ source_site: 1, category: 1 });
    await jobs.createIndex({ location: 1 });
    await jobs.createIndex({ scraped_at: -1 });
    // Text search index for multi-keyword search
    await jobs.createIndex(
      {
        job_title: "text",
        company_name: "text",
        description: "text",
        location: "text",
      },
      {
        weights: {
          job_title: 10,
          company_name: 5,
          location: 3,
          description: 1,
        },
        name: "JobsTextSearchIndex",
      }
    );

    // 2. Users Collection indexes
    const users = db.collection("users");
    await users.createIndex({ email: 1 }, { unique: true });

    // 3. Profiles Collection indexes
    const profiles = db.collection("profiles");
    await profiles.createIndex({ email: 1 }, { unique: true, sparse: true });
    await profiles.createIndex({ userId: 1 }, { sparse: true });

    // 4. User Applications Collection indexes
    const applications = db.collection("user_applications");
    await applications.createIndex({ userId: 1, jobId: 1 }, { unique: true });
    await applications.createIndex({ userId: 1 });
    await applications.createIndex({ appliedAt: -1 });

    console.log("[MongoDB] Core collections & indexes successfully verified.");
  } catch (err: any) {
    console.warn("[MongoDB Index Init Warning]:", err?.message);
  }
}

export default clientPromise;
