import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import GaleriaPage from "./_page-content"

export const metadata: Metadata = {
  title: "Galería de Obras",
  description:
    "Galería de obras de Ana Cecilia Robles: retratos en grafito, pastel y acuarela, botánica y acuarelas bordadas. Explorá su trabajo por categoría.",
  alternates: { canonical: "https://anaceciliarobles.com/galeria" },
  openGraph: {
    title: "Galería de Obras | Ana Cecilia Robles",
    description:
      "Galería de obras de Ana Cecilia Robles: retratos en grafito, pastel y acuarela, botánica y acuarelas bordadas.",
    url: "https://anaceciliarobles.com/galeria",
    images: [{ url: "/galeria/abrazo.jpeg", width: 1200, height: 630, alt: "Abrazo — acuarela de Ana Cecilia Robles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galería de Obras | Ana Cecilia Robles",
    description: "Retratos, botánica y acuarelas bordadas.",
    images: ["/galeria/abrazo.jpeg"],
  },
}

const BASE_URL = "https://anaceciliarobles.com"

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ArtGallery",
          name: "Galería de Obras — Ana Cecilia Robles",
          url: `${BASE_URL}/galeria`,
          image: `${BASE_URL}/galeria/abrazo.jpeg`,
          description:
            "Galería de obras originales de Ana Cecilia Robles: retratos en grafito, pastel y acuarela, botánica y acuarelas bordadas.",
          artist: {
            "@type": ["Person", "VisualArtist"],
            name: "Ana Cecilia Robles",
            url: BASE_URL,
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "La Plata",
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Galería", item: `${BASE_URL}/galeria` },
          ],
        }}
      />
      <GaleriaPage />
    </>
  )
}
