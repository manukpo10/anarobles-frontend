import type { Metadata } from "next"
import { fetchCursoByIdFromAPI } from "@/lib/data"
import { JsonLd } from "@/components/seo/json-ld"
import { CursoDetailClient } from "./_components/curso-detail-client"

const BASE_URL = "https://anaceciliarobles.com"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const curso = await fetchCursoByIdFromAPI(id)

  if (!curso) {
    return { title: "Curso no encontrado" }
  }

  return {
    title: curso.title,
    description: curso.description,
    alternates: {
      canonical: `${BASE_URL}/cursos/${id}`,
    },
    openGraph: {
      title: `${curso.title} | Ana Cecilia Robles`,
      description: curso.description,
      images: [{ url: curso.image, alt: curso.title }],
    },
  }
}

export default async function CursoDetailPage({ params }: Props) {
  const { id } = await params
  const curso = await fetchCursoByIdFromAPI(id)

  return (
    <>
      {curso && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Course",
              name: curso.title,
              description: curso.description,
              image: curso.image?.startsWith("http")
                ? curso.image
                : `${BASE_URL}${curso.image}`,
              provider: {
                "@type": "Organization",
                name: "Ana Cecilia Robles",
                sameAs: BASE_URL,
              },
              offers: {
                "@type": "Offer",
                price: curso.precio,
                priceCurrency: "ARS",
                category: "Paid",
                availability: "https://schema.org/InStock",
                url: `${BASE_URL}/cursos/${id}`,
              },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: "Cursos", item: `${BASE_URL}/cursos` },
                { "@type": "ListItem", position: 3, name: curso.title, item: `${BASE_URL}/cursos/${id}` },
              ],
            }}
          />
        </>
      )}
      <CursoDetailClient id={id} />
    </>
  )
}
