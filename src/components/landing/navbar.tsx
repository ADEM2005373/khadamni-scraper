"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Briefcase, Menu, X, ArrowRight, Shield } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const userEmail = session?.user?.email?.toLowerCase().trim() || "";
  const isAdmin =
    (session?.user as any)?.role === "admin" ||
    ["ouerhaiadem0805@gmail.com", "ouerhaniadem0805@gmail.com"].includes(userEmail);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo + Nav Links */}
        <div className="flex items-center gap-6 xl:gap-10">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-base shadow-sm shadow-red-500/20 group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
                Khadamni <span className="text-red-600">Scraper</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                Tunisia AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-medium text-slate-600">
            <Link
              href="#features"
              className="hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#live-preview"
              className="hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Portails Tunisiens
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Comment ça marche
            </Link>
            <Link
              href="#pricing"
              className="hover:text-red-600 transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
            >
              <span>Tarifs</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md leading-none">
                15 DT
              </span>
            </Link>
            <Link
              href="/jobs"
              className="hover:text-red-600 transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
            >
              <span>Explorer</span>
              <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase bg-red-50 text-red-700 border border-red-200/60 rounded-md leading-none">
                Live
              </span>
            </Link>
          </nav>
        </div>

        {/* Right Side: Action CTAs */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className="text-xs xl:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors whitespace-nowrap"
          >
            Se Connecter
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs xl:text-sm font-bold shadow-sm shadow-red-600/20 transition-all hover:scale-102 whitespace-nowrap"
          >
            <span>Créer un Compte</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile / Tablet Hamburger Toggle */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-5 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#live-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600 transition-colors"
            >
              10 Portails Tunisiens en Direct
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600 transition-colors"
            >
              Comment ça marche
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600 transition-colors flex items-center justify-between"
            >
              <span>Tarifs & Abonnements</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Dès 15 DT/mois
              </span>
            </Link>
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600 font-semibold text-red-600 flex items-center justify-between"
            >
              <span>Explorer les Offres</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-red-700 rounded-full">
                LIVE
              </span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Se Connecter
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm transition-all"
            >
              Créer un Compte Gratuit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
