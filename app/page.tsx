import { HeroSection } from "@/components/home/hero-section"
import { PoeticDivider } from "@/components/home/poetic-divider"
import { FeaturedGallery } from "@/components/home/featured-gallery"
import { FeaturedWorks } from "@/components/home/featured-works"
import { ShopPreview } from "@/components/home/shop-preview"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PoeticDivider />
      <FeaturedGallery />
      <FeaturedWorks />
      <ShopPreview />
    </>
  )
}
