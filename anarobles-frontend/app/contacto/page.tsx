import type { Metadata } from "next"
import ContactPage from "./_page-content"

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a Ana Cecilia Robles para encargos personalizados, consultas sobre obras o colaboraciones. Respuesta por WhatsApp y correo.",
  alternates: { canonical: "https://anaceciliarobles.com/contacto" },
}

export default function Page() {
  return <ContactPage />
}
