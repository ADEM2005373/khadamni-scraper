"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Loader2,
  Terminal,
  ArrowRight,
  ChevronLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

const AUTHORIZED_ADMIN_EMAILS = [
  "ouerhaiadem0805@gmail.com",
  "ouerhaniadem0805@gmail.com",
];

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setErrorMessage("Accès refusé : Vos identifiants ne disposent pas des privilèges administrateur.");
    }
  }, [searchParams]);

  // If already logged in as admin, redirect directly to /admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const currentEmail = session.user.email.toLowerCase().trim();
      const currentRole = (session.user as any)?.role;
      if (currentRole === "admin" || AUTHORIZED_ADMIN_EMAILS.includes(currentEmail)) {
        router.push("/admin");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const res = await signIn("credentials", {
        email: normalizedEmail,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error || "Identifiant ou mot de passe administrateur incorrect.");
        setIsLoading(false);
        return;
      }

      if (res?.ok) {
        // Query profile to verify admin role
        const profileRes = await fetch("/api/profile");
        const profileData = await profileRes.json().catch(() => ({}));

        const isAuthorized =
          AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail) ||
          profileData?.profile?.role === "admin";

        if (!isAuthorized) {
          await signOut({ redirect: false });
          setErrorMessage(
            "Accès Refusé : Ce compte candidat n'a pas les droits d'administration de la plateforme."
          );
          setIsLoading(false);
          return;
        }

        router.push("/admin");
        router.refresh();
      } else {
        setErrorMessage("Erreur d'authentification sur le serveur de contrôle.");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Erreur de connexion avec le service de sécurité.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-sm">
            K
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-200">
            Khadamni <span className="text-red-500 font-extrabold">Control Hub</span>
          </span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour au site public</span>
        </Link>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6 relative overflow-hidden backdrop-blur-md">
          {/* Subtle Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Icon & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/60">
              <ShieldAlert className="w-3 h-3" />
              <span>Zone d&apos;Accès Restreint</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Espace Administrateur
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Portail dédié à la gestion des 10 scrapers, du catalogue d&apos;offres et des paramètres système.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/60 text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Identifiant Administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@khadamni.tn"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Clé de Sécurité / Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-red-600 hover:from-amber-500 hover:to-red-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-101 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Vérification des privilèges...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span>Accéder à la Console Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              Vous êtes chercheur d&apos;emploi ou étudiant ?{" "}
              <Link
                href="/login"
                className="text-amber-400 font-bold hover:underline"
              >
                Espace Candidat
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Security footer */}
      <footer className="p-4 text-center text-[11px] text-slate-600 border-t border-slate-800/60">
        <span>Khadamni Security Gateway • Surveillance et journalisation des accès actifs</span>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
          Initialisation de la console sécurisée...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

