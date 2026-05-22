"use client"

import Image from "next/image"
import Link from "next/link"
import type { Articulo } from "@/lib/articulos"
import { CATEGORIA_LABELS, formatFecha } from "@/lib/articulos"
import { ArticuloContent } from "./articulo-content"
import { ShareButtons } from "./share-buttons"
import { ArticuloRelacionados } from "./articulo-relacionados"
import { BlogCTA } from "./blog-cta"
import { ArrowLeft, User } from "lucide-react"

interface ArticuloDetalleProps {
  articulo: Articulo
}

export function ArticuloDetalle({ articulo }: ArticuloDetalleProps) {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={articulo.imagenDestacada}
          alt={articulo.imagenDestacadaAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-6 z-10 lg:top-8 lg:left-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 lg:px-8 lg:pb-14">
          <div className="mx-auto max-w-4xl">
            {/* Category chip */}
            <span className="inline-block bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full px-3 py-1 backdrop-blur-sm mb-4">
              {CATEGORIA_LABELS[articulo.categoria]}
            </span>

            {/* Title */}
            <h1
              className="font-serif font-light text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              {articulo.titulo}
            </h1>

            {/* Meta */}
            <p className="mt-4 text-sm text-white/60">
              {formatFecha(articulo.fechaPublicacion)}
              {" · "}
              {articulo.tiempoLectura} min de lectura
              {" · "}
              Ana Cecilia Robles
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

            {/* Article column */}
            <div className="min-w-0 flex-1">
              <ArticuloContent contenido={articulo.contenido} />

              {/* Share row */}
              <div className="max-w-[680px] mx-auto px-6 lg:px-0 mt-14 pt-8 border-t border-border/60">
                <ShareButtons titulo={articulo.titulo} slug={articulo.slug} />
              </div>
            </div>

            {/* Aside — sticky, desktop only */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 space-y-8">

                {/* Mini bio */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-foreground text-sm leading-tight">
                        Ana Cecilia Robles
                      </p>
                      <p className="text-xs text-muted-foreground">Artista Plástica</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Artista plástica, docente y apasionada por compartir el proceso creativo.
                  </p>
                  <Link
                    href="/sobre-mi"
                    className="mt-4 inline-flex items-center text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    Conocé a Ana →
                  </Link>
                </div>

                {/* Categories */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Categorías
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "arte-y-tecnica",
                        "tutoriales",
                        "proceso-creativo",
                        "inspiracion",
                        "reflexiones",
                      ] as const
                    ).map((cat) => (
                      <Link
                        key={cat}
                        href={`/blog?categoria=${cat}`}
                        className="inline-block rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-all hover:border-primary hover:text-primary"
                      >
                        {CATEGORIA_LABELS[cat]}
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* Related articles */}
      {articulo.relacionados && articulo.relacionados.length > 0 && (
        <ArticuloRelacionados slugs={articulo.relacionados} />
      )}

      <BlogCTA />
    </>
  )
}
