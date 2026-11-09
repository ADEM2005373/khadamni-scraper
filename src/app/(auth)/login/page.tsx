"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Briefcase, Lock, Mail, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ouerhaiadem0805@gmail.com");
  const [password, setPassword] = useState("ademadem080808");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error || "Email ou mot de passe invalide.");
        setIsLoading(false);
      } else if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMessage("Une erreur inattendue est survenue.");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Erreur de connexion au serveur.");
      setIsLoading(false);
    }
  };

  const handleFillTestCredentials = () => {
    setEmail("ouerhaiadem0805@gmail.com");
    setPassword("ademadem080808");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 selection:bg-red-500/20 selection:text-red-700">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600 mb-2">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Connexion Khadamni
          </h1>
          <p className="text-xs text-slate-500">
            Accédez à votre intelligence de recherche d&apos;emploi et votre profil candidat ATS
          </p>
        </div>

        {/* Quick test credentials helper badge */}
        <div
          onClick={handleFillTestCredentials}
          className="p-3 rounded-xl bg-red-50/70 border border-red-200/70 text-xs text-red-900 cursor-pointer hover:bg-red-100/70 transition-all flex items-start gap-2.5"
          title="Cliquez pour insérer automatiquement ces identifiants"
        >
          <Sparkles className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-[11px] uppercase tracking-wider text-red-700">
              Compte Administrateur & Propriétaire (1-Clic)
            </p>
            <p className="text-[11px] text-slate-700">
              <span className="font-semibold text-slate-900">Email :</span> ouerhaiadem0805@gmail.com
            </p>
            <p className="text-[11px] text-slate-700">
              <span className="font-semibold text-slate-900">Mot de passe :</span> ademadem080808
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.tn"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-red-600 font-bold hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
