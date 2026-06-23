"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  Star,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions";
import { testimonialSchema, type TestimonialFormData } from "@/lib/schemas";
import type { Testimonial } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema) as any,
    defaultValues: {
      name: "",
      role: "",
      content: "",
      rating: 5,
      avatar: "",
      featured: false,
      order: 0,
    },
  });

  const watchRating = watch("rating");
  const watchFeatured = watch("featured");

  useEffect(() => {
    const init = async () => {
      await fetchTestimonials();
      setLoading(false);
    };
    init();
  }, []);

  const fetchTestimonials = async () => {
    const data = await getAllTestimonials();
    setTestimonials(data as unknown as Testimonial[]);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    reset({ name: "", role: "", content: "", rating: 5, avatar: "", featured: false, order: 0 });
    setDialogOpen(true);
  };

  const openEditDialog = (item: Testimonial) => {
    setEditingItem(item);
    reset({
      name: item.name,
      role: item.role || "",
      content: item.content,
      rating: item.rating,
      avatar: item.avatar || "",
      featured: item.featured,
      order: item.order || 0,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: TestimonialFormData) => {
    setSaving(true);
    try {
      if (editingItem) {
        const res = await updateTestimonial(editingItem.$id, data);
        if (res.success) {
          toast.success("Testimonialul a fost actualizat");
        } else {
          toast.error(res.error || "Eroare la actualizare");
          return;
        }
      } else {
        const res = await createTestimonial(data);
        if (res.success) {
          toast.success("Testimonialul a fost creat");
        } else {
          toast.error(res.error || "Eroare la creare");
          return;
        }
      }
      setDialogOpen(false);
      await fetchTestimonials();
    } catch {
      toast.error("A apărut o eroare");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await deleteTestimonial(deletingId);
      if (res.success) {
        toast.success("Testimonialul a fost șters");
        await fetchTestimonials();
      } else {
        toast.error(res.error || "Eroare la ștergere");
      }
    } catch {
      toast.error("A apărut o eroare");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={cn(
          i < rating ? "text-rosso fill-rosso" : "text-border fill-none"
        )}
      />
    ));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-carbone">
              Testimoniale
            </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
              recenziile clienților
              </p>
          </div>
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus size={16} />}
            onClick={openCreateDialog}
          >
            Adaugă testimonial
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 " />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <Card>
            <EmptyState
              icon={<MessageSquareText size={32} />}
              title="Nicio recenzie"
              description="Adaugă primele testimoniale de la clienți"
              action={{
                label: "Adaugă testimonial",
                onClick: openCreateDialog,
              }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((item) => (
              <Card key={item.$id} hover>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10  bg-background-warm flex items-center justify-center text-sm font-semibold text-carbone shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-carbone">
                          {item.name}
                        </h3>
                        {item.role && (
                          <p className="text-xs text-cenere">{item.role}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating)}
                    </div>
                  </div>

                  <p className="text-sm text-carbone mt-3 line-clamp-3">
                    &ldquo;{item.content}&rdquo;
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-bordo">
                    <div className="flex items-center gap-2">
                      {item.featured && (
                        <Badge variant="accent" size="sm">
                          Featured
                        </Badge>
                      )}
                      <span className="text-xs text-cenere">
                        Ordine: {item.order || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingId(item.$id);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 size={14} className="text-rosso" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={
            editingItem ? "Editează testimonialul" : "Adaugă testimonial nou"
          }
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nume"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Rol / Funcție"
                placeholder="ex: Client fidel"
                error={errors.role?.message}
                {...register("role")}
              />
            </div>

            <Textarea
              label="Conținut"
              error={errors.content?.message}
              {...register("content")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-carbone">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starValue = i + 1;
                    const filled =
                      starValue <= (hoverRating || watchRating);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setValue("rating", starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 transition-colors"
                      >
                        <Star
                          size={22}
                          className={cn(
                            filled
                              ? "text-rosso fill-rosso"
                              : "text-border hover:text-rosso/50",
                            "transition-colors"
                          )}
                        />
                      </button>
                    );
                  })}
                  <span className="text-sm text-cenere ml-2">
                    {watchRating}/5
                  </span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-xs text-rosso" role="alert">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <Input
                label="Ordine"
                type="number"
                error={errors.order?.message}
                {...register("order")}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-4 h-4 rounded border-bordo text-rosso focus:ring-rosso/20"
              />
              <span className="text-sm text-carbone">Featured</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Anulează
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                {editingItem ? "Salvează" : "Adaugă"}
              </Button>
            </div>
          </form>
        </Dialog>

        <ConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Șterge testimonialul"
          description="Ești sigur că vrei să ștergi acest testimonial? Acțiunea este ireversibilă."
          confirmLabel="Șterge"
          confirmVariant="danger"
          loading={deleting}
        />
      </div>
    </>
  );
}
