"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Upload, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getHomepageContent,
  updateHomepageContent,
  uploadFile,
} from "@/lib/actions";
import { homepageSchema, type HomepageFormData } from "@/lib/schemas";
import { getImagePreview } from "@/lib/utils";
import type { HomepageContent } from "@/lib/types";

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [aboutUploading, setAboutUploading] = useState(false);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<HomepageFormData>({
    resolver: zodResolver(homepageSchema),
    defaultValues: {
      heroTitle: "",
      heroSubtitle: "",
      heroDescription: "",
      heroImage: "",
      aboutTitle: "",
      aboutDescription: "",
      aboutImage: "",
      featuredTitle: "",
      featuredDescription: "",
    },
  });

  useEffect(() => {
    const init = async () => {
      await fetchContent();
      setLoading(false);
    };
    init();
  }, []);

  const fetchContent = async () => {
    const data = await getHomepageContent();
    if (data) {
      const hp = data as unknown as HomepageContent;
      setContent(hp);
      reset({
        heroTitle: hp.heroTitle || "",
        heroSubtitle: hp.heroSubtitle || "",
        heroDescription: hp.heroDescription || "",
        heroImage: hp.heroImage || "",
        aboutTitle: hp.aboutTitle || "",
        aboutDescription: hp.aboutDescription || "",
        aboutImage: hp.aboutImage || "",
        featuredTitle: hp.featuredTitle || "",
        featuredDescription: hp.featuredDescription || "",
      });
      if (hp.heroImage) setHeroPreview(getImagePreview(hp.heroImage));
      if (hp.aboutImage) setAboutPreview(getImagePreview(hp.aboutImage));
    }
  };

  const onSubmit = async (data: HomepageFormData) => {
    if (!content?.$id) {
      toast.error("Conținutul homepagei nu a fost găsit");
      return;
    }
    setSaving(true);
    try {
      const res = await updateHomepageContent(content.$id, data);
      if (res.success) {
        toast.success("Conținutul a fost salvat");
      } else {
        toast.error(res.error || "Eroare la salvare");
      }
    } catch {
      toast.error("A apărut o eroare");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await uploadFile(formData);
      if (res.success && res.fileId) {
        setValue("heroImage", res.fileId);
        setHeroPreview(URL.createObjectURL(file));
        toast.success("Imaginea a fost încărcată");
      } else {
        toast.error("Eroare la încărcare");
      }
    } catch {
      toast.error("Eroare la încărcare");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAboutUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await uploadFile(formData);
      if (res.success && res.fileId) {
        setValue("aboutImage", res.fileId);
        setAboutPreview(URL.createObjectURL(file));
        toast.success("Imaginea a fost încărcată");
      } else {
        toast.error("Eroare la încărcare");
      }
    } catch {
      toast.error("Eroare la încărcare");
    } finally {
      setAboutUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full " />
        <Skeleton className="h-64 w-full " />
        <Skeleton className="h-40 w-full " />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl text-carbone">
            Editează Homepage
          </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
            pagina principală
            </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                Hero Section
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Titlu Hero"
                error={errors.heroTitle?.message}
                {...register("heroTitle")}
              />
              <Input
                label="Subtitlu Hero"
                error={errors.heroSubtitle?.message}
                {...register("heroSubtitle")}
              />
              <Textarea
                label="Descriere Hero"
                error={errors.heroDescription?.message}
                {...register("heroDescription")}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbone">
                  Imagine Hero
                </label>
                {heroPreview && (
                  <div className="relative inline-block mb-3">
                    <img
                      src={heroPreview}
                      alt="Hero preview"
                      className="w-full max-w-md h-40 object-cover  border border-bordo"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue("heroImage", "");
                        setHeroPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6  bg-error text-white flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2.5  border border-dashed border-bordo cursor-pointer hover:border-rosso transition-colors text-sm text-cenere hover:text-rosso max-w-md">
                  <Upload size={16} />
                  {heroUploading ? "Se încarcă..." : "Încarcă imagine"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="hidden"
                    disabled={heroUploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                About Section
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Titlu About"
                error={errors.aboutTitle?.message}
                {...register("aboutTitle")}
              />
              <Textarea
                label="Descriere About"
                error={errors.aboutDescription?.message}
                {...register("aboutDescription")}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbone">
                  Imagine About
                </label>
                {aboutPreview && (
                  <div className="relative inline-block mb-3">
                    <img
                      src={aboutPreview}
                      alt="About preview"
                      className="w-full max-w-md h-40 object-cover  border border-bordo"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue("aboutImage", "");
                        setAboutPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6  bg-error text-white flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2.5  border border-dashed border-bordo cursor-pointer hover:border-rosso transition-colors text-sm text-cenere hover:text-rosso max-w-md">
                  <Upload size={16} />
                  {aboutUploading ? "Se încarcă..." : "Încarcă imagine"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutUpload}
                    className="hidden"
                    disabled={aboutUploading}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-display text-lg text-carbone">
                Featured Section
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Titlu Featured"
                error={errors.featuredTitle?.message}
                {...register("featuredTitle")}
              />
              <Textarea
                label="Descriere Featured"
                error={errors.featuredDescription?.message}
                {...register("featuredDescription")}
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
              {saving ? "Se salvează..." : "Salvează toate modificările"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
