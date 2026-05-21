"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import type { Obra } from "@/lib/obras"

const DISP: Record<string, { label: string; cls: string }> = {
  disponible: { label: "Disponible", cls: "text-emerald-500" },
  vendida:    { label: "Vendida",    cls: "text-muted-foreground line-through" },
  consultar:  { label: "Consultar", cls: "text-primary" },
}

interface Props {
  obra: Obra | null
  todasLasObras: Obra[]
  onClose: () => void
  onNavegar: (dir: "anterior" | "siguiente") => void
}

export function GaleriaLightbox({ obra, todasLasObras, onClose, onNavegar }: Props) {
  const [hiResLoaded, setHiResLoaded] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => { setHiResLoaded(false) }, [obra?.id])

  // Keyboard
  useEffect(() => {
    if (!obra) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowLeft")  onNavegar("anterior")
      if (e.key === "ArrowRight") onNavegar("siguiente")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [obra, onClose, onNavegar])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = obra ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [obra])

  // Swipe
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) onNavegar(delta < 0 ? "siguiente" : "anterior")
    touchStartX.current = null
  }, [onNavegar])

  if (typeof window === "undefined") return null

  const idx     = obra ? todasLasObras.findIndex((o) => o.id === obra.id) : 0
  const total   = todasLasObras.length
  const disp    = obra ? DISP[obra.disponibilidad] : null
  const isFirst = idx === 0
  const isLast  = idx === total - 1

  return createPortal(
    <AnimatePresence>
      {obra && (
        <motion.div
          key="lb-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100]"
          style={{ background: "oklch(0.14 0.03 220 / 0.98)", backdropFilter: "blur(8px)" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* ── Top bar ────────────────────────────────────────────── */}
          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4">
            <span className="font-sans text-sm tabular-nums text-white/40">
              <span className="font-semibold text-white/90">{idx + 1}</span>
              <span className="mx-1.5 text-white/30">/</span>
              {total}
            </span>
            <button
              onClick={onClose}
              aria-label="Cerrar lightbox"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-200 hover:border-white/50 hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/*
            ── Main layout ─────────────────────────────────────────────
            [image area — fills remaining viewport] | [metadata sidebar]

            The image area is `position: absolute, inset-0` minus the sidebar
            width. The sidebar is `position: absolute, right: 0`.
            This gives the image the maximum possible space without flex tricks.
          */}

          {/* Image area — covers entire viewport minus sidebar on desktop */}
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            style={{ right: "0" }}
            onClick={onClose}  // click on dark area = close
          >
            {/* Blur placeholder */}
            <div className="relative h-full w-full md:pr-80 lg:pr-96">
              <Image
                key={`blur-${obra.id}`}
                src={obra.imagen}
                alt=""
                fill
                className={[
                  "object-contain p-10 transition-all duration-600 md:p-12",
                  hiResLoaded ? "opacity-0" : "opacity-100 blur-xl scale-[1.04]",
                ].join(" ")}
                sizes="20vw"
                quality={8}
                aria-hidden="true"
              />

              {/* Hi-res image */}
              <Image
                key={`hi-${obra.id}`}
                src={obra.imagen}
                alt={`${obra.titulo} — ${obra.tecnica} — ${obra.año}`}
                fill
                className={[
                  "object-contain p-10 transition-opacity duration-500 md:p-12",
                  hiResLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, calc(100vw - 20rem)"
                quality={92}
                priority
                onLoad={() => setHiResLoaded(true)}
              />
            </div>
          </div>

          {/* ── Prev / Next arrows ─────────────────────────────────── */}
          <button
            onClick={() => onNavegar("anterior")}
            disabled={isFirst}
            aria-label="Obra anterior"
            className={[
              "absolute left-4 top-1/2 z-20 -translate-y-1/2 hidden h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 md:flex",
              isFirst
                ? "cursor-not-allowed border-white/8 text-white/15"
                : "border-white/20 text-white/55 hover:border-white/55 hover:bg-white/8 hover:text-white hover:scale-110",
            ].join(" ")}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>

          <button
            onClick={() => onNavegar("siguiente")}
            disabled={isLast}
            aria-label="Obra siguiente"
            className={[
              "absolute top-1/2 z-20 -translate-y-1/2 hidden h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 md:flex",
              // On desktop: offset from right by sidebar width + gap
              "right-[calc(20rem+1rem)] lg:right-[calc(24rem+1rem)]",
              isLast
                ? "cursor-not-allowed border-white/8 text-white/15"
                : "border-white/20 text-white/55 hover:border-white/55 hover:bg-white/8 hover:text-white hover:scale-110",
            ].join(" ")}
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* ── Metadata sidebar ───────────────────────────────────── */}
          <motion.aside
            key={obra.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 right-0 top-0 z-20 flex w-full flex-col justify-between overflow-y-auto border-l border-white/8 bg-background p-6 md:w-80 lg:w-96 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* top spacer for the topbar */}
            <div>
              <div className="h-14" aria-hidden="true" />

              {/* Técnica kicker */}
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-secondary">
                {obra.tecnica}
              </p>

              {/* Title */}
              <h2
                className="mt-3 font-serif font-light leading-tight text-foreground"
                style={{ fontSize: "clamp(1.4rem, 2vw, 2.1rem)" }}
              >
                {obra.titulo}
              </h2>

              {/* Orange rule */}
              <div className="mt-4 h-px w-8 bg-primary" />

              {/* Meta fields */}
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Año</dt>
                  <dd className="mt-0.5 text-sm text-foreground">{obra.año}</dd>
                </div>
                {obra.dimensiones && (
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Dimensiones</dt>
                    <dd className="mt-0.5 text-sm text-foreground">{obra.dimensiones}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Disponibilidad</dt>
                  <dd className={`mt-0.5 text-sm font-semibold ${disp?.cls ?? ""}`}>{disp?.label}</dd>
                </div>
              </dl>

              {obra.descripcion && (
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {obra.descripcion}
                </p>
              )}
            </div>

            {/* CTA */}
            {obra.disponibilidad !== "vendida" && (
              <Link
                href={`/contacto?obra=${obra.slug}`}
                onClick={onClose}
                className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-secondary px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-accent/20"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Consultar esta obra</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            )}

            {/* Mobile swipe hint */}
            <p className="mt-4 text-center text-xs text-muted-foreground/40 md:hidden">
              ← deslizá para navegar →
            </p>
          </motion.aside>

        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
