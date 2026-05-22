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

  const naturalAspect = !aspectRatio ? `${obra.imgW} / ${obra.imgH}` : undefined

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
        style={{ aspectRatio: aspectRatio ?? naturalAspect }}
      >
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
        )}

        {/* Image */}
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

        {/* ── Lupa icon — desktop only, fades on hover ── */}
        <div className="absolute right-2.5 top-2.5 hidden h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:opacity-0 md:flex">
          <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>

        {/*
          ── Hover overlay — DESKTOP ONLY ──────────────────────────────────
          Uses hidden/md:flex so it is NEVER in the render tree on mobile.
          Double protection: invisible + opacity-0 as base state on desktop,
          reversed to visible + opacity-100 on group-hover.
          This prevents any stuck-overlay bug on touch devices.
        */}
        <div
          aria-hidden="true"
          className={[
            "absolute inset-0 hidden flex-col items-center justify-center p-5",
            "bg-foreground/82",
            "transition-opacity duration-300",
            // Desktop: invisible + transparent by default, shown on hover
            "md:flex md:invisible md:opacity-0",
            "md:group-hover:visible md:group-hover:opacity-100",
          ].join(" ")}
        >
          {/* Técnica · Año */}
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            {obra.tecnica}&nbsp;·&nbsp;{obra.año}
          </p>

          {/* Title */}
          <h3 className="mt-3 text-center font-serif text-2xl font-semibold leading-tight text-white">
            {obra.titulo}
          </h3>

          {/* Thin orange rule */}
          <div className="mt-3 h-px w-8 bg-primary/70" />

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

      {/* ── Mobile metadata — title + year, always visible below image ── */}
      <div className="px-0.5 pt-2 pb-1 md:hidden">
        <p className="text-sm text-muted-foreground">
          {obra.titulo}
          <span className="mx-1.5 text-muted-foreground/35">·</span>
          {obra.año}
        </p>
      </div>
    </div>
  )
}
