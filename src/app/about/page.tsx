import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import PageLayout from "@/components/layout/page-layout";

export const metadata: Metadata = {
  title: "Despre",
  description: "Sare și Piper — o pizzerie mică la ieșire din Porumbeni. Aluat de cu seară, cuptor fierbinte, oameni curați.",
};

export default function AboutPage() {
  return (
    <PageLayout>
      <section className="bg-black text-white pt-28 md:pt-32 pb-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <p className="text-rosso text-xs font-bold uppercase tracking-widest mb-3">Despre</p>
          <h1 className="text-6xl md:text-8xl text-white">Pizzeria noastră</h1>
          <p className="text-white/60 text-sm font-bold uppercase tracking-wider mt-4">Mică, dar a noastră</p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
            <div className="md:col-span-7">
              <h2 className="text-4xl md:text-6xl text-black mb-4">Cum a început</h2>
              <p className="text-black/60 leading-relaxed text-base md:text-lg">
                Am început cu un cuptor și o masă. Pe Calea Orheiului, la ieșire,
                unde te oprești să mănânci ceva bun înainte să mergi mai departe.
                Nu suntem fancy. Facem pizza cum ne place nouă — aluat de cu seară,
                sos de roșii, mozzarella care se întinde. Atât.
              </p>
              <p className="font-bold text-sm uppercase tracking-wider text-rosso mt-4">Și a mers.</p>
            </div>
            <div className="md:col-span-5 border-3 border-black overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80"
                alt="Sare și Piper" width={500} height={500} className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="border-3 border-black bg-white p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl md:text-2xl text-black uppercase">Vino pe la noi</h3>
              <p className="text-black/60 text-sm mt-1 font-bold uppercase tracking-wider">Calea Orheiului 21, Porumbeni · 09—21, în fiecare zi</p>
            </div>
            <a href="tel:+37362000612"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-3 border-rosso bg-rosso text-white font-bold uppercase tracking-wider text-sm shrink-0 hover:bg-black hover:border-black">
              <Phone size={16} /> +373 62 000 612
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
