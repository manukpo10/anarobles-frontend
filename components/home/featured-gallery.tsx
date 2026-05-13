"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const obras = [
  { id: 1, src: "/galeria/retrato-1.jpeg", title: "Retrato 1" },
  { id: 2, src: "/galeria/retrato-2.jpeg", title: "Retrato 2" },
  { id: 3, src: "/galeria/retrato-3.jpeg", title: "Retrato 3" },
  { id: 4, src: "/galeria/retrato-4.jpeg", title: "Retrato 4" },
  { id: 5, src: "/galeria/retrato-5.jpeg", title: "Retrato 5" },
  { id: 17, src: "/galeria/retrato-6.jpeg", title: "Retrato 6" },
  { id: 6, src: "/galeria/naturaleza-1.jpeg", title: "Naturaleza 1" },
  { id: 7, src: "/galeria/naturaleza-2.jpeg", title: "Naturaleza 2" },
  { id: 8, src: "/galeria/naturaleza-3.jpeg", title: "Naturaleza 3" },
  { id: 9, src: "/galeria/naturaleza-4.jpeg", title: "Naturaleza 4" },
  { id: 10, src: "/galeria/naturaleza-5.jpeg", title: "Naturaleza 5" },
  { id: 11, src: "/galeria/naturaleza-6.jpeg", title: "Naturaleza 6" },
  { id: 12, src: "/galeria/naturaleza-7.jpeg", title: "Naturaleza 7" },
  { id: 13, src: "/galeria/naturaleza-8.jpeg", title: "Naturaleza 8" },
  { id: 14, src: "/galeria/naturaleza-9.jpeg", title: "Naturaleza 9" },
  { id: 15, src: "/galeria/naturaleza-10.jpeg", title: "Naturaleza 10" },
  { id: 16, src: "/galeria/naturaleza-11.jpeg", title: "Naturaleza 11" },
]

export function FeaturedGallery() {
  const [page, setPage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const total = obras.length

  const next = useCallback(() => setPage((p) => (p + 1) % total), [total])
  const prev = useCallback(() => setPage((p) => (p - 1 + total) % total), [total])

  // Auto-play
  useEffect(() => {
    if (isHovered || total <= 1) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [isHovered, total, next])

  const active = obras[page]
  const prevIdx = (page - 1 + total) % total
  const nextIdx = (page + 1) % total

  return (
    <section
      className="group/section bg-background py-28 lg:py-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <motion.span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-secondary">
            <span className="h-px w-12 bg-secondary/60" />
            Galería
            <span className="h-px w-12 bg-secondary/60" />
          </motion.span>
          <motion.h2 className="mt-8 font-serif text-6xl font-light tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Obras{' '}
            <span className="font-semibold text-gradient">Destacadas</span>
          </motion.h2>
        </motion.div>

        {/* Editorial Carousel */}
        <div className="relative mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6"
            >
              {/* Previous preview (desktop only) */}
              <div className="hidden lg:relative lg:block lg:w-[18%]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl opacity-40 transition-all duration-500 hover:opacity-70">
                  <Image
                    src={obras[prevIdx].src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="18vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
                </div>
              </div>

              {/* Active work */}
              <div className="relative w-[85%] md:w-[70%] lg:w-[55%]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-2xl transition-shadow duration-500 hover:shadow-3xl hover:shadow-primary/20">
                  <Image
                    src={active.src}
                    alt={active.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 70vw, 55vw"
                    priority
                  />
                  {/* Gradient at bottom for title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent p-8 pt-20">
                    <motion.h3
                      key={active.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="font-serif text-2xl font-semibold text-primary-foreground drop-shadow-md md:text-3xl"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      key={`p-${active.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-2 text-sm text-primary-foreground/70"
                    >
                      {page + 1} de {total}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Next preview (desktop only) */}
              <div className="hidden lg:relative lg:block lg:w-[18%]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl opacity-40 transition-all duration-500 hover:opacity-70">
                  <Image
                    src={obras[nextIdx].src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="18vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-background/50" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-lg ring-1 ring-border backdrop-blur-sm transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary md:-left-6"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-lg ring-1 ring-border backdrop-blur-sm transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary md:-right-6"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === page
                    ? "w-8 bg-secondary"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Ir a obra ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <Link
            href="/galeria"
            className="group inline-flex items-center gap-4 rounded-full border-2 border-foreground/20 bg-background px-10 py-5 text-sm font-semibold uppercase tracking-wider text-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20"
          >
            Ver galería completa
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
