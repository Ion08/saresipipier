"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-[12rem] md:text-[16rem] leading-none text-black/10 select-none">404</h1>
        <h2 className="font-display text-2xl md:text-3xl text-black -mt-8 mb-3 uppercase">Nu am găsit pagina</h2>
        <p className="text-black/60 mb-8 max-w-md mx-auto text-sm font-bold uppercase tracking-wider">
          Poate ai greșit drumul. Pe Calea Orheiului la ieșire ne găsești sigur.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rosso text-white border-3 border-rosso font-bold uppercase tracking-wider text-sm hover:bg-black hover:border-black">
            <Home className="h-4 w-4" /> Acasă
          </Link>
          <button onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-3 border-black text-black font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Înapoi
          </button>
        </div>
      </div>
    </div>
  );
}
