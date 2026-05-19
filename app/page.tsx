import { HeroSection } from "@/components/home/hero-section"
import { AboutIntro } from "@/components/home/about-intro"
import { FeaturedGallery } from "@/components/home/featured-gallery"
import { CoursesPreview } from "@/components/home/courses-preview"
import { ProcessSection } from "@/components/home/process-section"
import { BlogPreview } from "@/components/home/blog-preview"
import { Testimonials } from "@/components/home/testimonials"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { InstagramFeed } from "@/components/home/instagram-feed"
import { ShopPreview } from "@/components/home/shop-preview"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutIntro />
      <FeaturedGallery />
      <CoursesPreview />
      <ProcessSection />
      <BlogPreview />
      <Testimonials />
      <NewsletterSection />
      <InstagramFeed />
      <ShopPreview />
    </>
  )
}
