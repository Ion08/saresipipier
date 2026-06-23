"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Apple, ChefHat, Sparkles, PartyPopper } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const features = [
  {
    icon: Apple,
    title: "Ingrediente Proaspete",
    description: "Lucrăm cu furnizori locali. Făina, roșiile, verdețurile — totul vine proaspăt, de la producători din apropiere.",
  },
  {
    icon: ChefHat,
    title: "Bucătari cu Experiență",
    description: "Oameni care fac pizza de ani buni. Știu cât să dospească aluatul și la ce temperatură se coace fiecare rețetă.",
  },
  {
    icon: Sparkles,
    title: "Ambient Primitor",
    description: "Fără fițe. Muzică bună, lumini calde, loc să stea toată lumea la masă.",
  },
  {
    icon: PartyPopper,
    title: "Evenimente",
    description: "Organizăm mese pentru grupuri, petreceri și cine cu prietenii. Încap până la 40 de persoane.",
  },
];

const stats = [
  { value: "10+", label: "Ani" },
  { value: "50+", label: "Rețete" },
  { value: "1000+", label: "Clienți" },
  { value: "4.9", label: "Rating" },
];

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="block font-display text-4xl md:text-5xl font-bold text-accent mb-1"
      >
        {value}
      </motion.span>
      <span className="text-sm text-text-light font-medium">{label}</span>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <AnimatedSection variant="slide-up" className="mb-12 max-w-2xl">
          <p className="mb-3 font-display text-sm font-medium uppercase tracking-widest text-accent">
            De Ce Noi
          </p>
          <h2 className="font-display text-3xl font-semibold text-text md:text-4xl lg:text-5xl">
            De Ce Să Alegeți Sare și Piper
          </h2>
          <p className="mt-4 text-text-light text-lg leading-relaxed">
            O experiență culinară completă, unde fiecare detaliu contează.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection
                key={feature.title}
                variant="slide-up"
                delay={index * 0.1}
                className="group"
              >
                <div className="border-3 border-black bg-white p-6 h-full">
                  <div className="w-12 h-12 border-3 border-black/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <div className="border-3 border-black bg-black p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <Counter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
