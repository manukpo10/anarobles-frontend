"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  items: React.ReactNode[]
  /** Items per view: [mobile, tablet, desktop] */
  itemsPerView?: [number, number, number]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function Carousel({
  items,
  itemsPerView = [1, 2, 3],
  autoPlay = false,
  autoPlayInterval = 5000,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerView[2])
  const [isHovered, setIsHovered] = useState(false)

  // Responsive items per view
  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerPage(itemsPerView[0])
      else if (width < 1024) setItemsPerPage(itemsPerView[1])
      else setItemsPerPage(itemsPerView[2])
    }
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [itemsPerView])

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const goTo = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)))
    },
    [totalPages]
  )

  const next = useCallback(() => goTo(currentPage + 1), [currentPage, goTo])
  const prev = useCallback(() => goTo(currentPage - 1), [currentPage, goTo])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isHovered || totalPages <= 1) return
    const id = setInterval(next, autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, isHovered, totalPages, next, autoPlayInterval])

  if (items.length === 0) return null

  const showNav = totalPages > 1
  const isFirst = currentPage === 0
  const isLast = currentPage === totalPages - 1

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel track */}
      <div className="overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8"
            style={{
              gridTemplateColumns: `repeat(${Math.min(itemsPerPage, items.length - currentPage * itemsPerPage)}, 1fr)`,
            }}
          >
            {items
              .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
              .map((item, i) => (
                <div key={currentPage * itemsPerPage + i}>{item}</div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {showNav && (
        <>
          <button
            onClick={prev}
            disabled={isFirst}
            className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border opacity-0 transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary group-hover/section:opacity-100 md:opacity-0 md:group-hover/section:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={isLast}
            className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border opacity-0 transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary group-hover/section:opacity-100 md:opacity-0 md:group-hover/section:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {showNav && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentPage
                  ? "w-8 bg-secondary"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Ir a página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
