"use client";

import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";

export default function MapSection() {
  return (
    <section id="location" className="bg-white py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-6xl text-black">Unde ne găsești</h2>
            <p className="text-black/60 text-sm font-bold uppercase tracking-wider mt-2">
              La ieșire, pe dreapta
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-rosso mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-black">Adresa</p>
                  <p className="text-black/60 text-sm mt-1 leading-relaxed">
                    Calea Orheiului 21, Porumbeni<br />
                    Chișinău, Republica Moldova
                  </p>
                  <Link
                    href="https://www.google.com/maps/place/Sare+%C8%99i+Piper/@47.1495627,28.8321474,193m/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rosso text-xs font-bold uppercase tracking-wider mt-2 inline-block hover:text-black"
                  >
                    Google Maps &rarr;
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-rosso mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-black">Program</p>
                  <p className="text-black/60 text-sm">Luni — Duminică</p>
                  <p className="font-display text-3xl text-black mt-1">09—21</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-rosso mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-black">Telefon</p>
                  <a href="tel:+37362000612" className="text-black font-bold text-sm hover:text-rosso mt-1 block">
                    +373 62 000 612
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="tel:+37362000612"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-3 border-rosso bg-rosso text-white font-bold uppercase tracking-wider text-sm hover:bg-black hover:border-black"
              >
                Sună acum
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 border-3 border-black overflow-hidden h-[320px] md:h-[440px]">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.829%2C47.148%2C28.836%2C47.151&layer=mapnik&marker=47.1495627%2C28.8327016"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sare și Piper — locația"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
