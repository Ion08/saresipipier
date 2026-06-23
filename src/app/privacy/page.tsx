"use client";

import Link from "next/link";
import PageLayout from "@/components/layout/page-layout";
import { Section } from "@/components/ui/section";
import { AnimatedSection } from "@/components/ui/animated-section";

const sections = [
  {
    title: "Ce informații colectăm",
    content:
      "Colectăm informații pe care ni le furnizați direct, cum ar fi numele, adresa de e-mail, numărul de telefon și detaliile rezervării atunci când faceți o rezervare, ne contactați sau vă abonați la newsletter. De asemenea, colectăm automat anumite informații despre vizita dvs., inclusiv adresa IP, tipul de browser, paginile vizitate și durata vizitei.",
  },
  {
    title: "Cum folosim informațiile",
    content:
      "Folosim informațiile colectate pentru a procesa rezervările, a îmbunătăți serviciile noastre, a vă trimite actualizări despre evenimente și oferte speciale (cu consimțământul dvs.), a personaliza experiența dvs. și a asigura securitatea site-ului nostru.",
  },
  {
    title: "Protecția datelor",
    content:
      "Implementăm măsuri de securitate tehnice și organizatorice pentru a proteja datele dvs. personale împotriva accesului neautorizat, pierderii sau divulgării. Utilizăm criptare SSL, firewall-uri și protocoale stricte de acces la date.",
  },
  {
    title: "Cookie-uri",
    content:
      "Site-ul nostru utilizează cookie-uri pentru a îmbunătăți experiența de navigare. Cookie-urile esențiale sunt necesare pentru funcționarea site-ului, iar cookie-urile opționale ne ajută să analizăm traficul și să personalizăm conținutul. Puteți gestiona preferințele cookie-urilor din setările browserului dvs.",
  },
  {
    title: "Servicii terțe",
    content:
      "Putem partaja date cu parteneri de încredere care ne ajută să operăm site-ul și să procesăm plățile (de exemplu, procesatori de plăți, platforme de rezervări). Acești parteneri sunt obligați contractual să păstreze confidențialitatea datelor dvs.",
  },
  {
    title: "Drepturile dvs.",
    content:
      "Aveți dreptul de a accesa, rectifica, șterge sau restricționa prelucrarea datelor dvs. personale. De asemenea, aveți dreptul la portabilitatea datelor și de a vă retrage consimțământul în orice moment. Pentru a exercita aceste drepturi, vă rugăm să ne contactați.",
  },
  {
    title: "Contact",
    content:
      "Pentru întrebări legate de politica noastră de confidențialitate, ne puteți contacta la adresa de e-mail info@saresipiper.com sau la numărul de telefon +373 62 000 612.",
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout>
      <Section className="pt-32 md:pt-40">
        <div className="mb-4">
          <Link href="/" className="text-sm text-accent hover:underline">
            Acasă
          </Link>
          <span className="mx-2 text-text-light">/</span>
          <span className="text-sm text-text-light">Politica de Confidențialitate</span>
        </div>
        <h1 className="font-display text-4xl font-semibold text-text md:text-5xl lg:text-6xl">
          Politica de Confidențialitate
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
          Pentru mai multe informații, consultați{" "}
          <Link href="/terms" className="text-accent hover:underline">
            Termenii și Condițiile
          </Link>{" "}
          noastre.
        </p>
      </Section>
    </PageLayout>
  );
}
