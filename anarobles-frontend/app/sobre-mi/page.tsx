import type { Metadata } from "next"
import SobreMiPage from "./_page-content"

export const metadata: Metadata = {
  title: "Sobre Mí — La Artista",
  description:
    "Conocé a Ana Cecilia Robles: artista visual de La Plata especializada en acuarela, dibujo y técnica textil. Más de 15 años explorando lo floral, el retrato y lo bordado.",
  alternates: { canonical: "https://anaceciliarobles.com/sobre-mi" },
  openGraph: {
    title: "Sobre Mí | Ana Cecilia Robles",
    description:
      "Conocé a Ana Cecilia Robles: artista visual de La Plata especializada en acuarela, dibujo y técnica textil. Más de 15 años explorando lo floral, el retrato y lo bordado.",
    url: "https://anaceciliarobles.com/sobre-mi",
    images: [
      {
        url: "/sobremi.jpeg",
        width: 1200,
        height: 630,
        alt: "Ana Cecilia Robles — Artista Plástica, La Plata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Mí | Ana Cecilia Robles",
    description:
      "Artista visual de La Plata especializada en acuarela, dibujo y técnica textil.",
    images: ["/sobremi.jpeg"],
  },
}

export default function Page() {
  return <SobreMiPage />
}
