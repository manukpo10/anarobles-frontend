import type { Metadata } from "next"
import CursosComingSoon from "./_coming-soon"

export const metadata: Metadata = {
  title: "Cursos y Talleres de Arte",
  description:
    "Cursos y talleres de pintura e ilustración guiados por Ana Cecilia Robles. Aprendé técnica y sensibilidad artística desde cualquier nivel.",
  alternates: { canonical: "https://anaceciliarobles.com/cursos" },
}

export default function CursosPage() {
  return <CursosComingSoon />
}
