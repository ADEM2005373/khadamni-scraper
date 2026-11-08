"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
              Khadamni <span className="text-red-600 font-black">Scraper</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Tunisian Job AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-red-600 transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#live-preview" className="hover:text-red-600 transition-colors">
            10 Portails Tunisiens (Direct)
          </Link>
          <Link href="#how-it-works" className="hover:text-red-600 transition-colors">
            Comment ça marche
          </Link>
          <Link href="/jobs" className="hover:text-red-600 transition-colors flex items-center gap-1">
            <span>Explorer les Offres</span>
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">
              LIVE
            </span>
          </Link>
        </nav>

        {/* Desktop Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            Se Connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-sm shadow-red-600/20 transition-all hover:shadow"
          >
            <span>Créer un Compte</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#live-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600"
            >
              Offres en Direct
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600"
            >
              Comment ça marche
            </Link>
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600 font-semibold text-red-600 flex items-center justify-between"
            >
              <span>Explorer les Offres</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">
                LIVE
              </span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-red-600"
            >
              Tableau de bord
            </Link>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Se Connecter
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm"
            >
              Créer un Compte
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
