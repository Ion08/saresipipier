"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((p) => (
            <div key={p.$id} className="group border-3 border-piper">
              <div className="relative aspect-square w-full overflow-hidden bg-sare-muted image-zoom">
                <ImageWithFallback
                  src={getImage(p)}
                  alt={p.name}
                  fill
                  className="object-cover"
                  containerClassName=""
                  imageZoom
                />
                {p.new && (
                  <span className="absolute top-3 left-3 z-10 border-[2px] border-verde text-verde font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-sare">Nou</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(p);
                  }}
                  className="absolute bottom-3 right-3 w-9 h-9 border-[2px] border-piper bg-sare flex items-center justify-center hover:bg-piper group-hover:bg-piper"
                  aria-label={`Adaugă ${p.name} în coș`}
                >
                  <Plus size={16} className="text-piper group-hover:text-sare" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-display text-sm md:text-lg text-piper uppercase tracking-wide leading-tight">
                  {p.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  {p.weight && (
                    <span className="text-verde text-xs uppercase tracking-wide font-bold">{p.weight}</span>
                  )}
                  <span className="font-display text-lg md:text-xl text-rosso ml-auto">{formatPrice(p.price)}</span>
                </div>
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
