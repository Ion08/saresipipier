"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { Testimonial } from "@/lib/types";

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-rosso fill-rosso" : "text-bordo"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-20 overflow-hidden">
      <div className="container-custom px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl text-carbone">Ce spun clienții</h2>
          <p className="text-rosso text-sm mt-2 font-bold uppercase tracking-wider">
            Părerea clienților
          </p>
        </div>
      </div>

      <div
        ref={ref}
        className="relative"
      >
        <motion.div
          ref={scrollRef}
          initial={{ x: "0%" }}
          animate={isInView ? { x: [`0%`, `-${Math.min(testimonials.length * 33, 100)}%`] } : {}}
          transition={{
            x: {
              duration: 30 + testimonials.length * 3,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            },
          }}
          className="flex gap-6 px-4 md:px-8 w-max"
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.$id}-${index}`}
              className="w-80 md:w-96 shrink-0"
            >
              <div className="border-3 border-black bg-white p-6 h-full">
                <StarRating rating={testimonial.rating} />
                <p className="mt-4 text-sm text-cenere leading-relaxed line-clamp-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-bordo flex items-center gap-3">
                  <div className="relative w-10 h-10 overflow-hidden shrink-0 border-3 border-black">
                    <ImageWithFallback
                      src={testimonial.avatar || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&q=80"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      imageZoom
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm text-carbone uppercase truncate">
                      {testimonial.name}
                    </p>
                    {testimonial.role && (
                      <p className="text-xs text-cenere truncate">
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
