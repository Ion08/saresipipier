"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wordmark } from "@/components/wordmark";
import { getFoodImage } from "@/lib/food-images";
import type { Product } from "@/lib/types";

interface HeroProps {
  products?: Product[];
}

export default function Hero({ products = [] }: HeroProps) {
  const heroImage = products[0]
    ? getFoodImage(products[0].name, "")
    : "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop";

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
          >
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto border-3 border-black overflow-hidden">
                <Image
                  src={heroImage}
                  alt="Preparat Sare și Piper"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
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
