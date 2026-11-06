import { PrismaClient } from "@prisma/client";
import net from "net";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  isDbAvailable?: boolean;
  lastDbCheck?: number;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Direct errors to events to prevent stdout/stderr crash spam in offline dev mode
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

// Attach silent event listeners so Node doesn't log unhandled error events
// @ts-ignore
if (typeof prisma.$on === "function") {
  // @ts-ignore
  prisma.$on("error", () => {});
  // @ts-ignore
  prisma.$on("warn", () => {});
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Checks if a TCP port is open (e.g. PostgreSQL 5432).
 */
function isPortOpen(host: string, port: number, timeoutMs = 400): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeoutMs);

    socket.on("connect", () => {
      isConnected = true;
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("close", () => {
      if (!isConnected) resolve(false);
    });

    try {
      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Rapid check to verify if PostgreSQL is actively listening and credentials are valid.
 * Caches result for 60 seconds so operations stay lightning fast if the database is offline.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  if (
    globalForPrisma.isDbAvailable !== undefined &&
    globalForPrisma.lastDbCheck !== undefined &&
    now - globalForPrisma.lastDbCheck < 60000
  ) {
    return globalForPrisma.isDbAvailable;
  }

  try {
    // 1. Fast socket pre-check (5ms)
    const portOpen = await isPortOpen("localhost", 5432, 350);
    if (!portOpen) {
      globalForPrisma.isDbAvailable = false;
      globalForPrisma.lastDbCheck = now;
      return false;
    }

    // 2. If port is open, test database authentication
    const checkPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timeout")), 1200)
    );
    await Promise.race([checkPromise, timeoutPromise]);
    globalForPrisma.isDbAvailable = true;
  } catch {
    globalForPrisma.isDbAvailable = false;
  }

  globalForPrisma.lastDbCheck = now;
  return globalForPrisma.isDbAvailable;
}

export default prisma;

