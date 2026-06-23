"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSettings,
  updateSettings,
} from "@/lib/actions";
import { settingsSchema, type SettingsFormData } from "@/lib/schemas";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      restaurantName: "",
      tagline: "",
      address: "",
      addressLine2: "",
      city: "",
      phone: "",
      instagram: "",
      instagramUrl: "",
      email: "",
      openingHours: "",
      openingHoursDaily: "",
      googleMapsUrl: "",
      facebook: "",
      whatsapp: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });

  useEffect(() => {
    const init = async () => {
      await fetchSettings();
      setLoading(false);
    };
    init();
  }, []);

  const fetchSettings = async () => {
    const data = await getSettings();
    if (data) {
      const s = data as unknown as SiteSettings;
      setSettings(s);
      reset({
        restaurantName: s.restaurantName || "",
        tagline: s.tagline || "",
        address: s.address || "",
        addressLine2: s.addressLine2 || "",
        city: s.city || "",
        phone: s.phone || "",
        instagram: s.instagram || "",
        instagramUrl: s.instagramUrl || "",
        email: s.email || "",
        openingHours: s.openingHours || "",
        openingHoursDaily: s.openingHoursDaily || "",
        googleMapsUrl: s.googleMapsUrl || "",
        facebook: s.facebook || "",
        whatsapp: s.whatsapp || "",
        seoTitle: s.seoTitle || "",
        seoDescription: s.seoDescription || "",
        seoKeywords: s.seoKeywords || "",
      });
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    if (!settings?.$id) {
      toast.error("Setările nu au fost găsite");
      return;
    }
    setSaving(true);
    try {
      const res = await updateSettings(settings.$id, data);
      if (res.success) {
        toast.success("Setările au fost salvate");
      } else {
        toast.error(res.error || "Eroare la salvare");
      }
    } catch {
      toast.error("A apărut o eroare");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full " />
        <Skeleton className="h-48 w-full " />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl text-carbone">
            Setări site
          </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
            configurații generale
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                Informații generale
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nume restaurant"
                  error={errors.restaurantName?.message}
                  {...register("restaurantName")}
                />
                <Input
                  label="Tagline"
                  error={errors.tagline?.message}
                  {...register("tagline")}
                />
              </div>

              <Input
                label="Adresă"
                error={errors.address?.message}
                {...register("address")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Adresă (linia 2)"
                  error={errors.addressLine2?.message}
                  {...register("addressLine2")}
                />
                <Input
                  label="Oraș"
                  error={errors.city?.message}
                  {...register("city")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                Contact
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Telefon"
                  type="tel"
                  placeholder="+373 22 123 456"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="contact@saresipiper.md"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Instagram (username)"
                  placeholder="@saresipiper"
                  error={errors.instagram?.message}
                  {...register("instagram")}
                />
                <Input
                  label="Instagram URL"
                  placeholder="https://instagram.com/saresipiper"
                  error={errors.instagramUrl?.message}
                  {...register("instagramUrl")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Facebook URL"
                  placeholder="https://facebook.com/saresipiper"
                  error={errors.facebook?.message}
                  {...register("facebook")}
                />
                <Input
                  label="WhatsApp"
                  placeholder="+373XXXXXXXX"
                  error={errors.whatsapp?.message}
                  {...register("whatsapp")}
                />
              </div>

              <Input
                label="Google Maps URL"
                placeholder="https://maps.google.com/..."
                error={errors.googleMapsUrl?.message}
                {...register("googleMapsUrl")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                Program
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Program (scurt)"
                placeholder="Luni - Duminică: 10:00 - 23:00"
                error={errors.openingHours?.message}
                {...register("openingHours")}
              />
              <Input
                label="Program (detaliat)"
                placeholder="Luni - Vineri: 10:00 - 23:00, weekend: 11:00 - 00:00"
                error={errors.openingHoursDaily?.message}
                {...register("openingHoursDaily")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                SEO
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="SEO Title"
                error={errors.seoTitle?.message}
                {...register("seoTitle")}
              />
              <Textarea
                label="SEO Description"
                error={errors.seoDescription?.message}
                {...register("seoDescription")}
              />
              <Input
                label="SEO Keywords"
                placeholder="restaurant, mâncare, ..."
                error={errors.seoKeywords?.message}
                {...register("seoKeywords")}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={saving}
            >
              {saving ? "Se salvează..." : "Salvează setările"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
