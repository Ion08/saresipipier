"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!isCartOpen) setConfirmClear(false);
  }, [isCartOpen]);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-piper/60" onClick={() => setCartOpen(false)} />

          <motion.div
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-sare border-l-3 border-piper flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b-3 border-piper">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rosso" />
                <span className="font-display text-lg uppercase text-piper">Coșul tău</span>
                {totalItems > 0 && (
                  <span className="bg-rosso text-sare text-xs font-bold w-5 h-5 flex items-center justify-center">{totalItems}</span>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="flex items-center justify-center w-9 h-9 border-[2px] border-piper text-piper hover:bg-piper hover:text-sare">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="w-16 h-16 text-cenere/30 mb-4" />
                <p className="font-display text-xl uppercase text-piper mb-2">Coșul e gol</p>
                <p className="text-piper-muted text-sm font-bold uppercase tracking-wider mb-6">Adaugă ceva bun din meniu</p>
                <Link href="/menu" onClick={() => setCartOpen(false)} className="px-6 py-2.5 bg-rosso text-sare border-3 border-rosso font-bold uppercase tracking-wider text-sm hover:bg-piper hover:border-piper">
                  Vezi meniul
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 border-b-[2px] border-piper pb-4">
                      <div className="relative w-16 h-16 shrink-0 border-[2px] border-piper overflow-hidden bg-sare-muted">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-sm uppercase text-piper leading-tight truncate">{item.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-cenere hover:text-rosso text-xs font-bold uppercase tracking-wider shrink-0">
                            Șterge
                          </button>
                        </div>
                        {item.weight && <p className="text-verde text-[11px] uppercase tracking-wide font-bold">{item.weight}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border-[2px] border-piper flex items-center justify-center text-piper hover:bg-piper hover:text-sare">
                              <Minus size={13} />
                            </button>
                            <span className="font-bold text-piper text-sm w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border-[2px] border-piper flex items-center justify-center text-piper hover:bg-piper hover:text-sare">
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-display text-base text-rosso">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-3 border-piper px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-piper-muted">
                    <span>Estimare livrare</span>
                    <span className="text-verde font-bold">≈ 30-40 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-piper-muted text-sm font-bold uppercase tracking-wider">Total</span>
                    <span className="font-display text-2xl text-rosso">{formatPrice(totalPrice)}</span>
                  </div>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} className="block w-full py-3 text-sm font-bold uppercase tracking-wider bg-rosso text-sare border-3 border-rosso hover:bg-piper hover:border-piper text-center">
                    Finalizează comanda
                  </Link>
                  {confirmClear ? (
                    <div className="flex items-center justify-center gap-3 py-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-piper-muted">Golești coșul?</span>
                      <button onClick={() => { clearCart(); setConfirmClear(false); }} className="text-xs font-bold text-rosso uppercase tracking-wider">Da</button>
                      <button onClick={() => setConfirmClear(false)} className="text-xs text-piper-muted font-bold uppercase tracking-wider">Nu</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmClear(true)} className="w-full text-piper-muted text-xs font-bold uppercase tracking-wider hover:text-rosso py-1">
                      Golește coșul
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
