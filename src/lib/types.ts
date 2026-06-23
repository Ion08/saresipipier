export interface Category {
  $id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  $id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  price: number;
  weight: string;
  category: string;
  featured: boolean;
  new: boolean;
  available: boolean;
  image: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  $id: string;
  name: string;
  phone: string;
  email: string;
  guests: number;
  date: string;
  time: string;
  specialRequests: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  $id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageContent {
  $id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  stats: Stat[];
  featuredTitle: string;
  featuredDescription: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface SiteSettings {
  $id: string;
  restaurantName: string;
  tagline: string;
  address: string;
  addressLine2: string;
  city: string;
  phone: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  openingHours: string;
  openingHoursDaily: string;
  googleMapsUrl: string;
  facebook: string;
  whatsapp: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface Testimonial {
  $id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  $id: string;
  email: string;
  name: string;
}
