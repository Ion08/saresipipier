"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ImageUp, Play } from "lucide-react";
import { cn, isYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import LightboxClient from "./lightbox-client";
import type { GalleryItem } from "@/lib/types";

const filterTabs = [
  { value: "all", label: "Toate" },
  { value: "Pizza", label: "Pizza" },
  { value: "Interior", label: "Interior" },
  { value: "Food", label: "Preparate" },
  { value: "Desert", label: "Desert" },
  { value: "video", label: "Video" },
] as const;

interface GalleryClientProps {
  items: GalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    if (activeFilter === "video") return items.filter((item) => isYouTubeUrl(item.image));
    return items.filter((item) => item.category === activeFilter);
  }, [items, activeFilter]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredItems.length : null
    );
  }, [filteredItems.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredItems.length) % filteredItems.length
        : null
    );
  }, [filteredItems.length]);

  return (
    <>
      <section className="bg-piper text-sare pt-28 md:pt-32 pb-14">
        <div className="container-custom px-4 md:px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            className="text-rosso text-xs font-bold uppercase tracking-widest mb-3"
          >
            Imagini din restaurant
          </motion.p>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="text-6xl md:text-8xl text-sare"
          >
            Galeria Noastră
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            className="text-sare/60 text-sm font-bold uppercase tracking-wider mt-4"
          >
            Vezi atmosfera și preparatele noastre
          </motion.p>
        </div>
      </section>

      <section className="bg-sare py-14 md:py-20">
        <div className="container-custom px-4 md:px-6">

          <div className="flex flex-wrap items-center gap-2 mb-10">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-[2px]",
                  activeFilter === tab.value
                    ? "bg-rosso text-sare border-rosso"
                    : "border-piper text-piper/60 hover:text-piper hover:bg-piper/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <ImageUp size={48} className="mx-auto text-black/20 mb-4" />
              <p className="text-black/60 text-sm font-bold uppercase tracking-wider">Nu am găsit nimic în această categorie.</p>
            </div>
          ) : (
            <div className="grid-masonry">
              {filteredItems.map((item, index) => (
                <AnimatedSection key={item.$id} variant="slide-up" delay={Math.min(index * 0.03, 0.3)}>
                  {isYouTubeUrl(item.image) ? (
                    <VideoCard item={item} />
                  ) : (
                    <button
                      onClick={() => openLightbox(index)}
                      className="group relative w-full cursor-pointer text-left border-3 border-piper overflow-hidden"
                    >
                      <ImageWithFallback
                        src={item.image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80"}
                        alt={item.title || "Galerie Sare și Piper"}
                        width={600}
                        height={Math.floor(300 + Math.random() * 300)}
                        className="w-full"
                        containerClassName=""
                      />
                      {(item.title || item.description) && (
                        <div className="absolute inset-0 bg-piper/60 opacity-0 group-hover:opacity-100 flex items-end p-4">
                          <div className="text-left">
                            {item.title && <h3 className="text-sare font-display text-base uppercase">{item.title}</h3>}
                            {item.description && <p className="text-sare/70 text-sm mt-1 line-clamp-2">{item.description}</p>}
                          </div>
                        </div>
                      )}
                    </button>
                  )}
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <LightboxClient
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </>
  );
}

function VideoCard({ item }: { item: GalleryItem }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(item.image);
  const thumb = getYouTubeThumbnail(item.image);

  if (!embedUrl) {
    return <div className="border-3 border-black p-4 text-center text-black/60 text-sm">URL video invalid</div>;
  }

  if (playing) {
    return (
      <div className="relative w-full border-3 border-black bg-black" style={{ aspectRatio: "16/9" }}>
        <iframe src={embedUrl} title={item.title || "Video Sare și Piper"}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  return (
    <button onClick={() => setPlaying(true)}
      className="group relative w-full cursor-pointer text-left border-3 border-black bg-black"
      style={{ aspectRatio: "16/9" }}>
      {thumb && <img src={thumb} alt={item.title || "Video Sare și Piper"} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50">
        <div className="w-16 h-16 border-3 border-white bg-black/50 flex items-center justify-center">
          <Play size={28} className="text-white ml-1" />
        </div>
      </div>
      {(item.title || item.description) && (
        <div className="absolute bottom-0 inset-x-0 bg-black/80 p-4">
          {item.title && <h3 className="text-white font-display text-sm uppercase">{item.title}</h3>}
          {item.description && <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{item.description}</p>}
        </div>
      )}
    </button>
  );
}
