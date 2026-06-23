import PageLayout from "@/components/layout/page-layout";
import Hero from "@/components/sections/hero";
import MenuCategories from "@/components/sections/menu-categories";
import FeaturedDishes from "@/components/sections/featured-dishes";
import MapSection from "@/components/sections/map-section";
import { getFeaturedProducts, getCategories } from "@/lib/actions";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <PageLayout>
      <Hero products={featured as any} />
      <MenuCategories categories={categories as any} />
      <FeaturedDishes products={featured as any} />
      <MapSection />
    </PageLayout>
  );
}
