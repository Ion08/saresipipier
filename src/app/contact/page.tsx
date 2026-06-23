"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock, Camera, Globe, Send } from "lucide-react";
import PageLayout from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/ui/animated-section";
import { submitContact } from "@/lib/actions";
import { contactSchema, type ContactFormData } from "@/lib/schemas";
import type { Resolver } from "react-hook-form";

const contactInfo = [
  { icon: MapPin, label: "Adresă", value: "Calea Orheiului 21, Porumbeni", extra: "Chișinău, Moldova" },
  { icon: Phone, label: "Telefon", value: "+373 62 000 612", extra: "Sună-ne pentru rezervări" },
  { icon: Mail, label: "Email", value: "contact@saresipiper.com", extra: "Răspundem în 24 de ore" },
  { icon: Clock, label: "Program", value: "Luni - Duminică", extra: "09:00 - 21:00" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as Resolver<ContactFormData>,
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitContact(data);
      if (result.success) {
        toast.success("Mesajul a fost trimis cu succes!");
        reset();
      } else {
        toast.error(result.error || "A apărut o eroare. Încercați din nou.");
      }
    } catch {
      toast.error("A apărut o eroare. Încercați din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="bg-black text-white pt-28 md:pt-32 pb-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <p className="text-rosso text-xs font-bold uppercase tracking-widest mb-3">Contactează-ne</p>
          <h1 className="text-6xl md:text-8xl text-white">Contactează-ne</h1>
          <p className="text-white/60 text-sm font-bold uppercase tracking-wider mt-4">Sună, scrie sau treci pe la noi. Suntem aici.</p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-10 md:mb-12">
            <h2 className="text-4xl md:text-6xl text-black">Trimite un mesaj</h2>
            <p className="text-black/60 text-sm mt-2 font-bold uppercase tracking-wider">Sau treci pe la noi</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <div className="border-3 border-black bg-white p-6 md:p-8">
                <p className="text-black/60 leading-relaxed mb-6 text-sm font-bold uppercase tracking-wider">
                  Completează formularul și revenim cu un răspuns.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Nume" placeholder="Numele tău" error={errors.name?.message} {...register("name")} />
                    <Input label="Email" type="email" placeholder="email@exemplu.com" error={errors.email?.message} {...register("email")} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Telefon" type="tel" placeholder="+373 6X XXX XXX" error={errors.phone?.message} {...register("phone")} />
                    <Input label="Subiect" placeholder="Subiectul mesajului" error={errors.subject?.message} {...register("subject")} />
                  </div>
                  <Textarea label="Mesaj" placeholder="Scrie mesajul tău..." rows={5} error={errors.message?.message} {...register("message")} />
                  <Button type="submit" variant="primary" size="lg" loading={isSubmitting} iconRight={<Send size={16} />}>
                    Trimite mesajul
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-10">
              <div className="border-3 border-black bg-white p-6 md:p-8">
                <h3 className="font-display text-xl text-black uppercase mb-6">Informații de contact</h3>
                <div className="space-y-6">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-4">
                        <Icon size={18} className="text-rosso mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-black">{item.label}</p>
                          <p className="text-black font-bold">{item.value}</p>
                          <p className="text-sm text-black/60">{item.extra}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-3 border-black bg-white p-6 md:p-8">
                <h3 className="font-display text-xl text-black uppercase mb-4">Urmărește-ne</h3>
                <p className="text-black/60 text-sm mb-5 leading-relaxed font-bold uppercase tracking-wider">
                  Rămâi conectat cu noi pe rețelele sociale.
                </p>
                <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 border-3 border-black text-black font-bold uppercase tracking-wider text-xs hover:bg-black hover:text-white">
                    <Camera size={16} /> Instagram
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 border-3 border-black text-black font-bold uppercase tracking-wider text-xs hover:bg-black hover:text-white">
                    <Globe size={16} /> Facebook
                  </a>
                </div>
              </div>

              <div className="border-3 border-black overflow-hidden h-[220px]">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=28.829%2C47.148%2C28.836%2C47.151&layer=mapnik&marker=47.1495627%2C28.8327016"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Locația Sare și Piper"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
