export const COLLECTIONS = {
  categories: "categories",
  products: "products",
  reservations: "reservations",
  gallery: "gallery",
  homepage: "homepage",
  settings: "settings",
  testimonials: "testimonials",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
