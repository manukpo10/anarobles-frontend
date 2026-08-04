import { MetadataRoute } from "next"
import { getProducts, getCursos } from "@/lib/data"
import { getArticulos, fetchArticulosFromAPI } from "@/lib/articulos"

// El sitemap se regenera junto con el blog: si un artículo publicado desde el
// panel no entra acá, Google no tiene cómo descubrirlo.
// Literal por exigencia del análisis estático de Next (ver nota en blog/[slug]/page.tsx).
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anaceciliarobles.com"

  // Stable content-revision date. Bump this when site content meaningfully
  // changes — do NOT use new Date(), which falsely reports "updated now" on
  // every deploy and erodes Google's trust in lastModified.
  const lastContentUpdate = "2026-05-29"

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastContentUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: lastContentUpdate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: lastContentUpdate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cursos`,
      lastModified: lastContentUpdate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: lastContentUpdate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: lastContentUpdate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // Product routes
  const productos = getProducts()
  const productRoutes: MetadataRoute.Sitemap = productos.map((product) => ({
    url: `${baseUrl}/productos/${product.id}`,
    lastModified: lastContentUpdate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Course routes
  const cursos = getCursos()
  const cursoRoutes: MetadataRoute.Sitemap = cursos.map((curso) => ({
    url: `${baseUrl}/cursos/${curso.id}`,
    lastModified: lastContentUpdate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Blog article routes — desde la API, con el array estático como respaldo si
  // el backend no responde durante el build.
  const desdeAPI = await fetchArticulosFromAPI()
  const articulos = desdeAPI.length > 0 ? desdeAPI : getArticulos()
  const blogRoutes: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    // updatedAt refleja la última edición real; la fecha de publicación es el
    // respaldo para los artículos que vienen del array estático.
    lastModified: new Date(a.updatedAt ?? a.fechaPublicacion),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Blog index
  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: lastContentUpdate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]

  return [...staticRoutes, ...productRoutes, ...cursoRoutes, ...blogIndex, ...blogRoutes]
}