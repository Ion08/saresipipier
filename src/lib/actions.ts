"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  adminListDocuments,
  adminCreateDocument,
  adminUpdateDocument,
  adminDeleteDocument,
  adminUploadFile,
  adminDeleteFile,
} from "./appwrite";
import { setAdminSession, clearAdminSession } from "./admin-auth";
import { env } from "./env";
import { COLLECTIONS } from "./collections";
import {
  reservationSchema,
  contactSchema,
  loginSchema,
  productSchema,
  categorySchema,
  gallerySchema,
  testimonialSchema,
  homepageSchema,
  settingsSchema,
} from "./schemas";

// Auth
export async function loginAdmin(data: z.infer<typeof loginSchema>) {
  const parsed = loginSchema.parse(data);

  if (
    parsed.email === env.admin.email &&
    parsed.password === env.admin.password
  ) {
    await setAdminSession();
    return { success: true };
  }

  return { success: false, error: "Email sau parolă incorecte" };
}

export async function logoutAdmin() {
  await clearAdminSession();
  return { success: true };
}

// Categories
export async function getCategories() {
  try {
    const result = await adminListDocuments(COLLECTIONS.categories);
    return result.documents || [];
  } catch {
    return [];
  }
}

export async function createCategory(data: z.infer<typeof categorySchema>) {
  const parsed = categorySchema.parse(data);
  try {
    await adminCreateDocument(COLLECTIONS.categories, {
      ...parsed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/categories");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: z.infer<typeof categorySchema>
) {
  const parsed = categorySchema.parse(data);
  try {
    await adminUpdateDocument(COLLECTIONS.categories, id, {
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/categories");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await adminDeleteDocument(COLLECTIONS.categories, id);
    revalidatePath("/admin/categories");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete category" };
  }
}

// Products
export async function getProducts() {
  try {
    const result = await adminListDocuments(COLLECTIONS.products);
    return result.documents || [];
  } catch {
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const all = await adminListDocuments(COLLECTIONS.products);
    const docs = all.documents || [];
    return docs
      .filter((p: any) => p.featured === true && p.available !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function getNewProducts() {
  try {
    const all = await adminListDocuments(COLLECTIONS.products);
    const docs = all.documents || [];
    return docs
      .filter((p: any) => p.new === true && p.available !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function getProductsByCategory(categoryId: string) {
  try {
    const all = await adminListDocuments(COLLECTIONS.products);
    const docs = all.documents || [];
    return docs
      .filter((p: any) => p.category === categoryId && p.available !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch {
    return [];
  }
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  const parsed = productSchema.parse(data);
  try {
    await adminCreateDocument(COLLECTIONS.products, {
      ...parsed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof productSchema>
) {
  const parsed = productSchema.parse(data);
  try {
    await adminUpdateDocument(COLLECTIONS.products, id, {
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await adminDeleteDocument(COLLECTIONS.products, id);
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete product" };
  }
}

// Reservations
export async function getReservations() {
  try {
    const result = await adminListDocuments(COLLECTIONS.reservations);
    return result.documents || [];
  } catch {
    return [];
  }
}

export async function createReservation(
  data: z.infer<typeof reservationSchema>
) {
  const parsed = reservationSchema.parse(data);
  try {
    await adminCreateDocument(COLLECTIONS.reservations, {
      ...parsed,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/reservation");
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create reservation" };
  }
}

export async function updateReservationStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) {
  try {
    await adminUpdateDocument(COLLECTIONS.reservations, id, {
      status,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update reservation" };
  }
}

export async function deleteReservation(id: string) {
  try {
    await adminDeleteDocument(COLLECTIONS.reservations, id);
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete reservation" };
  }
}

// Contact
export async function submitContact(data: z.infer<typeof contactSchema>) {
  const parsed = contactSchema.parse(data);
  try {
    await adminCreateDocument("contacts", {
      ...parsed,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit contact form" };
  }
}

// Gallery
export async function getGalleryItems() {
  try {
    const result = await adminListDocuments(COLLECTIONS.gallery);
    return result.documents || [];
  } catch {
    return [];
  }
}

export async function createGalleryItem(
  data: z.infer<typeof gallerySchema>
) {
  const parsed = gallerySchema.parse(data);
  try {
    await adminCreateDocument(COLLECTIONS.gallery, {
      ...parsed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create gallery item" };
  }
}

export async function updateGalleryItem(
  id: string,
  data: z.infer<typeof gallerySchema>
) {
  const parsed = gallerySchema.parse(data);
  try {
    await adminUpdateDocument(COLLECTIONS.gallery, id, {
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update gallery item" };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await adminDeleteDocument(COLLECTIONS.gallery, id);
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete gallery item" };
  }
}

// Testimonials
export async function getTestimonials() {
  try {
    const all = await adminListDocuments(COLLECTIONS.testimonials);
    const docs = all.documents || [];
    return docs
      .filter((t: any) => t.featured === true)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  } catch {
    return [];
  }
}

export async function getAllTestimonials() {
  try {
    const result = await adminListDocuments(COLLECTIONS.testimonials);
    return result.documents || [];
  } catch {
    return [];
  }
}

export async function createTestimonial(
  data: z.infer<typeof testimonialSchema>
) {
  const parsed = testimonialSchema.parse(data);
  try {
    await adminCreateDocument(COLLECTIONS.testimonials, {
      ...parsed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create testimonial" };
  }
}

export async function updateTestimonial(
  id: string,
  data: z.infer<typeof testimonialSchema>
) {
  const parsed = testimonialSchema.parse(data);
  try {
    await adminUpdateDocument(COLLECTIONS.testimonials, id, {
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await adminDeleteDocument(COLLECTIONS.testimonials, id);
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete testimonial" };
  }
}

// Homepage
export async function getHomepageContent() {
  try {
    const result = await adminListDocuments(COLLECTIONS.homepage);
    return result.documents?.[0] || null;
  } catch {
    return null;
  }
}

export async function updateHomepageContent(
  id: string,
  data: z.infer<typeof homepageSchema>
) {
  const parsed = homepageSchema.parse(data);
  try {
    await adminUpdateDocument(COLLECTIONS.homepage, id, {
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update homepage" };
  }
}

// Settings
export async function getSettings() {
  try {
    const result = await adminListDocuments(COLLECTIONS.settings);
    return result.documents?.[0] || null;
  } catch {
    return null;
  }
}

export async function getPublicSettings() {
  try {
    const result = await adminListDocuments(COLLECTIONS.settings);
    if (result.documents?.[0]) {
      const doc = result.documents[0];
      return {
        restaurantName: doc.restaurantName,
        tagline: doc.tagline,
        address: doc.address,
        addressLine2: doc.addressLine2,
        city: doc.city,
        phone: doc.phone,
        instagram: doc.instagram,
        instagramUrl: doc.instagramUrl,
        email: doc.email,
        openingHours: doc.openingHours,
        openingHoursDaily: doc.openingHoursDaily,
        googleMapsUrl: doc.googleMapsUrl,
        whatsapp: doc.whatsapp,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateSettings(
  id: string,
  data: z.infer<typeof settingsSchema>
) {
  const parsed = settingsSchema.parse(data);
  try {
    await adminUpdateDocument(COLLECTIONS.settings, id, {
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update settings" };
  }
}

// Orders
export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: "delivery" | "pickup";
  address?: string;
  paymentMethod: "cash" | "card";
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  totalAmount: number;
  notes?: string;
}) {
  try {
    await adminCreateDocument("orders", {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || "",
      deliveryType: data.deliveryType,
      address: data.address || "",
      paymentMethod: data.paymentMethod,
      items: JSON.stringify(data.items),
      totalAmount: data.totalAmount,
      notes: data.notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create order" };
  }
}

// File upload
export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file provided" };

  try {
    const result = await adminUploadFile(file);
    return { success: true, fileId: result.$id };
  } catch {
    return { success: false, error: "Failed to upload file" };
  }
}

export async function deleteFile(fileId: string) {
  try {
    await adminDeleteFile(fileId);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete file" };
  }
}
