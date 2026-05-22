import { MetadataRoute } from "next"
import { getProducts, getCursos } from "@/lib/data"
import { getArticulos } from "@/lib/articulos"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://anaceciliarobles.com"

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cursos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // Product routes
  const productos = getProducts()
  const productRoutes: MetadataRoute.Sitemap = productos.map((product) => ({
    url: `${baseUrl}/productos/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Course routes
  const cursos = getCursos()
  const cursoRoutes: MetadataRoute.Sitemap = cursos.map((curso) => ({
    url: `${baseUrl}/cursos/${curso.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Blog article routes
  const articulos = getArticulos()
  const blogRoutes: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: new Date(a.fechaPublicacion),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Blog index
  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]

  return [...staticRoutes, ...productRoutes, ...cursoRoutes, ...blogIndex, ...blogRoutes]
}