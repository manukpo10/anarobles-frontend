import type { Metadata } from "next"
import GaleriaPage from "./_page-content"

export const metadata: Metadata = {
  title: "Galería de Obras",
  description:
    "Galería de obras de Ana Cecilia Robles: retratos en grafito, pastel y acuarela, botánica y acuarelas bordadas. Explorá su trabajo por categoría.",
  alternates: { canonical: "https://anaceciliarobles.com/galeria" },
}

export default function Page() {
  return <GaleriaPage />
}
