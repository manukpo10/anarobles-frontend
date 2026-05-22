"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, SearchX, ArrowRight } from "lucide-react"
import type { Articulo, CategoriaSlug } from "@/lib/articulos"
import { CATEGORIA_LABELS, formatFecha } from "@/lib/articulos"
import { BlogHeader } from "./blog-header"
import { BlogCard } from "./blog-card"
import { BlogCTA } from "./blog-cta"

interface BlogIndexProps {
  articulos: Articulo[]
}

export function BlogIndex({ articulos }: BlogIndexProps) {
  const [busqueda, setBusqueda] = useState("")
  const [categoriaActiva, setCategoriaActiva] = useState<"todas" | CategoriaSlug>("todas")

  const articulosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return articulos.filter((a) => {
      const matchesCategoria =
        categoriaActiva === "todas" || a.categoria === categoriaActiva
      const matchesBusqueda =
        q === "" ||
        a.titulo.toLowerCase().includes(q) ||
        a.resumen.toLowerCase().includes(q)
      return matchesCategoria && matchesBusqueda
    })
  }, [articulos, busqueda, categoriaActiva])

  // Featured article — first highlighted one in current filter, or just the first
  const featured = articulosFiltrados.find((a) => a.destacado) ?? null
  const rest = featured
    ? articulosFiltrados.filter((a) => a.slug !== featured.slug)
    : articulosFiltrados

  const categorias: Array<"todas" | CategoriaSlug> = [
    "todas",
    "arte-y-tecnica",
    "tutoriales",
    "proceso-creativo",
    "inspiracion",
    "reflexiones",
  ]

  return (
    <>
      <BlogHeader totalArticulos={articulos.length} />

      {/* ── Filter bar ── */}
      <div className="sticky top-[4.5rem] z-30 border-b border-border/40 bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-4 scrollbar-none">

            {/* Category chips */}
            <div className="flex shrink-0 items-center gap-2">
              {categorias.map((cat) => {
                const active = categoriaActiva === cat
                const label = cat === "todas" ? "Todas" : CATEGORIA_LABELS[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={[
                      "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="hidden h-4 w-px shrink-0 bg-border lg:block" aria-hidden="true" />

            {/* Search */}
            <div className="ml-auto shrink-0 flex items-center gap-2 rounded-full bg-muted/60 px-4 py-1.5 border border-transparent focus-within:border-primary/40 transition-colors w-48 lg:w-64">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar artículos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none min-w-0"
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {articulosFiltrados.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <SearchX className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="font-serif text-xl text-muted-foreground">
                No encontramos artículos que coincidan.
              </p>
              <button
                onClick={() => { setBusqueda(""); setCategoriaActiva("todas") }}
                className="mt-6 text-sm font-semibold text-primary hover:underline underline-offset-2 transition-colors"
              >
                Limpiar filtros
              </button>
            </motion.div>
          ) : (
            <>
              {/* Featured article — desktop horizontal card */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group mb-14 hidden md:flex overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5"
                >
                  {/* Image — 40% */}
                  <div className="relative w-[40%] shrink-0 overflow-hidden">
                    <Image
                      src={featured.imagenDestacada}
                      alt={featured.imagenDestacadaAlt}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="40vw"
                    />
                  </div>

                  {/* Content — 60% */}
                  <div className="flex flex-col justify-center gap-4 p-10 lg:p-14">
                    <div className="flex items-center gap-3">
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full px-2.5 py-0.5">
                        {CATEGORIA_LABELS[featured.categoria]}
                      </span>
                      <span className="inline-block rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5">
                        Destacado
                      </span>
                    </div>

                    <h2
                      className="font-serif font-semibold text-foreground leading-tight"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                    >
                      {featured.titulo}
                    </h2>

                    {featured.subtitulo && (
                      <p className="font-serif italic text-muted-foreground text-lg">
                        {featured.subtitulo}
                      </p>
                    )}

                    <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                      {featured.resumen}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground/70">
                        {formatFecha(featured.fechaPublicacion)} · {featured.tiempoLectura} min de lectura
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                        Leer artículo
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Featured as normal card on mobile */}
              {featured && (
                <div className="mb-8 md:hidden">
                  <BlogCard articulo={featured} priority />
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((articulo, index) => (
                    <motion.div
                      key={articulo.slug}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.5,
                        delay: (index % 3) * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <BlogCard articulo={articulo} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BlogCTA />
    </>
  )
}
