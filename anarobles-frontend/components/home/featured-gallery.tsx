"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { obras as todasLasObras } from "@/lib/obras"

// Use real obras from the data source — titles, images, técnica
const obras = todasLasObras.map((o) => ({
  id:     o.id,
  src:    o.imagen,
  title:  o.titulo,
  tecnica: o.tecnica,
}))

const pad = (n: number) => String(n).padStart(2, "0")

export function FeaturedGallery() {
  const [page, setPage]           = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const total = obras.length

  const next = useCallback(() => setPage((p) => (p + 1) % total), [total])
  const prev = useCallback(() => setPage((p) => (p - 1 + total) % total), [total])

  useEffect(() => {
    if (isHovered || total <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [isHovered, total, next])

  const active  = obras[page]
  const prevIdx = (page - 1 + total) % total
  const nextIdx = (page + 1) % total

  return (
    <section
      className="section-lg bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="kicker">Galería</span>
          <h2
            className="mt-6 font-serif font-light tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
          >
            Obras <span className="font-bold text-gradient">Destacadas</span>
          </h2>
        </motion.div>

        {/* Carousel — proportions 1 : 2.5 : 1 on desktop */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center gap-4 lg:gap-6"
            >
              {/* Prev thumbnail — desktop only */}
              <div
                className="hidden lg:block shrink-0"
                style={{ width: "clamp(150px, 15vw, 220px)" }}
              >
                <button
                  onClick={prev}
                  aria-label="Obra anterior"
                  className="group w-full focus-visible:outline-none"
                >
                  <div
                    className="relative w-full overflow-hidden rounded-xl opacity-60 transition-opacity duration-400 group-hover:opacity-80"
                    style={{ aspectRatio: "4/5" }}
                  >
                    <Image
                      src={obras[prevIdx].src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
                  </div>
                </button>
              </div>

              {/* Active image — dominates */}
              <div
                className="shrink-0 w-[88vw] sm:w-[72vw]"
                style={{ maxWidth: "780px" }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-2xl bg-muted shadow-float"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={active.src}
                    alt={active.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 72vw, 640px"
                    priority
                  />
                  {/* Bottom caption bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-7 pb-7 pt-20">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                        {active.tecnica}
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-semibold text-white md:text-2xl">
                        {active.title}
                      </h3>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Next thumbnail — desktop only */}
              <div
                className="hidden lg:block shrink-0"
                style={{ width: "clamp(150px, 15vw, 220px)" }}
              >
                <button
                  onClick={next}
                  aria-label="Obra siguiente"
                  className="group w-full focus-visible:outline-none"
                >
                  <div
                    className="relative w-full overflow-hidden rounded-xl opacity-60 transition-opacity duration-400 group-hover:opacity-80"
                    style={{ aspectRatio: "4/5" }}
                  >
                    <Image
                      src={obras[nextIdx].src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-background/50 via-transparent to-transparent" />
                  </div>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile arrows — always visible, flanking the image */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-card backdrop-blur-sm transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground lg:hidden"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-card backdrop-blur-sm transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground lg:hidden"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Controls row: arrows + typographic counter */}
        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              onClick={prev}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-serif text-sm tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">{pad(page + 1)}</span>
              <span className="mx-2 text-border">/</span>
              {pad(total)}
            </span>

            <button
              onClick={next}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <Link href="/galeria" className="group btn-ghost">
            Ver galería completa
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
