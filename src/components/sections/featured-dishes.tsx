"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { formatPrice } from "@/lib/utils";
import { getFoodImage } from "@/lib/food-images";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

interface FeaturedDishesProps {
  products?: Product[];
}

export default function FeaturedDishes({ products = [] }: FeaturedDishesProps) {
  const items = products.slice(0, 6);
  const { addItem, setCartOpen } = useCart();

  const getImage = (p: Product) => {
    if (p.image && p.image.trim()) return getOptimizedImageUrl(p.image, 400);
    return getFoodImage(p.name, p.category || p.ingredients || "");
  };

  const handleAdd = (p: Product) => {
    addItem({ id: p.$id, name: p.name, price: p.price, weight: p.weight || "", image: getImage(p) }, 1);
    setCartOpen(true);
  };

  if (items.length === 0) return null;

  return (
    <section className="bg-sare py-14 md:py-20">
      <div className="container-custom px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-4xl md:text-6xl text-piper">Recomandări</h2>
          <p className="text-piper-muted text-sm mt-2 font-bold uppercase tracking-wider max-w-md">
            Recomandările noastre
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((p) => (
            <div key={p.$id} className="border-3 border-piper bg-sare">
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback src={getImage(p)} alt={p.name} width={400} height={300} className="w-full h-full object-cover" containerClassName="w-full h-full" />
              </div>
              <div className="p-3 md:p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-sm md:text-base text-piper uppercase tracking-wide leading-tight">{p.name}</h3>
                  <span className="font-display text-base md:text-lg text-rosso shrink-0">{formatPrice(p.price)}</span>
                </div>
                {p.weight && <p className="text-verde text-[10px] uppercase tracking-wide font-bold mb-3">{p.weight}</p>}
                <button
                  onClick={() => handleAdd(p)}
                  className="w-full flex items-center justify-center gap-2 border-3 border-piper py-2 text-xs font-bold uppercase tracking-wider text-piper hover:bg-piper hover:text-sare"
                >
                  <ShoppingBag size={14} />
                  Adaugă
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 border-3 border-piper text-piper font-bold uppercase tracking-wider text-sm hover:bg-piper hover:text-sare"
          >
            Vezi tot meniul
          </Link>
          <span className="font-bold text-xs uppercase tracking-widest text-black/50">Mai multe preparate</span>
        </div>
      </div>
    </section>
  );
}
