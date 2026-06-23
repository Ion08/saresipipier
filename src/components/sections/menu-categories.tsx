"use client";

import Link from "next/link";
import { Pizza, Soup, Salad, ChefHat, Cake, UtensilsCrossed } from "lucide-react";
import type { Category } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  "Pizza": Pizza,
  "Supe & Salate": Soup,
  "Gustări": ChefHat,
  "Desert": Cake,
  "Burgeri & Wrap": UtensilsCrossed,
};

interface MenuCategoriesProps {
  categories: Category[];
}

export default function MenuCategories({ categories }: MenuCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-sare-muted py-14 md:py-20">
      <div className="container-custom px-4 md:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="text-4xl md:text-6xl text-black">Ce avem în cuptor</h2>
          <p className="text-rosso text-sm mt-2 font-bold uppercase tracking-wider">
            Alege și vino
          </p>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
          {categories.map((cat) => {
            const Icon = iconMap[cat.name] || UtensilsCrossed;
            return (
              <Link
                key={cat.$id}
                href={`/menu#cat-${cat.slug}`}
                className="w-28 h-28 md:w-36 md:h-36 group shrink-0 border-3 border-black flex flex-col items-center justify-center bg-white hover:bg-black"
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-rosso mb-1.5 group-hover:text-white" />
                <span className="text-center text-[11px] md:text-xs font-bold text-black uppercase tracking-wider leading-tight px-2 group-hover:text-white">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <Link href="/menu" className="inline-flex items-center justify-center gap-2 px-7 py-3 border-3 border-black text-black font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white">
            Tot meniul
          </Link>
        </div>
      </div>
    </section>
  );
}
