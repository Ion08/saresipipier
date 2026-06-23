"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  uploadFile,
} from "@/lib/actions";
import { productSchema, type ProductFormData } from "@/lib/schemas";
import { formatPrice, getImagePreview, slugify, cn } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      ingredients: "",
      price: 0,
      weight: "",
      category: "",
      featured: false,
      new: false,
      available: true,
      image: "",
      order: 0,
    },
  });

  const watchName = watch("name");
  const watchFeatured = watch("featured");
  const watchNew = watch("new");
  const watchAvailable = watch("available");
  const watchImage = watch("image");

  useEffect(() => {
    if (!editingProduct && watchName) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, setValue, editingProduct]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data as unknown as Product[]);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data as unknown as Category[]);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const openCreateDialog = () => {
    setEditingProduct(null);
    reset({
      name: "",
      slug: "",
      description: "",
      ingredients: "",
      price: 0,
      weight: "",
      category: "",
      featured: false,
      new: false,
      available: true,
      image: "",
      order: 0,
    });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      ingredients: product.ingredients || "",
      price: product.price,
      weight: product.weight || "",
      category: typeof product.category === "object" ? (product.category as any).$id || "" : product.category || "",
      featured: product.featured,
      new: product.new,
      available: product.available,
      image: product.image || "",
      order: product.order || 0,
    });
    setImagePreview(product.image ? getImagePreview(product.image) : null);
    setDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.$id, data);
        if (res.success) {
          toast.success("Produsul a fost actualizat");
        } else {
          toast.error(res.error || "Eroare la actualizare");
          return;
        }
      } else {
        const res = await createProduct(data);
        if (res.success) {
          toast.success("Produsul a fost creat");
        } else {
          toast.error(res.error || "Eroare la creare");
          return;
        }
      }
      setDialogOpen(false);
      await fetchProducts();
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
      const res = await deleteProduct(deletingId);
      if (res.success) {
        toast.success("Produsul a fost șters");
        await fetchProducts();
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
        toast.error("Eroare la încărcarea imaginii");
      }
    } catch {
      toast.error("Eroare la încărcarea imaginii");
    } finally {
      setUploading(false);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.$id,
    label: c.name,
  }));

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl text-carbone">
              Produse
            </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
              gestionează meniul
              </p>
          </div>
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus size={16} />}
            onClick={openCreateDialog}
          >
            Adaugă produs
          </Button>
        </div>

        <div className="relative max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cenere"
          />
          <input
            type="text"
            placeholder="Caută produse..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full  border border-bordo bg-bianco-card pl-9 pr-3.5 py-2.5 text-sm text-carbone placeholder:text-cenere/60 focus:border-rosso focus:outline-none focus:ring-2 focus:ring-rosso/20 transition-colors"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full " />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <EmptyState
              icon={<UtensilsCrossed size={32} />}
              title="Niciun produs găsit"
              description={
                search
                  ? "Încearcă să cauți cu alți termeni"
                  : "Adaugă primul produs în meniu"
              }
              action={
                search
                  ? undefined
                  : { label: "Adaugă produs", onClick: openCreateDialog }
              }
            />
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bordo">
                    <th className="text-left py-3.5 px-4 font-medium text-cenere">
                      Produs
                    </th>
                    <th className="text-left py-3.5 px-4 font-medium text-cenere hidden md:table-cell">
                      Categorie
                    </th>
                    <th className="text-left py-3.5 px-4 font-medium text-cenere">
                      Preț
                    </th>
                    <th className="text-left py-3.5 px-4 font-medium text-cenere hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-right py-3.5 px-4 font-medium text-cenere">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => {
                    const catName =
                      categories.find(
                        (c) =>
                          c.$id === product.category ||
                          c.$id === (typeof product.category === "object" ? (product.category as any).$id : null)
                      )?.name || "Fără categorie";
                    return (
                      <tr
                        key={product.$id}
                        className="border-b border-bordo/50 hover:bg-background-warm/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10  bg-background-warm overflow-hidden shrink-0 flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={getImagePreview(product.image, 80)}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UtensilsCrossed
                                  size={16}
                                  className="text-cenere"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-carbone">
                                {product.name}
                              </p>
                              <p className="text-xs text-cenere mt-0.5">
                                {product.weight}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-cenere hidden md:table-cell">
                          {catName}
                        </td>
                        <td className="py-3 px-4 font-medium text-carbone">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {product.featured && (
                              <Badge variant="accent" size="sm">
                                Recomandat
                              </Badge>
                            )}
                            {product.new && (
                              <Badge variant="success" size="sm">
                                Nou
                              </Badge>
                            )}
                            <Badge
                              variant={product.available ? "success" : "error"}
                              size="sm"
                            >
                              {product.available ? "Disponibil" : "Indisponibil"}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit3 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingId(product.$id);
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Trash2 size={14} className="text-rosso" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-bordo">
                <p className="text-sm text-cenere">
                  Pagina {page} din {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingProduct ? "Editează produsul" : "Adaugă produs nou"}
          size="xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nume produs"
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

            <Textarea
              label="Ingrediente"
              error={errors.ingredients?.message}
              {...register("ingredients")}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Preț (MDL)"
                type="number"
                step="0.01"
                error={errors.price?.message}
                {...register("price")}
              />
              <Input
                label="Greutate"
                placeholder="ex: 250g"
                error={errors.weight?.message}
                {...register("weight")}
              />
              <Input
                label="Ordine"
                type="number"
                error={errors.order?.message}
                {...register("order")}
              />
            </div>

            <Select
              label="Categorie"
              placeholder="Selectează categoria"
              options={categoryOptions}
              error={errors.category?.message}
              {...register("category")}
            />

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-4 h-4 rounded border-bordo text-rosso focus:ring-rosso/20"
                />
                <span className="text-sm text-carbone">Recomandat</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("new")}
                  className="w-4 h-4 rounded border-bordo text-rosso focus:ring-rosso/20"
                />
                <span className="text-sm text-carbone">Nou</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("available")}
                  className="w-4 h-4 rounded border-bordo text-rosso focus:ring-rosso/20"
                />
                <span className="text-sm text-carbone">Disponibil</span>
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-carbone">
                Imagine
              </label>
              {imagePreview && (
                <div className="relative inline-block mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover  border border-bordo"
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
              <label className="flex items-center gap-2 px-4 py-2.5  border border-dashed border-bordo cursor-pointer hover:border-rosso transition-colors text-sm text-cenere hover:text-rosso">
                <Upload size={16} />
                {uploading
                  ? "Se încarcă..."
                  : "Încarcă imagine"}
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
              <Button
                type="submit"
                variant="primary"
                loading={saving}
              >
                {editingProduct ? "Salvează modificările" : "Adaugă produsul"}
              </Button>
            </div>
          </form>
        </Dialog>

        <ConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Șterge produsul"
          description="Ești sigur că vrei să ștergi acest produs? Acțiunea este ireversibilă."
          confirmLabel="Șterge"
          confirmVariant="danger"
          loading={deleting}
        />
      </div>
    </>
  );
}

function UtensilsCrossed(props: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
      <path d="M15 15 3.5 3.5a2.12 2.12 0 0 0-3 0 2.12 2.12 0 0 0 0 3L12 18" />
      <path d="m10 10 8 8" />
      <path d="M11 7 8 4" />
      <path d="m13 9 3-3" />
    </svg>
  );
}
