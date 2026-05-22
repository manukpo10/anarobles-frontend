import Link from "next/link"
import { ArrowRight, BookOpen, ImageIcon } from "lucide-react"

export function BlogCTA() {
  return (
    <section className="section-sm relative overflow-hidden border-t border-border/40 bg-background">
      {/* Subtle orange accent blob */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        {/* Kicker */}
        <span className="kicker">¿Querés aprender estas técnicas?</span>

        <h2
          className="mt-6 font-serif font-light text-foreground"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          Del blog al{" "}
          <span className="font-semibold italic text-primary">taller real</span>
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          Los conceptos que exploramos en el blog los trabajamos en profundidad en los cursos.
          Con ejercicios, feedback personalizado y materiales paso a paso.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/cursos"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
          >
            <BookOpen className="h-4 w-4" />
            <span>Ver cursos</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/galeria"
            className="group inline-flex items-center gap-3 rounded-full border border-border px-9 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/70 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Ver galería</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
