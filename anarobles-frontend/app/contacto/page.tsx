import type { Metadata } from "next"
import ContactPage from "./_page-content"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a Ana Cecilia Robles para encargos personalizados, consultas sobre obras o colaboraciones. Respuesta por WhatsApp y correo.",
  alternates: { canonical: "https://anaceciliarobles.com/contacto" },
  openGraph: {
    title: "Contacto | Ana Cecilia Robles",
    description:
      "Contactá a Ana Cecilia Robles para encargos personalizados, consultas sobre obras o colaboraciones.",
    url: "https://anaceciliarobles.com/contacto",
    images: [{ url: "/sobremi.jpeg", width: 1200, height: 630, alt: "Ana Cecilia Robles — Artista Plástica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Ana Cecilia Robles",
    description: "Encargos, consultas y colaboraciones.",
    images: ["/sobremi.jpeg"],
  },
}

export default function Page() {
  return <ContactPage />
}
