"use client"

import { Palette } from "lucide-react"
import Link from "next/link"
import { CursosHeader } from "@/components/cursos/cursos-header"

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-background">
      <CursosHeader />

      <section className="bg-background py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-2xl bg-card border border-border shadow-sm p-10 lg:p-14">
            <p className="text-base leading-relaxed text-foreground">
              Estamos preparando una experiencia de aprendizaje única para vos.
              Cursos guiados por Ana Cecilia, con el mismo cariño y dedicación que ponemos en cada obra.
            </p>

            <p className="mt-4 text-base text-muted-foreground">
              Mientras tanto, conocé mis obras en la galería o escribime para más información.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/galeria"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-medium transition-colors"
              >
                <Palette className="h-4 w-4" />
                Ver la galería
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border border-border rounded-full px-8 py-3 font-medium text-foreground hover:bg-muted transition-colors"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
