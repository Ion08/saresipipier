"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { getOptimizedImageUrl } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

interface GalleryPreviewProps {
  images?: GalleryItem[];
}

export default function GalleryPreview({ images = [] }: GalleryPreviewProps) {
  const displayImages = images.slice(0, 5);

  if (displayImages.length === 0) return null;

  const [first, ...rest] = displayImages;

  return (
    <section className="py-16 md:py-24 bg-background-warm">
      <div className="container">
        <AnimatedSection variant="slide-up" className="mb-12 max-w-2xl">
          <p className="mb-3 font-display text-sm font-medium uppercase tracking-widest text-accent">
            Imagini
          </p>
          <h2 className="font-display text-3xl font-semibold text-text md:text-4xl lg:text-5xl">
            Galerie
          </h2>
          <p className="mt-4 text-text-light text-lg leading-relaxed">
            Descoperiți atmosfera și preparatele noastre prin imagini.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {first && (
            <AnimatedSection variant="slide-up" className="md:col-span-2 md:row-span-2">
              <div className="relative h-64 md:h-full min-h-[16rem]  overflow-hidden">
                <ImageWithFallback
                  src={getOptimizedImageUrl(first.image, 800)}
                  alt={first.title || "Galerie"}
                  fill
                  imageZoom
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          )}

          {rest.map((item, index) => (
            <AnimatedSection
              key={item.$id}
              variant="slide-up"
              delay={0.1 * (index + 1)}
            >
              <div className="relative h-48 md:h-44  overflow-hidden">
                <ImageWithFallback
                  src={getOptimizedImageUrl(item.image, 600)}
                  alt={item.title || "Galerie"}
                  fill
                  imageZoom
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection variant="fade" delay={0.5} className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 font-medium text-accent hover:text-accent-light transition-colors group"
          >
            Vezi toată galeria
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
