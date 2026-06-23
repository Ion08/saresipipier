import PageLayout from "@/components/layout/page-layout";
import Hero from "@/components/sections/hero";
import FeaturedDishes from "@/components/sections/featured-dishes";
import MapSection from "@/components/sections/map-section";
import { getFeaturedProducts } from "@/lib/actions";

export default async function HomePage() {
  const [featured] = await Promise.all([
    getFeaturedProducts(),
  ]);

  return (
    <PageLayout>
      <Hero products={featured as any} />
      <FeaturedDishes products={featured as any} />
      <MapSection />
    </PageLayout>
  );
}
