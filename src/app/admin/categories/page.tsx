"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Edit3, Trash2, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions";
import { categorySchema, type CategoryFormData } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      order: 0,
    },
  });

  const watchName = watch("name");

  useEffect(() => {
    if (!editingCategory && watchName) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, setValue, editingCategory]);

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      setLoading(false);
    };
    init();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data as unknown as Category[]);
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    reset({ name: "", slug: "", description: "", order: 0 });
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      order: cat.order || 0,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.$id, data);
        if (res.success) {
          toast.success("Categoria a fost actualizată");
        } else {
          toast.error(res.error || "Eroare la actualizare");
          return;
        }
      } else {
        const res = await createCategory(data);
        if (res.success) {
          toast.success("Categoria a fost creată");
        } else {
          toast.error(res.error || "Eroare la creare");
          return;
        }
      }
      setDialogOpen(false);
      await fetchCategories();
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
      const res = await deleteCategory(deletingId);
      if (res.success) {
        toast.success("Categoria a fost ștearsă");
        await fetchCategories();
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-carbone">
              Categorii
            </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
              organizează produsele
              </p>
          </div>
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus size={16} />}
            onClick={openCreateDialog}
          >
            Adaugă categorie
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full " />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <EmptyState
              icon={<FolderTree size={32} />}
              title="Nicio categorie"
              description="Creează prima categorie pentru a organiza produsele"
              action={{ label: "Adaugă categorie", onClick: openCreateDialog }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card key={cat.$id} hover>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-carbone truncate">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-sm text-cenere mt-1 line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-cenere">
                          Slug: {cat.slug}
                        </span>
                        {cat.order !== undefined && (
                          <span className="text-xs text-cenere">
                            • Ordine: {cat.order}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-bordo">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(cat)}
                      iconLeft={<Edit3 size={14} />}
                    >
                      Editează
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeletingId(cat.$id);
                        setDeleteConfirmOpen(true);
                      }}
                      className="text-rosso hover:text-rosso"
                      iconLeft={<Trash2 size={14} />}
                    >
                      Șterge
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingCategory ? "Editează categoria" : "Adaugă categorie nouă"}
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
                label="Slug"
                error={errors.slug?.message}
                {...register("slug")}
              />
            </div>

            <Textarea
              label="Descriere"
              error={errors.description?.message}
              {...register("description")}
            />

            <Input
              label="Ordine"
              type="number"
              error={errors.order?.message}
              {...register("order")}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Anulează
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={saving}
              >
                {editingCategory ? "Salvează" : "Adaugă"}
              </Button>
            </div>
          </form>
        </Dialog>

        <ConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Șterge categoria"
          description="Ești sigur că vrei să ștergi această categorie? Produsele asociate nu vor fi șterse."
          confirmLabel="Șterge"
          confirmVariant="danger"
          loading={deleting}
        />
      </div>
    </>
  );
}
