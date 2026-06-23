"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

const instagramPhotos = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  alt: `Instagram photo ${i + 1}`,
}));

export default function InstagramSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <AnimatedSection variant="slide-up" className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-accent" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-text md:text-4xl lg:text-5xl">
            Urmărește-ne pe Instagram
          </h2>
          <p className="mt-3 text-text-light">
            <Link
              href="https://instagram.com/sare_si__piper"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:text-accent-light transition-colors"
            >
              @sare_si__piper
            </Link>
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mb-10">
          {instagramPhotos.map((photo) => (
            <AnimatedSection key={photo.id} variant="slide-up" delay={photo.id * 0.05}>
              <a
                href="https://instagram.com/sare_si__piper"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-square  overflow-hidden group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-105"
                  style={{ backgroundImage: `url(${photo.src})` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection variant="fade" delay={0.4} className="text-center">
          <a
            href="https://instagram.com/sare_si__piper"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg" iconLeft={<Camera className="w-5 h-5" />}>
              Urmărește-ne pe Instagram
            </Button>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
