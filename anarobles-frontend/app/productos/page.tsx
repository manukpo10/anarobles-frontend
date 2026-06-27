import type { Metadata } from "next"
import ProductosComingSoon from "./_coming-soon"

export const metadata: Metadata = {
  title: "Tienda de Arte",
  description:
    "Obras, ilustraciones y productos originales de Ana Cecilia Robles. Llevá el arte de la artista a tu espacio.",
  alternates: { canonical: "https://anaceciliarobles.com/productos" },
  openGraph: {
    title: "Tienda de Arte | Ana Cecilia Robles",
    description:
      "Obras, ilustraciones y productos originales de Ana Cecilia Robles. Llevá el arte de la artista a tu espacio.",
    url: "https://anaceciliarobles.com/productos",
    images: [{ url: "/galeria/lavandas.jpg", width: 1200, height: 630, alt: "Lavandas — acuarela bordada de Ana Cecilia Robles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda de Arte | Ana Cecilia Robles",
    description: "Obras y productos originales de Ana Cecilia Robles.",
    images: ["/galeria/lavandas.jpg"],
  },
  robots: { index: false, follow: false },
}

export default function ProductosPage() {
  return <ProductosComingSoon />
}
