import type { Metadata } from "next"
import { getArticulos } from "@/lib/articulos"
import { BlogIndex } from "@/components/blog/blog-index"

export const metadata: Metadata = {
  title: "Blog | Ana Cecilia Robles",
  description:
    "Reflexiones sobre arte, técnicas de pintura y proceso creativo. Artículos sobre color, óleo, acuarela y el camino de crear.",
  alternates: { canonical: "https://anaceciliarobles.com/blog" },
  openGraph: {
    title: "Blog | Ana Cecilia Robles",
    description: "Reflexiones sobre arte, técnicas de pintura y proceso creativo.",
    url: "https://anaceciliarobles.com/blog",
    type: "website",
    images: [{ url: "/blog1.jpeg", width: 1200, height: 630, alt: "Blog de arte — Ana Cecilia Robles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Ana Cecilia Robles",
    description: "Reflexiones sobre arte, técnicas de pintura y proceso creativo.",
    images: ["/blog1.jpeg"],
  },
}

export default function BlogPage() {
  const articulos = getArticulos()
  return <BlogIndex articulos={articulos} />
}
