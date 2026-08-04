"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { obras as obrasEstaticas, fetchObrasFromAPI } from "@/lib/obras"
import type { Obra, Categoria } from "@/lib/obras"
import { GaleriaHeader }       from "@/components/galeria/galeria-header"
import { GaleriaFiltros }      from "@/components/galeria/galeria-filtros"
import { GaleriaGridRetratos } from "@/components/galeria/galeria-grid-retratos"
import { GaleriaGridMasonry }  from "@/components/galeria/galeria-grid-masonry"
import { GaleriaLightbox }     from "@/components/galeria/galeria-lightbox"
import { GaleriaCTA }          from "@/components/galeria/galeria-cta"

// Descripción corta por sección — reemplazar con texto real de Ana
const SECCION: Record<string, { label: string; desc: string }> = {
  retratos:   { label: "Retratos",   desc: "Estudios del rostro en grafito, pastel y acuarela" },
  naturaleza: { label: "Naturaleza", desc: "Botánica, acuarelas bordadas y estudios de flora" },
}

export default function GaleriaPage() {
  // ── Data source ──────────────────────────────────────────────────────
  // Start with the static fallback so first paint never shows an empty
  // gallery, then swap to the API result client-side if it succeeds and
  // returns at least one obra.
  const [todasLasObras, setTodasLasObras] = useState<Obra[]>(obrasEstaticas)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const apiObras = await fetchObrasFromAPI()
      if (!cancelled && apiObras.length > 0) {
        setTodasLasObras(apiObras)
        // If the lightbox is open on a statically-sourced obra when this swap
        // happens, re-point it to its API-sourced counterpart by slug (the one
        // identifier stable across both sources — static `id`s and API `id`s
        // use different formats) so index math below doesn't desync.
        setObraActiva((prev) => (prev ? apiObras.find((o) => o.slug === prev.slug) ?? prev : prev))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // ── Filters ──────────────────────────────────────────────────────────
  const [categoriaActiva, setCategoriaActiva] = useState<"todas" | Categoria>("todas")
  const [añoActivo, setAñoActivo]             = useState<number | null>(null)

  // ── Lightbox ─────────────────────────────────────────────────────────
  const [obraActiva, setObraActiva] = useState<Obra | null>(null)

  const abrirLightbox  = useCallback((obra: Obra) => setObraActiva(obra), [])
  const cerrarLightbox = useCallback(() => setObraActiva(null), [])

  const navegarLightbox = useCallback(
    (dir: "anterior" | "siguiente") => {
      if (!obraActiva) return
      const idx  = todasLasObras.findIndex((o) => o.slug === obraActiva.slug)
      const next = dir === "anterior"
        ? (idx - 1 + todasLasObras.length) % todasLasObras.length
        : (idx + 1) % todasLasObras.length
      setObraActiva(todasLasObras[next])
    },
    [obraActiva, todasLasObras],
  )

  // ── Filtered obras ────────────────────────────────────────────────────
  // Derived from the live obras state (not the static-only getCategorias()
  // helper) so a brand-new categoría added from the admin panel still gets
  // its own section instead of silently disappearing from the page.
  const categorias = useMemo(
    () => Array.from(new Set(todasLasObras.map((o) => o.categoria))),
    [todasLasObras],
  )

  // Same reasoning as `categorias` above — derived from live data so a new
  // año introduced by an admin-added obra still gets its own filter chip.
  const años = useMemo(
    () => Array.from(new Set(todasLasObras.map((o) => o.año))).sort((a, b) => b - a),
    [todasLasObras],
  )

  const obrasFiltradas = useMemo(() => {
    const activeCats: Categoria[] =
      categoriaActiva === "todas" ? categorias : [categoriaActiva]

    return activeCats.reduce<Record<Categoria, Obra[]>>((acc, cat) => {
      acc[cat] = todasLasObras.filter(
        (o) => o.categoria === cat && (añoActivo === null || o.año === añoActivo),
      )
      return acc
    }, {} as Record<Categoria, Obra[]>)
  }, [categoriaActiva, añoActivo, categorias, todasLasObras])

  const totalFiltradas   = Object.values(obrasFiltradas).reduce((s, a) => s + a.length, 0)
  const hayResultados    = totalFiltradas > 0
  const filtrosActivos   = categoriaActiva !== "todas" || añoActivo !== null

  return (
    <div className="min-h-screen bg-background">
      <GaleriaHeader />

      <GaleriaFiltros
        categorias={categorias}
        años={años}
        categoriaActiva={categoriaActiva}
        añoActivo={añoActivo}
        onCategoria={setCategoriaActiva}
        onAño={setAñoActivo}
      />

      {/* ── Filtro feedback bar ────────────────────────────────────── */}
      <AnimatePresence>
        {filtrosActivos && (
          <motion.div
            key="filter-bar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/30 bg-muted/40"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 lg:px-8">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{totalFiltradas}</span>
                {" "}obra{totalFiltradas !== 1 ? "s" : ""} encontrada{totalFiltradas !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => { setCategoriaActiva("todas"); setAñoActivo(null) }}
                className="text-xs font-medium text-secondary underline-offset-2 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-18">
        <AnimatePresence mode="wait">
          {!hayResultados ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center"
            >
              <p className="font-serif text-2xl text-muted-foreground">
                No hay obras con esos filtros.
              </p>
              <button
                onClick={() => { setCategoriaActiva("todas"); setAñoActivo(null) }}
                className="text-sm font-medium text-secondary underline-offset-2 hover:underline"
              >
                Limpiar filtros
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-16 lg:space-y-20"
            >
              {categorias.map((cat) => {
                const catObras = obrasFiltradas[cat]
                if (!catObras || catObras.length === 0) return null
                const sec = SECCION[cat]

                return (
                  <section key={cat}>
                    {/* Section heading — no duplicate kicker */}
                    <div className="mb-8 flex items-end justify-between gap-8">
                      <div>
                        <h2
                          className="font-serif font-light text-foreground"
                          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                        >
                          {sec?.label ?? cat}
                        </h2>
                        {sec?.desc && (
                          <p className="mt-2 text-lg text-muted-foreground">
                            {sec.desc}
                          </p>
                        )}
                      </div>
                      <span className="hidden shrink-0 font-serif text-sm tabular-nums text-muted-foreground/60 lg:block">
                        {String(catObras.length).padStart(2, "0")} obras
                      </span>
                    </div>

                    <GaleriaGridRetratos obras={catObras} onObraClick={abrirLightbox} />
                  </section>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <GaleriaCTA />

      <GaleriaLightbox
        obra={obraActiva}
        todasLasObras={todasLasObras}
        onClose={cerrarLightbox}
        onNavegar={navegarLightbox}
      />
    </div>
  )
}
