import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma, { isDatabaseAvailable } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface RegisteredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  userType?: "student" | "worker";
  role?: "admin" | "candidate";
}

// In-memory user registry containing the single owner admin account
export const registeredUsers: RegisteredUser[] = [
  {
    id: "user-adem-owner",
    email: "ouerhaiadem0805@gmail.com",
    passwordHash: "$2a$10$CcWTyjjhpF0mHQ5xTAT5sePRMrClSz0PyfgGZ/7coHUEbkuWInj9.", // ademadem0808
    name: "Adem Ouerhani",
    userType: "worker",
    role: "admin",
  },
  {
    id: "user-adem-variant",
    email: "ouerhaniadem0805@gmail.com",
    passwordHash: "$2a$10$CcWTyjjhpF0mHQ5xTAT5sePRMrClSz0PyfgGZ/7coHUEbkuWInj9.", // ademadem0808
    name: "Adem Ouerhani",
    userType: "worker",
    role: "admin",
  },
];

export function registerNewUser(
  email: string,
  passwordHash: string,
  name: string,
  userType: "student" | "worker" = "student"
): RegisteredUser {
  const normalized = email.toLowerCase().trim();
  const existing = registeredUsers.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    existing.userType = userType;
    return existing;
  }
  const newUser: RegisteredUser = {
    id: `user-${Date.now()}`,
    email: normalized,
    passwordHash,
    name,
    userType,
  };
  registeredUsers.push(newUser);
  return newUser;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Veuillez renseigner un email et un mot de passe.");
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        const isOwner = ["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(email);

        // 1. Check in-memory registered users
        const inMemoryUser = registeredUsers.find((u) => u.email.toLowerCase() === email);
        if (inMemoryUser) {
          const isMatch = inMemoryUser.passwordHash.startsWith("$2")
            ? await bcrypt.compare(password, inMemoryUser.passwordHash)
            : inMemoryUser.passwordHash === password;

          if (!isMatch) {
            throw new Error("Mot de passe incorrect.");
          }
          return {
            id: inMemoryUser.id,
            email: inMemoryUser.email,
            name: inMemoryUser.name,
            userType: inMemoryUser.userType || "worker",
            role: inMemoryUser.role || (isOwner ? "admin" : "candidate"),
          } as any;
        }

        // 2. Check MongoDB users collection
        try {
          const { getDb, isMongoAvailable } = await import("@/lib/mongodb");
          if (await isMongoAvailable()) {
            const db = await getDb();
            const mongoUser = await db.collection("users").findOne({ email });
            if (mongoUser) {
              const isMatch = await bcrypt.compare(password, mongoUser.passwordHash);

              if (!isMatch) {
                throw new Error("Mot de passe incorrect.");
              }
              const mongoProfile = await db
                .collection("profiles")
                .findOne({ $or: [{ userId: mongoUser._id.toString() }, { email }] });

              const fullName = mongoProfile
                ? `${mongoProfile.firstName || ""} ${mongoProfile.lastName || ""}`.trim()
                : email.split("@")[0];

              const role = mongoUser.role || (isOwner ? "admin" : "candidate");

              return {
                id: mongoUser._id.toString(),
                email: mongoUser.email,
                name: fullName || email.split("@")[0],
                userType: mongoProfile?.userType || "worker",
                role,
              } as any;
            }
          }
        } catch (mErr: any) {
          if (mErr.message === "Mot de passe incorrect.") throw mErr;
          console.warn("[Auth Note] MongoDB auth check:", mErr?.message);
        }

        // 3. Fallback check to PostgreSQL database if connected
        if (await isDatabaseAvailable()) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email },
              include: { profile: true },
            });
            if (dbUser) {
              const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
              if (!isMatch) {
                throw new Error("Mot de passe incorrect.");
              }
              const isOwner = ["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(dbUser.email.toLowerCase().trim());
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: email.split("@")[0],
                userType: (dbUser.profile as any)?.userType || "student",
                role: (dbUser as any).role || (isOwner ? "admin" : "candidate"),
              } as any;
            }
          } catch {
            // Database connection offline, fall through to error
          }
        }

        throw new Error("Identifiants invalides. Vérifiez votre adresse email et mot de passe.");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.userType = (user as any).userType || "student";
        token.role = (user as any).role || "candidate";
      }
      // Ensure owner email always has admin role
      if (token.email && ["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes((token.email as string).toLowerCase().trim())) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).userType = (token.userType as string) || "student";
        (session.user as any).role = (token.role as string) || "candidate";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-fallback-key-khadamni-32chars",
};
