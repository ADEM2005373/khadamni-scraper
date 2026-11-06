import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma, { isDatabaseAvailable } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface RegisteredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

// In-memory user registry containing the default seeded account with secure bcrypt hash
export const registeredUsers: RegisteredUser[] = [
  {
    id: "user-adem-0805",
    email: "ouerhaiadem0805@gmail.com",
    passwordHash: "$2a$10$.OveQhg3.zeX.xh6GkZfBOIM93B4SqlElqJHdXl0yznt0GDDnSSQK",
    name: "Adem Ouerhai",
  },
];

export function registerNewUser(email: string, passwordHash: string, name: string): RegisteredUser {
  const normalized = email.toLowerCase().trim();
  const existing = registeredUsers.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    return existing;
  }
  const newUser: RegisteredUser = {
    id: `user-${Date.now()}`,
    email: normalized,
    passwordHash,
    name,
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
          };
        }

        // 2. Check PostgreSQL database if connected
        if (await isDatabaseAvailable()) {
          try {
            const dbUser = await prisma.user.findUnique({ where: { email } });
            if (dbUser) {
              const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
              if (!isMatch) {
                throw new Error("Mot de passe incorrect.");
              }
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: email.split("@")[0],
              };
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-fallback-key-khadamni-32chars",
};
