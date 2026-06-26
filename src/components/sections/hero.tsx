"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wordmark } from "@/components/wordmark";
import { getOptimizedImageUrl } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

function resolveImageUrl(image: string): string {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return getOptimizedImageUrl(image, 800);
}

interface HeroProps {
  gallery?: GalleryItem[];
}

export default function Hero({ gallery = [] }: HeroProps) {
  const images = gallery
    .filter((item) => item.image)
    .map((item) => resolveImageUrl(item.image));

  if (images.length === 0) {
    images.push(
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop"
    );
  }

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const dragStartRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (images.length <= 1 || isPaused || isDragging) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, images.length, isPaused, isDragging]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const SWIPE_THRESHOLD = 50;

  const handleDragStart = (clientX: number) => {
    dragStartRef.current = clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - dragStartRef.current);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > SWIPE_THRESHOLD) {
      prev();
    } else if (dragOffset < -SWIPE_THRESHOLD) {
      next();
    }
    setDragOffset(0);
  };

  const translateX = -current * containerWidth + dragOffset;

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
            className="lg:col-span-5 relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              handleDragEnd();
            }}
          >
            <div className="relative">
              <div
                ref={containerRef}
                className="aspect-square max-w-md mx-auto border-3 border-black overflow-hidden relative"
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
              >
                <div
                  className="flex"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isDragging ? "none" : "transform 0.4s ease",
                    width: `${images.length * 100}%`,
                  }}
                >
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0"
                      style={{ width: `${100 / images.length}%` }}
                    >
                      <Image
                        src={src}
                        alt={`Galerie Sare și Piper ${i + 1}`}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                        priority={i === 0}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-2 -left-2 border-3 border-black bg-white w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center pointer-events-none">
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
