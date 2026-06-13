import type { Metadata } from "next"
import CursosComingSoon from "./_coming-soon"

export const metadata: Metadata = {
  title: "Cursos y Talleres de Arte",
  description:
    "Cursos y talleres de pintura e ilustración guiados por Ana Cecilia Robles. Aprendé técnica y sensibilidad artística desde cualquier nivel.",
  alternates: { canonical: "https://anaceciliarobles.com/cursos" },
  openGraph: {
    title: "Cursos y Talleres | Ana Cecilia Robles",
    description:
      "Cursos y talleres de pintura e ilustración guiados por Ana Cecilia Robles. Aprendé técnica y sensibilidad artística desde cualquier nivel.",
    url: "https://anaceciliarobles.com/cursos",
    images: [{ url: "/artista3.jpeg", width: 1200, height: 630, alt: "Ana Cecilia Robles — Artista y docente" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursos y Talleres | Ana Cecilia Robles",
    description: "Cursos de pintura e ilustración desde cualquier nivel.",
    images: ["/artista3.jpeg"],
  },
}

export default function CursosPage() {
  return <CursosComingSoon />
}
