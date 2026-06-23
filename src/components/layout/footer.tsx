"use client";

import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t-3 border-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Wordmark variant="light" className="text-2xl" />
            <p className="font-bold text-xs uppercase tracking-wider text-white/60 mt-3">
              Pizza la ieșire
            </p>
            <p className="text-white/50 text-xs mt-4 max-w-xs leading-relaxed uppercase tracking-wider">
              Calea Orheiului 21, la ieșire din Porumbeni.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com/sare_si__piper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white border-3 border-white/20 px-3 py-1.5"
              >
                Instagram
              </a>
              <a
                href="tel:+37362000612"
                className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white border-3 border-white/20 px-3 py-1.5"
              >
                Telefon
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg uppercase text-white mb-4">Unde</h4>
            <div className="space-y-2">
              <p className="text-sm text-white/80 font-bold uppercase tracking-wider">Calea Orheiului 21</p>
              <p className="text-sm text-white/50 uppercase tracking-wider">Porumbeni, Chișinău</p>
              <p className="text-sm text-white/50 uppercase tracking-wider">Republica Moldova</p>
            </div>
            <a href="tel:+37362000612" className="inline-block mt-3 text-rosso text-xs font-bold uppercase tracking-widest hover:text-white">
              +373 62 000 612
            </a>
          </div>

          <div>
            <h4 className="font-display text-lg uppercase text-white mb-4">Program</h4>
            <p className="text-sm text-white/80 font-bold uppercase tracking-wider">Luni — Duminică</p>
            <p className="font-display text-xl text-white mt-1">09—21</p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/menu" className="text-rosso text-xs font-bold uppercase tracking-widest hover:text-white">Meniu</Link>
              <Link href="/contact" className="text-rosso text-xs font-bold uppercase tracking-widest hover:text-white">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-3 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p className="font-bold uppercase tracking-wider">&copy; {year} Sare și Piper</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-bold uppercase tracking-wider hover:text-white">Confidențialitate</Link>
            <Link href="/terms" className="font-bold uppercase tracking-wider hover:text-white">Termeni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
