import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ro-MD", {
    style: "currency",
    currency: "MDL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function getImageUrl(fileId: string): string {
  if (!fileId) return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80";
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&mode=admin`;
}

export function getOptimizedImageUrl(fileId: string, width = 800): string {
  if (!fileId) return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80";
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}&width=${width}&mode=admin`;
}

export function getImagePreview(fileId: string, width = 400): string {
  if (!fileId) return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80";
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}&width=${width}&height=${Math.round(width * 0.75)}&mode=admin`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  return time;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;

export function isYouTubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url);
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(YOUTUBE_REGEX);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}
