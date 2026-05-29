"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight, ChevronUp, MessageCircle } from "lucide-react"
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
  const [panelOpen, setPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => { setHiResLoaded(false) }, [obra?.id])
  useEffect(() => { setPanelOpen(false) }, [obra?.id])
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

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

          {/* ── Image area ─────────────────────────────────────────── */}
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            onClick={onClose}
          >
            <div
              className="relative h-full w-full transition-[padding] duration-300 md:pr-80 lg:pr-96"
              style={{ paddingBottom: isMobile && panelOpen ? "48vh" : undefined }}
            >
              {/* Blur placeholder */}
              <Image
                key={`blur-${obra.id}`}
                src={obra.imagen}
                alt=""
                fill
                className={[
                  "object-contain p-4 transition-all duration-600 md:p-10 lg:p-12",
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
                  "object-contain p-4 transition-opacity duration-500 md:p-10 lg:p-12",
                  hiResLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
                sizes="(max-width: 768px) 100vw, calc(100vw - 20rem)"
                quality={92}
                priority
                onLoad={() => setHiResLoaded(true)}
              />
            </div>
          </div>

          {/* ── Arrows ─────────────────────────────────────────────── */}
          <button
            onClick={(e) => { e.stopPropagation(); onNavegar("anterior") }}
            disabled={isFirst}
            aria-label="Obra anterior"
            className={[
              "absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 md:left-4 md:h-12 md:w-12",
              isFirst
                ? "cursor-not-allowed border-white/8 text-white/15"
                : "border-white/20 text-white/55 hover:border-white/55 hover:bg-white/8 hover:text-white hover:scale-110",
            ].join(" ")}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNavegar("siguiente") }}
            disabled={isLast}
            aria-label="Obra siguiente"
            className={[
              "absolute top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 md:h-12 md:w-12",
              "right-3 md:right-[calc(20rem+1rem)] lg:right-[calc(24rem+1rem)]",
              isLast
                ? "cursor-not-allowed border-white/8 text-white/15"
                : "border-white/20 text-white/55 hover:border-white/55 hover:bg-white/8 hover:text-white hover:scale-110",
            ].join(" ")}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
          </button>

          {/* ── Info toggle button — mobile only, shown when panel is closed ── */}
          <AnimatePresence>
            {isMobile && !panelOpen && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => { e.stopPropagation(); setPanelOpen(true) }}
                className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-sm"
              >
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
                Ver info
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Metadata sidebar / bottom sheet ────────────────────── */}
          <motion.aside
            key={obra.id}
            initial={{ opacity: 0, y: isMobile ? "100%" : 24 }}
            animate={{ opacity: 1, y: isMobile && !panelOpen ? "100%" : 0 }}
            exit={{ opacity: 0, y: isMobile ? "100%" : 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 z-20 flex h-[48vh] flex-col gap-4 overflow-y-auto rounded-t-2xl border-t border-white/8 bg-[oklch(0.98_0.012_60)] p-6 md:left-auto md:top-0 md:h-auto md:justify-between md:gap-0 md:rounded-none md:border-l md:border-t-0 lg:w-96 lg:p-8 md:w-80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle — tap to close panel on mobile */}
            <button
              onClick={() => setPanelOpen(false)}
              className="mb-2 flex w-full justify-center md:hidden"
              aria-label="Cerrar información"
            >
              <div className="h-1 w-10 rounded-full bg-foreground/15" />
            </button>

            <div>
              <div className="hidden h-14 md:block" aria-hidden="true" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-secondary">
                {obra.tecnica}
              </p>
              <h2
                className="mt-3 font-serif font-light leading-tight text-foreground"
                style={{ fontSize: "clamp(1.4rem, 2vw, 2.1rem)" }}
              >
                {obra.titulo}
              </h2>
              <div className="mt-4 h-px w-8 bg-primary" />

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

            {obra.disponibilidad !== "vendida" && (
              <Link
                href={`/contacto?obra=${obra.slug}`}
                onClick={onClose}
                className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-accent/20"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Consultar esta obra</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            )}
          </motion.aside>

        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
