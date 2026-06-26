"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { getOptimizedImageUrl } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

interface HeroProps {
  gallery?: GalleryItem[];
}

export default function Hero({ gallery = [] }: HeroProps) {
  const images = gallery
    .filter((item) => item.image)
    .map((item) => getOptimizedImageUrl(item.image, 800));

  if (images.length === 0) {
    images.push(
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop"
    );
  }

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, images.length, isPaused]);

  return (
    <section className="bg-white pt-28 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85]"
            >
              <Wordmark variant="dark" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="text-black/60 text-base md:text-lg mt-10 lg:mt-16 max-w-md leading-relaxed font-bold uppercase tracking-wider"
            >
              Gusturi care te cheamă înapoi
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="flex flex-wrap gap-4 mt-10 lg:mt-14"
            >
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rosso text-white border-3 border-rosso font-bold uppercase tracking-wider text-base hover:bg-black hover:border-black"
              >
                Vezi meniul
              </Link>
              <a
                href="tel:+37362000612"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-3 border-black text-black font-bold uppercase tracking-wider text-base hover:bg-black hover:text-white"
              >
                Sună
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto border-3 border-black overflow-hidden relative">
                {images.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`Galerie Sare și Piper ${i + 1}`}
                    width={600}
                    height={600}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
                    priority={i === 0}
                  />
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 border-3 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 border-3 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white"
                    aria-label="Următor"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 border border-black ${i === current ? "bg-black" : "bg-white"}`}
                        aria-label={`Mergi la imaginea ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute -bottom-2 -left-2 border-3 border-black bg-white w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center">
                <span className="font-display text-2xl md:text-3xl text-black leading-none">09—21</span>
                <span className="font-bold text-[10px] text-black/60 uppercase tracking-wider mt-1">zilnic</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
