"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { useCart } from "@/lib/cart-context";
import MobileNav from "./mobile-nav";

const navLinks = [
  { href: "/", label: "Acasă" },
  { href: "/menu", label: "Meniu" },
  { href: "/gallery", label: "Galerie" },
  { href: "/about", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setCartOpen } = useCart();
  const isMenuPage = pathname === "/menu";

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const hiddenRef = { current: false };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        let nextHidden = false;
        if (isMenuPage && currentScrollY > 80) {
          nextHidden = currentScrollY > lastScrollY;
        }
        if (nextHidden !== hiddenRef.current) {
          hiddenRef.current = nextHidden;
          setHidden(nextHidden);
        }
        lastScrollY = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuPage]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white transition-transform duration-200",
          isMenuPage ? "border-b-0" : "border-b-3 border-black",
          hidden && "-translate-y-full"
        )}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 md:h-20 px-4 md:px-6">
          <Link href="/" className="flex items-baseline">
            <Wordmark variant="dark" className="text-xl md:text-2xl" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    isActive ? "text-rosso" : "text-black hover:text-rosso"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 border-3 border-black text-black hover:bg-black hover:text-white"
              aria-label="Coș"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rosso text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 border-3 border-black"
              aria-label="Coș"
            >
              <ShoppingBag size={20} className="text-black" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rosso text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center w-10 h-10 border-3 border-black"
              aria-label="Deschide meniul"
            >
              <Menu size={22} className="text-black" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
