"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import { getFeaturedProducts, type Product } from "@/lib/data"
import { formatPrice } from "@/lib/utils"

export function ShopPreview() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [page, setPage]    = useState(0)
  const [perPage, setPerPage] = useState(3)

  useEffect(() => {
    setFeaturedProducts(getFeaturedProducts().slice(0, 6))
  }, [])

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 640)  setPerPage(1)
      else if (w < 1024) setPerPage(2)
      else setPerPage(3)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const totalPages = Math.ceil(featuredProducts.length / perPage)
  const goTo = useCallback(
    (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))),
    [totalPages],
  )

  if (featuredProducts.length === 0) return null

  const visible = featuredProducts.slice(page * perPage, (page + 1) * perPage)

  return (
    <section className="section-lg relative bg-muted/25">
      {/* fixed: section now has relative so the decorative blob doesn't escape */}
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <span className="kicker">Productos</span>
          <h2
            className="mt-6 font-serif font-light tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Productos <span className="font-bold text-gradient">Destacados</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Piezas exclusivas que transforman cualquier espacio en una galería.
            Encontrá la obra que resuene con tu historia.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6"
              style={{ gridTemplateColumns: `repeat(${perPage}, 1fr)` }}
            >
              {visible.map((product) => (
                <Link key={product.id} href={`/productos/${product.id}`} className="group block">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-card transition-shadow duration-300 group-hover:shadow-hover"
                  >
                    <Image
                      src={product.image}
                      alt={`${product.name} — ${product.category} — Obra de Ana Cecilia Robles`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Badges on hover */}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    {/* Info on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <h3 className="font-serif text-lg font-semibold leading-tight text-white">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-white/70">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Edición limitada
                        </span>
                        <span className="font-serif text-xl font-bold text-white">
                          ${formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow badge */}
                    <span className="absolute bottom-5 right-5 flex h-10 w-10 translate-x-3 items-center justify-center rounded-full bg-primary opacity-0 shadow-float transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 text-primary-foreground" />
                    </span>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-card ring-1 ring-border transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary disabled:pointer-events-none disabled:opacity-0"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages - 1}
                className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-card ring-1 ring-border transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary disabled:pointer-events-none disabled:opacity-0"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-400 ${
                  i === page ? "w-8 bg-secondary" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Ir a página ${i + 1}`}
              />
            ))}
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
          <Link href="/productos" className="group btn-ghost">
            Ver todos los productos
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
