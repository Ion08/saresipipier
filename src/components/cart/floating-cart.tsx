"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ChefHat, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function FloatingCart() {
  const { totalItems, totalPrice, setCartOpen } = useCart();
  const pathname = usePathname();

  if (pathname === "/checkout") return null;

  return (
    <>
      {totalItems > 0 && (
        <div className="hidden md:block fixed bottom-6 right-6 z-40 animate-slide-up">
          <Link href="/checkout"
            className="flex items-center gap-3 bg-black text-white border-3 border-white/20 pl-5 pr-6 py-3.5 hover:bg-black/80">
            <div className="relative">
              <ShoppingBag size={18} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-rosso text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">{totalItems}</span>
            </div>
            <div className="text-left">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider leading-none">Total</p>
              <p className="text-white font-display text-sm -mt-0.5">{formatPrice(totalPrice)}</p>
            </div>
            <div className="flex items-center gap-1.5 ml-1 bg-rosso px-3.5 py-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">Plasează</span>
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </Link>
        </div>
      )}

      {totalItems === 0 ? (
        <>
          {pathname !== "/menu" && (
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
              <div className="bg-black border-t-3 border-white/10 px-4 py-3">
                <Link href="/menu"
                  className="flex items-center justify-center gap-2 w-full bg-rosso text-white border-3 border-rosso py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:border-white">
                  <ChefHat size={18} /> Comandă acum <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-slide-up">
          <div className="bg-black border-t-3 border-white/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setCartOpen(true)} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <ShoppingBag size={20} className="text-white" />
                  <span className="absolute -top-2 -right-2 bg-rosso text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">{totalItems}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-wider">
                    Coșul tău · <span className="text-verde-light font-bold">≈ 30-40 min</span>
                  </p>
                  <p className="text-white font-display text-lg truncate">{formatPrice(totalPrice)}</p>
                </div>
              </button>
              <Link href="/checkout"
                className="shrink-0 bg-rosso text-white border-3 border-rosso px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-black hover:border-white">
                Finalizează
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
