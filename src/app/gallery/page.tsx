import type { Metadata } from "next";
import { getGalleryItems } from "@/lib/actions";
import PageLayout from "@/components/layout/page-layout";
import GalleryClient from "./gallery-client";
import type { GalleryItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Explorați galeria foto Sare și Piper. Imagini cu preparatele noastre, ambientul restaurantului și evenimente speciale.",
};

export default async function GalleryPage() {
  const rawItems = await getGalleryItems();
  const items = JSON.parse(JSON.stringify(rawItems)) as GalleryItem[];

  return (
    <PageLayout>
      <GalleryClient items={items} />
    </PageLayout>
  );
}
