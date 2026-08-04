import type { Metadata } from "next"
import { getArticulos, fetchArticulosFromAPI } from "@/lib/articulos"
import { BlogIndex } from "@/components/blog/blog-index"

// Mismo criterio que /blog/[slug]: se regenera sola para que un artículo nuevo
// aparezca en el listado sin redeploy, sin dejar de ser una página estática.
// Literal por exigencia del análisis estático de Next (ver nota en [slug]/page.tsx).
export const revalidate = 300

export const metadata: Metadata = {
  title: "Blog",
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

export default async function BlogPage() {
  const desdeAPI = await fetchArticulosFromAPI()
  const articulos = desdeAPI.length > 0 ? desdeAPI : getArticulos()
  return <BlogIndex articulos={articulos} />
}
