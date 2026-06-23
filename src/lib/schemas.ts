import { z } from "zod";

const phoneRegex = /^[+]?[\d\s()-]{7,}$/;

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  guests: z.coerce
    .number()
    .min(1, "At least 1 guest")
    .max(50, "Maximum 50 guests"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  specialRequests: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  weight: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  featured: z.boolean().default(false),
  new: z.boolean().default(false),
  available: z.boolean().default(true),
  image: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const gallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5),
  avatar: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const homepageSchema = z.object({
  heroTitle: z.string().min(2),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutDescription: z.string().optional(),
  aboutImage: z.string().optional(),
  featuredTitle: z.string().optional(),
  featuredDescription: z.string().optional(),
});

export type HomepageFormData = z.infer<typeof homepageSchema>;

export const settingsSchema = z.object({
  restaurantName: z.string().min(2),
  tagline: z.string().optional(),
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  instagramUrl: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  openingHours: z.string().optional(),
  openingHoursDaily: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
