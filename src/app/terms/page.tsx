"use client";

import Link from "next/link";
import PageLayout from "@/components/layout/page-layout";
import { Section } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";

const sections = [
  {
    title: "Acceptarea termenilor",
    content:
      "Prin accesarea și utilizarea site-ului Sare și Piper, confirmați că ați citit, înțeles și sunteți de acord cu acești termeni și condiții. Dacă nu sunteți de acord, vă rugăm să nu utilizați site-ul.",
  },
  {
    title: "Rezervări",
    content:
      "Rezervările sunt confirmate în baza disponibilității. Anulările trebuie făcute cu cel puțin 24 de ore înainte pentru a evita taxele de anulare. Pentru grupuri mari, se aplică termeni speciali care vor fi comunicați la momentul rezervării.",
  },
  {
    title: "Program de funcționare",
    content:
      "Restaurantul este deschis zilnic între orele 09:00 și 21:00. Ne rezervăm dreptul de a modifica programul în zilele de sărbătoare sau pentru evenimente private.",
  },
  {
    title: "Politica de prețuri",
    content:
      "Prețurile afișate pe site sunt în MDL și includ TVA. Ne rezervăm dreptul de a modifica prețurile fără notificare prealabilă. Ofertele speciale și promoțiile sunt valabile în limita stocului disponibil.",
  },
  {
    title: "Proprietate intelectuală",
    content:
      "Conținutul site-ului, inclusiv textul, imaginile, logo-urile și elementele grafice, sunt proprietatea Sare și Piper și sunt protejate de legile privind drepturile de autor. Reproducerea fără acordul nostru scris este interzisă.",
  },
  {
    title: "Limitarea răspunderii",
    content:
      "Sare și Piper nu este responsabil pentru daunele directe sau indirecte rezultate din utilizarea site-ului. Ne străduim să menținem informațiile actualizate, dar nu garantăm acuratețea completă a acestora.",
  },
  {
    title: "Contact",
    content:
      "Pentru întrebări legate de termeni și condiții, ne puteți contacta la adresa de e-mail info@saresipiper.com sau la numărul de telefon +373 62 000 612.",
  },
];

export default function TermsPage() {
  return (
    <PageLayout>
      <Section className="pt-32 md:pt-40">
        <div className="mb-4">
          <Link href="/" className="text-sm text-accent hover:underline">
            Acasă
          </Link>
          <span className="mx-2 text-text-light">/</span>
          <span className="text-sm text-text-light">Termeni și Condiții</span>
        </div>
        <h1 className="font-display text-4xl font-semibold text-text md:text-5xl lg:text-6xl">
          Termeni și Condiții
        </h1>
        <p className="mt-4 text-text-light">
          Ultima actualizare: 1 ianuarie 2026
        </p>
      </Section>

      {sections.map((section, index) => (
        <AnimatedSection key={index} delay={index * 0.1}>
          <Section className="py-8 md:py-10">
            <h2 className="font-display text-2xl font-semibold text-text mb-4">
              {section.title}
            </h2>
            <p className="text-text-light leading-relaxed max-w-3xl">
              {section.content}
            </p>
          </Section>
        </AnimatedSection>
      ))}

      <Section className="py-12">
        <p className="text-sm text-text-light">
          Consultați și{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Politica de Confidențialitate
          </Link>{" "}
          noastră.
        </p>
      </Section>
    </PageLayout>
  );
}
