"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 border-3 border-rosso text-rosso mb-6">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-black mb-3 uppercase">Ceva nu a funcționat</h1>
        <p className="text-black/60 text-sm font-bold uppercase tracking-wider mb-2">A apărut o eroare neașteptată.</p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-sm text-rosso mb-6 font-mono bg-black/5 border-2 border-black p-3 break-all">{error.message}</p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rosso text-white border-3 border-rosso font-bold uppercase tracking-wider text-sm hover:bg-black hover:border-black">
            <RefreshCw className="h-4 w-4" /> Încearcă din nou
          </button>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-3 border-black text-black font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white">
            <Home className="h-4 w-4" /> Acasă
          </Link>
        </div>
      </div>
    </div>
  );
}
