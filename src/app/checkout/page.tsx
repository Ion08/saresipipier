"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/actions";
import PageLayout from "@/components/layout/page-layout";
import toast from "react-hot-toast";

const CUSTOMER_STORAGE_KEY = "saresipiper-customer";

export default function CheckoutPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryType: "pickup" as "delivery" | "pickup",
    address: "",
    paymentMethod: "cash" as "cash" | "card",
    notes: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setForm((prev) => ({
          ...prev,
          customerName: data.customerName || "",
          customerPhone: data.customerPhone || "",
          customerEmail: data.customerEmail || "",
        }));
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Coșul e gol");
      return;
    }
    if (!form.customerName || !form.customerPhone) {
      toast.error("Completează numele și telefonul");
      return;
    }
    if (form.deliveryType === "delivery" && !form.address) {
      toast.error("Completează adresa de livrare");
      return;
    }

    setSubmitting(true);
    const result = await createOrder({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail,
      deliveryType: form.deliveryType,
      address: form.address,
      paymentMethod: form.paymentMethod,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount: totalPrice,
      notes: form.notes,
    });

    if (result.success) {
      try {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
        }));
      } catch {}
      setSuccess(true);
      clearCart();
      toast.success("Comandă plasată! Te sunăm să confirmăm.");
    } else {
      toast.error("Ceva n-a mers. Sună-ne la +373 62 000 612");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <PageLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 pt-20">
          <div className="w-20 h-20 border-3 border-verde flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-verde" />
          </div>
          <h1 className="text-4xl md:text-5xl text-black mb-3">Comandă plasată!</h1>
          <p className="text-sm font-bold uppercase tracking-wider text-black/60 mb-4">Mulțumim</p>
          <p className="text-black/60 text-center max-w-md mb-8 text-sm">
            Am primit comanda ta. Te sunăm în curând să confirmăm.
          </p>
          <Link href="/menu" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-rosso text-white border-3 border-rosso font-bold uppercase tracking-wider text-sm hover:bg-black hover:border-black">
            Înapoi la meniu
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 pt-20">
          <h1 className="text-4xl text-black mb-3">Coșul e gol</h1>
          <p className="text-black/60 text-sm font-bold uppercase tracking-wider mb-6">Adaugă ceva bun din meniu</p>
          <Link href="/menu" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-rosso text-white border-3 border-rosso font-bold uppercase tracking-wider text-sm hover:bg-black hover:border-black">
            Vezi meniul
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="bg-piper text-sare pt-28 md:pt-32 pb-10">
        <div className="container-custom px-4 md:px-6">
          <Link href="/menu" className="inline-flex items-center gap-2 text-sare/60 hover:text-rosso text-sm mb-4 font-bold uppercase tracking-wider">
            <ArrowLeft size={16} />
            Înapoi la meniu
          </Link>
          <h1 className="text-6xl md:text-8xl text-sare">Finalizează</h1>
          <p className="text-sare/60 text-sm font-bold uppercase tracking-wider mt-4">Mai un pas</p>
        </div>
      </section>

      <section className="bg-sare py-14 md:py-20">
        <div className="container-custom px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-4xl md:text-6xl text-piper mb-6">Detalii livrare</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Nume *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full border-[2px] border-piper bg-sare px-4 py-2.5 text-sm text-piper placeholder:text-cenere/60 focus:outline-none focus:border-rosso"
                    placeholder="Numele tău"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full border-[2px] border-piper bg-sare px-4 py-2.5 text-sm text-piper placeholder:text-cenere/60 focus:outline-none focus:border-rosso"
                    placeholder="+373 ..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    className="w-full border-[2px] border-piper bg-sare px-4 py-2.5 text-sm text-piper placeholder:text-cenere/60 focus:outline-none focus:border-rosso"
                    placeholder="email@exemplu.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Livrare</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, deliveryType: "pickup" })}
                      className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-wider ${
                        form.deliveryType === "pickup"
                          ? "bg-rosso text-sare border-[2px] border-rosso"
                          : "bg-sare text-piper border-[2px] border-piper"
                      }`}
                    >
                      Ridicare
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, deliveryType: "delivery" })}
                      className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-wider ${
                        form.deliveryType === "delivery"
                          ? "bg-rosso text-sare border-[2px] border-rosso"
                          : "bg-sare text-piper border-[2px] border-piper"
                      }`}
                    >
                      Livrare
                    </button>
                  </div>
                </div>

                {form.deliveryType === "delivery" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Adresa *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border-[2px] border-piper bg-sare px-4 py-2.5 text-sm text-piper placeholder:text-cenere/60 focus:outline-none focus:border-rosso"
                      placeholder="Strada, nr., apartament"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Plată</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: "cash" })}
                      className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-wider ${
                        form.paymentMethod === "cash"
                          ? "bg-verde text-sare border-[2px] border-verde"
                          : "bg-sare text-piper border-[2px] border-piper"
                      }`}
                    >
                      Numerar
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: "card" })}
                      className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-wider ${
                        form.paymentMethod === "card"
                          ? "bg-verde text-sare border-[2px] border-verde"
                          : "bg-sare text-piper border-[2px] border-piper"
                      }`}
                    >
                      Card
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-piper mb-1.5">Notițe</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full border-[2px] border-piper bg-sare px-4 py-2.5 text-sm text-piper placeholder:text-cenere/60 focus:outline-none focus:border-rosso resize-y"
                    placeholder="Fără ceapă, sos extra, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 text-sm font-bold uppercase tracking-wider mt-2 disabled:opacity-40 bg-rosso text-sare border-3 border-rosso hover:bg-piper hover:border-piper"
                >
                  {submitting ? "Se trimite..." : `Trimite comanda · ${formatPrice(totalPrice)}`}
                </button>
              </form>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-4xl md:text-6xl text-piper mb-6">Comanda ta</h2>
              <div className="border-3 border-piper bg-sare p-5">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 border-b-[2px] border-piper pb-3">
                      <div className="relative w-14 h-14 shrink-0 border-[2px] border-piper overflow-hidden bg-sare-muted">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm uppercase text-piper truncate">{item.name}</h4>
                        <p className="text-rosso font-display text-sm">{formatPrice(item.price * item.quantity)}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border-[2px] border-piper flex items-center justify-center text-piper hover:bg-piper hover:text-sare">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm text-piper w-5 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border-[2px] border-piper flex items-center justify-center text-piper hover:bg-piper hover:text-sare">
                            <Plus size={12} />
                          </button>
                          <button onClick={() => removeItem(item.id)} className="ml-auto text-cenere hover:text-rosso font-bold text-xs uppercase tracking-wider">
                            Șterge
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-piper-muted">
                  <span>Estimare livrare</span>
                  <span className="text-verde font-bold">≈ 30-40 min</span>
                </div>
                <div className="mt-3 pt-4 border-t-[2px] border-piper flex items-center justify-between">
                  <span className="text-piper-muted text-sm font-bold uppercase tracking-wider">Total</span>
                  <span className="font-display text-2xl text-rosso">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
