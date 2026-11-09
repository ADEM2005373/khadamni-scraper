import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const OWNER_EMAILS = [
  "ouerhaiadem0805@gmail.com",
  "adem@khadamni.com",
];

export async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return { isAuthorized: false, user: null };
  }

  const email = session.user.email.toLowerCase().trim();
  const role = (session.user as any).role;
  const isAuthorized = role === "admin" || OWNER_EMAILS.includes(email);

  return {
    isAuthorized,
    user: session.user,
  };
}

export function unauthorizedAdminResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "Accès refusé. Privilèges Administrateur requis.",
    },
    { status: 403 }
  );
}
