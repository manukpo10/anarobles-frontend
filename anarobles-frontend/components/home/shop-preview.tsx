"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { getFeaturedProducts, type Product } from "@/lib/data"

export function ShopPreview() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(3)

  useEffect(() => {
    setFeaturedProducts(getFeaturedProducts().slice(0, 6))
  }, [])

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 640) setPerPage(1)
      else if (w < 1024) setPerPage(2)
      else setPerPage(3)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const totalPages = Math.ceil(featuredProducts.length / perPage)
  const goTo = useCallback((p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))), [totalPages])

  if (featuredProducts.length === 0) return null

  const visible = featuredProducts.slice(page * perPage, (page + 1) * perPage)

  return (
    <section className="group/section bg-muted/40 py-28 lg:py-40">
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-secondary"
          >
            <span className="h-px w-12 bg-secondary/60" />
            Productos
            <span className="h-px w-12 bg-secondary/60" />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-6xl font-light tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            Productos{' '}
            <span className="font-semibold text-gradient">Destacados</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Piezas exclusivas que transforman cualquier espacio en una galería.
            Encontrá la obra que resuene con tu historia.
          </motion.p>
        </motion.div>

        {/* Carousel track */}
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${perPage}, 1fr)`,
                }}
              >
                {visible.map((product) => (
                  <Link key={product.id} href={`/productos/${product.id}`} className="group block">
                    <motion.div 
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-lg transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20"
                    >
                      <Image
                        src={product.image}
                        alt={`${product.name} - ${product.category} - Obra de Ana Cecilia Robles`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute left-5 top-5 flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground shadow-md">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="flex items-center gap-1.5 rounded-full bg-secondary/95 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground shadow-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            Destacado
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/90">
                          {product.category}
                        </p>
                        <h3 className="font-serif text-2xl font-semibold leading-tight text-primary-foreground drop-shadow-md">
                          {product.name}
                        </h3>
                        <div className="mt-4 flex items-center gap-4">
                          <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/80">
                            <ShoppingBag className="h-4 w-4" />
                            Edición limitada
                          </span>
                          <span className="ml-auto font-serif text-2xl font-bold text-primary-foreground drop-shadow-md">
                            ${product.price.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                      <span className="absolute bottom-6 right-6 flex h-12 w-12 translate-x-4 items-center justify-center rounded-full bg-secondary opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-110">
                        <ArrowRight className="h-5 w-5 text-secondary-foreground" />
                      </span>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border opacity-0 transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary group-hover/section:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages - 1}
                className="absolute -right-4 top-1/2 -translate-y-1/2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border opacity-0 transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:ring-secondary group-hover/section:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === page
                    ? "w-8 bg-secondary"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Ir a página ${i + 1}`}
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
            href="/productos"
            className="group inline-flex items-center gap-4 rounded-full border-2 border-foreground/20 bg-background px-10 py-5 text-sm font-semibold uppercase tracking-wider text-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20"
          >
            Ver todos los productos
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
