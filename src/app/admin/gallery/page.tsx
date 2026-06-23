"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
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
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadFile,
} from "@/lib/actions";
import { gallerySchema, type GalleryFormData } from "@/lib/schemas";
import { getImagePreview } from "@/lib/utils";
import type { GalleryItem } from "@/lib/types";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image: "",
      featured: false,
      order: 0,
    },
  });

  const watchFeatured = watch("featured");

  useEffect(() => {
    const init = async () => {
      await fetchItems();
      setLoading(false);
    };
    init();
  }, []);

  const fetchItems = async () => {
    const data = await getGalleryItems();
    setItems(data as unknown as GalleryItem[]);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    reset({ title: "", description: "", category: "", image: "", featured: false, order: 0 });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description || "",
      category: item.category || "",
      image: item.image || "",
      featured: item.featured,
      order: item.order || 0,
    });
    setImagePreview(item.image ? getImagePreview(item.image) : null);
    setDialogOpen(true);
  };

  const onSubmit = async (data: GalleryFormData) => {
    setSaving(true);
    try {
      if (editingItem) {
        const res = await updateGalleryItem(editingItem.$id, data);
        if (res.success) {
          toast.success("Imaginea a fost actualizată");
        } else {
          toast.error(res.error || "Eroare la actualizare");
          return;
        }
      } else {
        const res = await createGalleryItem(data);
        if (res.success) {
          toast.success("Imaginea a fost adăugată");
        } else {
          toast.error(res.error || "Eroare la adăugare");
          return;
        }
      }
      setDialogOpen(false);
      await fetchItems();
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
      const res = await deleteGalleryItem(deletingId);
      if (res.success) {
        toast.success("Imaginea a fost ștearsă");
        await fetchItems();
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await uploadFile(formData);
      if (res.success && res.fileId) {
        setValue("image", res.fileId);
        setImagePreview(URL.createObjectURL(file));
        toast.success("Imaginea a fost încărcată");
      } else {
        toast.error("Eroare la încărcare");
      }
    } catch {
      toast.error("Eroare la încărcare");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-carbone">
              Galerie
            </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
              imaginile restaurantului
              </p>
          </div>
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus size={16} />}
            onClick={openCreateDialog}
          >
            Adaugă imagine
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] " />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card>
            <EmptyState
              icon={<ImageIcon size={32} />}
              title="Galerie goală"
              description="Adaugă primele imagini în galeria restaurantului"
              action={{ label: "Adaugă imagine", onClick: openCreateDialog }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.$id}
                className="group relative  overflow-hidden border border-black/20 bg-white"
              >
                <div className="aspect-[4/3] bg-background-warm">
                  {item.image ? (
                    <img
                      src={getImagePreview(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-black/50" />
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(item)}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDeletingId(item.$id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="absolute top-2 left-2">
                  {item.featured && (
                    <Badge variant="accent" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium text-carbone truncate">
                    {item.title || "Fără titlu"}
                  </p>
                  {item.category && (
                    <p className="text-xs text-black/50 mt-0.5 truncate">
                      {item.category}
                    </p>
                  )}
                  <p className="text-xs text-black/50 mt-0.5">
                    Ordine: {item.order || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingItem ? "Editează imaginea" : "Adaugă imagine nouă"}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Titlu"
              error={errors.title?.message}
              {...register("title")}
            />

            <Textarea
              label="Descriere"
              error={errors.description?.message}
              {...register("description")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Categorie"
                placeholder="ex: interior, exterior, mâncare"
                error={errors.category?.message}
                {...register("category")}
              />
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
                className="w-4 h-4 rounded border-black/20 text-rosso focus:ring-rosso/20"
              />
              <span className="text-sm text-carbone">Featured</span>
            </label>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-carbone">
                Imagine
              </label>
              {imagePreview && (
                <div className="relative inline-block mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-32 object-cover  border border-black/20"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("image", "");
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6  bg-error text-white flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2.5  border border-dashed border-black/20 cursor-pointer hover:border-rosso transition-colors text-sm text-black/50 hover:text-rosso">
                <Upload size={16} />
                {uploading ? "Se încarcă..." : "Încarcă imagine"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

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
          title="Șterge imaginea"
          description="Ești sigur că vrei să ștergi această imagine? Acțiunea este ireversibilă."
          confirmLabel="Șterge"
          confirmVariant="danger"
          loading={deleting}
        />
      </div>
    </>
  );
}
