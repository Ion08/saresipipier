import PageLayout from "@/components/layout/page-layout";
import Hero from "@/components/sections/hero";
import FeaturedDishes from "@/components/sections/featured-dishes";
import MapSection from "@/components/sections/map-section";
import { getFeaturedProducts, getGalleryItems } from "@/lib/actions";

export default async function HomePage() {
  const [featured, gallery] = await Promise.all([
    getFeaturedProducts(),
    getGalleryItems(),
  ]);

  return (
    <PageLayout>
      <Hero gallery={gallery as any} />
      <FeaturedDishes products={featured as any} />
      <MapSection />
    </PageLayout>
  );
}
