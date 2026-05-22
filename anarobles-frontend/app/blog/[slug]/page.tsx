import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticulo, getArticulos } from "@/lib/articulos"
import { ArticuloDetalle } from "@/components/blog/articulo-detalle"

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

  return <ArticuloDetalle articulo={articulo} />
}
