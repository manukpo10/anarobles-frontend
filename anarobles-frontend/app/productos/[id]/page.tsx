import type { Metadata } from "next"
import { fetchProductByIdFromAPI } from "@/lib/data"
import { JsonLd } from "@/components/seo/json-ld"
import { ProductDetailClient } from "./_components/product-detail-client"

const BASE_URL = "https://anaceciliarobles.com"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await fetchProductByIdFromAPI(id)

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `${BASE_URL}/productos/${id}`,
    },
    openGraph: {
      title: `${product.name} | Ana Cecilia Robles`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await fetchProductByIdFromAPI(id)

  return (
    <>
      {product && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: product.image?.startsWith("http")
                ? product.image
                : `${BASE_URL}${product.image}`,
              category: product.category || undefined,
              offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "ARS",
                availability: "https://schema.org/InStock",
                url: `${BASE_URL}/productos/${id}`,
              },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Productos", item: `${BASE_URL}/productos` },
                { "@type": "ListItem", position: 3, name: product.name, item: `${BASE_URL}/productos/${id}` },
              ],
            }}
          />
        </>
      )}
      <ProductDetailClient id={id} />
    </>
  )
}
