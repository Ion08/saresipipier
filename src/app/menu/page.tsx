import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/actions";
import PageLayout from "@/components/layout/page-layout";
import MenuClient from "./menu-client";
import type { Category, Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Meniu",
  description:
    "Meniul Sare și Piper — pizza, preparate din carne, supe, salate, desert. Prețuri corecte, porții honeste. La ieșire din Porumbeni.",
};

export default async function MenuPage() {
  const [rawCategories, rawProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const categories = JSON.parse(JSON.stringify(rawCategories)) as Category[];
  const products = JSON.parse(JSON.stringify(rawProducts)) as Product[];

  return (
    <PageLayout>
      <MenuClient categories={categories} products={products} />
    </PageLayout>
  );
}
