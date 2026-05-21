import Link from "next/link"
import { ArrowRight, MessageCircle, BookOpen } from "lucide-react"

export function GaleriaCTA() {
  return (
    <section className="section-sm relative overflow-hidden border-t border-border/40 bg-background">
      {/* Subtle orange accent blob — crema bg so it doesn't merge with navy footer */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        {/* Kicker */}
        <span className="kicker">
          ¿Te interesa una obra?
        </span>

        <h2
          className="mt-6 font-serif font-light text-foreground"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          Cada pieza tiene{" "}
          <span className="font-semibold italic text-primary">su historia</span>
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          Si alguna obra te habló, podés escribirme para consultar disponibilidad,
          precio o encargar una pieza original. También podés aprender las técnicas en mis cursos.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contacto"
            className="group inline-flex items-center gap-3 rounded-full bg-secondary px-9 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-accent/20"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contactar a Ana</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/cursos"
            className="group inline-flex items-center gap-3 rounded-full border border-border px-9 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/70 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            <BookOpen className="h-4 w-4" />
            <span>Conocé mis cursos</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
