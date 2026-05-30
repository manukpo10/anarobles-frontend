import type { Metadata } from "next"
import ProductosComingSoon from "./_coming-soon"

export const metadata: Metadata = {
  title: "Tienda de Arte",
  description:
    "Obras, ilustraciones y productos originales de Ana Cecilia Robles. Llevá el arte de la artista a tu espacio.",
  alternates: { canonical: "https://anaceciliarobles.com/productos" },
}

export default function ProductosPage() {
  return <ProductosComingSoon />
}
