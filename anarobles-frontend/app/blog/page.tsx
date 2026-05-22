import type { Metadata } from "next"
import { getArticulos } from "@/lib/articulos"
import { BlogIndex } from "@/components/blog/blog-index"

export const metadata: Metadata = {
  title: "Blog | Ana Cecilia Robles",
  description:
    "Reflexiones sobre arte, técnicas de pintura y proceso creativo. Artículos sobre color, óleo, acuarela y el camino de crear.",
  openGraph: {
    title: "Blog | Ana Cecilia Robles",
    description: "Reflexiones sobre arte, técnicas de pintura y proceso creativo.",
    type: "website",
  },
}

export default function BlogPage() {
  const articulos = getArticulos()
  return <BlogIndex articulos={articulos} />
}
