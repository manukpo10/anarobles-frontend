"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import type { Obra } from "@/lib/obras"

interface ObraCardProps {
  obra: Obra
  onClick: (obra: Obra) => void
  /** Fixed aspect ratio string (e.g. "4/3") — for curated grid cells */
  aspectRatio?: string
  className?: string
  priority?: boolean
}

export function ObraCard({
  obra,
  onClick,
  aspectRatio,
  className = "",
  priority = false,
}: ObraCardProps) {
  const [loaded, setLoaded] = useState(false)

  // For masonry: derive aspect ratio from real image dimensions
  const naturalAspect = !aspectRatio
    ? `${obra.imgW} / ${obra.imgH}`
    : undefined

  return (
    <div
      className={`group cursor-pointer ${className}`}
      onClick={() => onClick(obra)}
      role="button"
      tabIndex={0}
      aria-label={`Ver ${obra.titulo}`}
      onKeyDown={(e) => e.key === "Enter" && onClick(obra)}
    >
      {/* ── Image + overlay ── */}
      <div
        className="relative w-full overflow-hidden bg-muted"
        style={{
          aspectRatio: aspectRatio ?? naturalAspect,
        }}
      >
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
        )}

        {/* Image — always fill so aspect ratio controls the shape */}
        <Image
          src={obra.imagen}
          alt={`${obra.titulo} — ${obra.tecnica} — ${obra.año}`}
          fill
          className={[
            "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            loaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onLoad={() => setLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />

        {/* ── Lupa icon — always visible, subtle ── */}
        <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/0 group-hover:opacity-0">
          <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>

        {/* ── Hover overlay — navy fill + centered metadata ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/82 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-white/55">
            {obra.tecnica}&nbsp;·&nbsp;{obra.año}
          </p>
          <h3
            className="mt-2.5 text-center font-serif font-semibold leading-snug text-white"
            style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)" }}
          >
            {obra.titulo}
          </h3>
          {/* Disponibilidad badge */}
          {obra.disponibilidad === "disponible" && (
            <span className="mt-3 rounded-full border border-emerald-400/40 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-emerald-300">
              Disponible
            </span>
          )}
          {obra.disponibilidad === "consultar" && (
            <span className="mt-3 rounded-full border border-primary/50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-primary">
              Consultar
            </span>
          )}
          {obra.disponibilidad === "vendida" && (
            <span className="mt-3 rounded-full border border-white/20 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/35 line-through">
              Vendida
            </span>
          )}
        </div>
      </div>

      {/* ── Mobile metadata — title + year, no hover ── */}
      <div className="px-0.5 pt-2 pb-1 lg:hidden">
        <p className="text-sm text-muted-foreground">
          {obra.titulo}
          <span className="mx-1.5 text-muted-foreground/35">·</span>
          {obra.año}
        </p>
      </div>
    </div>
  )
}
