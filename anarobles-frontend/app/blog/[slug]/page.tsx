import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getArticulo,
  getArticulos,
  fetchArticulosFromAPI,
  fetchArticuloBySlugFromAPI,
} from "@/lib/articulos"
import type { Articulo } from "@/lib/articulos"
import { ArticuloDetalle } from "@/components/blog/articulo-detalle"
import { JsonLd } from "@/components/seo/json-ld"

const BASE_URL = "https://anaceciliarobles.com"

// El blog es la única sección con una página real por ítem, y esas páginas son
// lo que indexa Google. Por eso acá no sirve el patrón de la galería (fetch en
// el cliente): un artículo publicado desde el panel tiene que existir como
// página con su propio <title>, descripción e imagen social.
//
// ISR resuelve las dos mitades del problema:
//   revalidate    → las páginas ya generadas se refrescan solas tras editarlas,
//                   sin necesidad de un deploy.
//   dynamicParams → un slug que no existía en el build (artículo nuevo) se
//                   renderiza a demanda en la primera visita en vez de dar 404.
// Literal y no BLOG_REVALIDATE_SECONDS: Next analiza estáticamente los exports de
// configuración de segmento y rechaza el build si es un valor importado.
export const revalidate = 300
export const dynamicParams = true

/**
 * Resuelve un artículo priorizando la API y cayendo al array estático. El fallback
 * importa en dos momentos reales: durante el build (el backend en Render free tier
 * puede estar dormido) y si el backend se cae con el sitio ya publicado.
 */
async function resolverArticulo(slug: string): Promise<Articulo | undefined> {
  return (await fetchArticuloBySlugFromAPI(slug)) ?? getArticulo(slug)
}

/**
 * Resuelve los artículos relacionados acá (servidor) en vez de dentro del
 * componente: ArticuloRelacionados vive en el bundle del cliente, y hacerlo así
 * deja los enlaces en el HTML inicial en vez de aparecer recién tras hidratar.
 */
async function resolverRelacionados(slugs: string[] | undefined): Promise<Articulo[]> {
  if (!slugs || slugs.length === 0) return []
  const todos = await fetchArticulosFromAPI()
  const fuente = todos.length > 0 ? todos : getArticulos()
  return slugs
    .map((slug) => fuente.find((a) => a.slug === slug))
    .filter((a): a is Articulo => a !== undefined)
}

export async function generateStaticParams() {
  const desdeAPI = await fetchArticulosFromAPI()
  const fuente = desdeAPI.length > 0 ? desdeAPI : getArticulos()
  return fuente.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const articulo = await resolverArticulo(slug)
  if (!articulo) return {}

  return {
    title: articulo.titulo,
    description: articulo.metaDescripcion ?? articulo.resumen,
    alternates: { canonical: `${BASE_URL}/blog/${articulo.slug}` },
    openGraph: {
      title: articulo.titulo,
      description: articulo.resumen,
      url: `${BASE_URL}/blog/${articulo.slug}`,
      images: [{ url: articulo.imagenDestacada, width: 1200, height: 630, alt: articulo.titulo }],
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
  const articulo = await resolverArticulo(slug)
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
          // Real edit timestamp when it comes from the API; falls back to the
          // publication date for statically-sourced articles, which have none.
          dateModified: articulo.updatedAt ?? articulo.fechaPublicacion,
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
      <ArticuloDetalle articulo={articulo} relacionados={await resolverRelacionados(articulo.relacionados)} />
    </>
  )
}
