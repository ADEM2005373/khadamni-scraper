-- Khadamni Scraper - Initial PostgreSQL Migration Schema

-- CreateTable users
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable profiles
CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,
    "cvFileUrl" TEXT,
    "atsScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable scraped_jobs
CREATE TABLE IF NOT EXISTS "scraped_jobs" (
    "id" TEXT NOT NULL,
    "sourceSite" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "jobUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Full-Time',
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraped_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable user_applications
CREATE TABLE IF NOT EXISTS "user_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "predictedChance" DOUBLE PRECISION,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX IF NOT EXISTS "profiles_userId_key" ON "profiles"("userId");

CREATE UNIQUE INDEX IF NOT EXISTS "scraped_jobs_jobUrl_key" ON "scraped_jobs"("jobUrl");
CREATE INDEX IF NOT EXISTS "scraped_jobs_sourceSite_idx" ON "scraped_jobs"("sourceSite");
CREATE INDEX IF NOT EXISTS "scraped_jobs_location_idx" ON "scraped_jobs"("location");

CREATE INDEX IF NOT EXISTS "user_applications_userId_idx" ON "user_applications"("userId");
CREATE INDEX IF NOT EXISTS "user_applications_jobId_idx" ON "user_applications"("jobId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_applications_userId_jobId_key" ON "user_applications"("userId", "jobId");

-- AddForeignKeys
ALTER TABLE "profiles" 
    DROP CONSTRAINT IF EXISTS "profiles_userId_fkey",
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_applications" 
    DROP CONSTRAINT IF EXISTS "user_applications_userId_fkey",
    ADD CONSTRAINT "user_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_applications" 
    DROP CONSTRAINT IF EXISTS "user_applications_jobId_fkey",
    ADD CONSTRAINT "user_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "scraped_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
