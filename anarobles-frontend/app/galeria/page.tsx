import type { Metadata } from "next"
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

export default function Page() {
  return <GaleriaPage />
}
