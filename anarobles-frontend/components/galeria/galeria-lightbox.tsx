"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronLeft, ChevronRight, ChevronUp, MessageCircle, ZoomIn, ZoomOut } from "lucide-react"
import type { Obra } from "@/lib/obras"
import { formatPrice } from "@/lib/utils"

const ZOOM_MIN = 1
const ZOOM_MAX = 4
const ZOOM_STEP = 0.5

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

  // Zoom is a pure CSS transform on a wrapper that occupies exactly the same
  // box the images already did, so layout — and therefore whether the image
  // renders at all — is identical to the un-zoomed state at scale 1.
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const didDrag = useRef(false)
  const isZoomed = zoom > 1

  // Functional update so rapid clicks accumulate instead of each reading the
  // same pre-batch scale.
  const stepZoom = useCallback((delta: number) => {
    setZoom((prev) => {
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + delta))
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }, [])

  const setZoomTo = useCallback((value: number) => {
    setZoom(value)
    if (value === 1) setPan({ x: 0, y: 0 })
  }, [])

  useEffect(() => { setHiResLoaded(false) }, [obra?.id])
  useEffect(() => { setPanelOpen(false) }, [obra?.id])
  useEffect(() => { setZoom(1); setPan({ x: 0, y: 0 }) }, [obra?.id])
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
      if (e.key === "+" || e.key === "=") stepZoom(ZOOM_STEP)
      if (e.key === "-")                  stepZoom(-ZOOM_STEP)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [obra, onClose, onNavegar, stepZoom])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = obra ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [obra])

  // Swipe — suppressed while zoomed in, where a horizontal drag means
  // "pan across the artwork", not "next piece".
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (!isZoomed && Math.abs(delta) > 50) onNavegar(delta < 0 ? "siguiente" : "anterior")
    touchStartX.current = null
  }, [onNavegar, isZoomed])

  // Drag-to-pan (desktop, while zoomed). Bounds come from the dragged
  // element's own rect read inside the event, so there's no measurement
  // effect that can race the lightbox's mount.
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isZoomed) return
    didDrag.current = false
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [isZoomed, pan])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const start = dragStart.current
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true
    const rect = e.currentTarget.getBoundingClientRect()
    const maxX = (rect.width  * (zoom - 1)) / (2 * zoom)
    const maxY = (rect.height * (zoom - 1)) / (2 * zoom)
    setPan({
      x: Math.min(maxX, Math.max(-maxX, start.panX + dx / zoom)),
      y: Math.min(maxY, Math.max(-maxY, start.panY + dy / zoom)),
    })
  }, [zoom])

  const onPointerUp = useCallback(() => { dragStart.current = null }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    stepZoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
  }, [stepZoom])

  if (typeof window === "undefined") return null

  const idx     = obra ? todasLasObras.findIndex((o) => o.slug === obra.slug) : 0
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
          style={{ background: "oklch(0.14 0.05 248 / 0.98)", backdropFilter: "blur(8px)" }}
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
            {/* On desktop this sits over the cream metadata sidebar, so it
                carries its own dark chip — white-on-white otherwise. */}
            <button
              onClick={onClose}
              aria-label="Cerrar lightbox"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-black/60 hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* ── Image area ─────────────────────────────────────────── */}
          <div
            className={[
              "absolute inset-0 flex items-center justify-center overflow-hidden",
              isZoomed ? (dragStart.current ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer",
            ].join(" ")}
            onClick={() => { if (!isZoomed && !didDrag.current) onClose() }}
            onWheel={onWheel}
            onDoubleClick={() => setZoomTo(isZoomed ? 1 : 2)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="relative h-full w-full transition-[padding] duration-300 md:pr-80 lg:pr-96"
              style={{ paddingBottom: isMobile && panelOpen ? "48vh" : undefined }}
            >
              {/* Zoom layer — spans the exact same box the images position
                  themselves against, so at scale 1 nothing about their layout
                  changes. transform is purely visual and never affects it. */}
              <div
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  willChange: isZoomed ? "transform" : undefined,
                }}
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
                  draggable={false}
                  onLoad={() => setHiResLoaded(true)}
                />
              </div>
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

          {/* ── Zoom controls — desktop only (touch devices pinch) ────────
              Anchored to the image area, not the viewport: the metadata
              sidebar owns the right 20/24rem, and anything placed over its
              cream background in the site's white-on-dark control style is
              invisible. Mirrors the offset the "siguiente" arrow already
              uses so both stay clear of the sidebar at the same breakpoints. */}
          <div
            className="absolute bottom-6 z-30 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2 py-1.5 backdrop-blur-sm md:left-[calc((100%-20rem)/2)] md:flex lg:left-[calc((100%-24rem)/2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => stepZoom(-ZOOM_STEP)}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Alejar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-all duration-200 enabled:hover:bg-white/10 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ZoomOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="w-11 text-center font-sans text-xs tabular-nums text-white/60">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => stepZoom(ZOOM_STEP)}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Acercar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-all duration-200 enabled:hover:bg-white/10 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

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
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Precio</dt>
                  <dd className="mt-0.5 font-serif text-lg font-semibold text-primary">
                    {obra.disponibilidad === "consultar" || obra.precio === undefined
                      ? "Consultar"
                      : `$${formatPrice(obra.precio)}`}
                  </dd>
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
