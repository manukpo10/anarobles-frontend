import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticulo, getArticulos } from "@/lib/articulos"
import { ArticuloDetalle } from "@/components/blog/articulo-detalle"
import { JsonLd } from "@/components/seo/json-ld"

const BASE_URL = "https://anaceciliarobles.com"

export async function generateStaticParams() {
  return getArticulos().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const articulo = getArticulo(slug)
  if (!articulo) return {}

  return {
    title: `${articulo.titulo} | Blog de Ana Cecilia Robles`,
    description: articulo.metaDescripcion ?? articulo.resumen,
    openGraph: {
      title: articulo.titulo,
      description: articulo.resumen,
      images: [articulo.imagenDestacada],
      type: "article",
      publishedTime: articulo.fechaPublicacion,
      authors: ["Ana Cecilia Robles"],
    },
    twitter: {
      card: "summary_large_image",
      title: articulo.titulo,
      description: articulo.resumen,
      images: [articulo.imagenDestacada],
    },
  }
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const articulo = getArticulo(slug)
  if (!articulo) notFound()

  const imagen = articulo.imagenDestacada?.startsWith("http")
    ? articulo.imagenDestacada
    : `${BASE_URL}${articulo.imagenDestacada}`

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: articulo.titulo,
          description: articulo.metaDescripcion ?? articulo.resumen,
          image: imagen,
          datePublished: articulo.fechaPublicacion,
          dateModified: articulo.fechaPublicacion,
          author: { "@type": "Person", name: "Ana Cecilia Robles" },
          publisher: {
            "@type": "Organization",
            name: "Ana Cecilia Robles",
            logo: {
              "@type": "ImageObject",
              url: `${BASE_URL}/logo_transparente.png`,
            },
          },
          mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: articulo.titulo, item: `${BASE_URL}/blog/${slug}` },
          ],
        }}
      />
      <ArticuloDetalle articulo={articulo} />
    </>
  )
}
