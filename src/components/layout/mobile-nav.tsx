"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { X, Phone, MapPin, Clock } from "lucide-react";
import { Wordmark } from "@/components/wordmark";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/menu", label: "Meniu" },
  { href: "/gallery", label: "Galerie" },
  { href: "/about", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

interface MobileNavProps {
  onClose: () => void;
}

export default function MobileNav({ onClose }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] md:hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-full max-w-xs bg-black border-l-3 border-white/20 p-6 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-12">
          <Wordmark variant="light" className="text-xl" />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 border-3 border-white/30 text-white/70 hover:text-white"
            aria-label="Închide"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`block py-3 font-display text-4xl uppercase tracking-wide leading-none ${
                  isActive ? "text-rosso" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t-3 border-white/10 space-y-3">
          <a href="tel:+37362000612" className="block text-white/60 text-sm font-bold uppercase tracking-widest hover:text-white">
            +373 62 000 612
          </a>
          <p className="text-white/40 text-xs uppercase tracking-wider">
            Calea Orheiului 21, Porumbeni
          </p>
          <p className="text-white/60 text-xs uppercase tracking-wider font-bold">
            09:00 — 21:00, în fiecare zi
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
