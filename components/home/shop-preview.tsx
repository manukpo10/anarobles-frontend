"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react"
import { getFeaturedProducts, type Product } from "@/lib/data"

export function ShopPreview() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    setFeaturedProducts(getFeaturedProducts().slice(0, 3))
  }, [])

  if (featuredProducts.length === 0) return null

  return (
    <section className="bg-muted/40 py-28 lg:py-40">
      {/* Decorative background element */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 flex flex-col items-center justify-between gap-8 md:flex-row"
        >
          <div className="text-center md:text-left">
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
              className="mt-8 font-serif text-6xl font-light tracking-tight text-foreground md:text-7xl"
            >
              Lleva el arte{' '}
              <span className="font-semibold text-gradient">contigo</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/productos"
              className="group inline-flex items-center gap-4 rounded-full border-2 border-foreground/20 bg-background px-10 py-5 text-sm font-semibold uppercase tracking-wider text-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20"
            >
              Ver todos los productos
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid auto-rows-fr gap-10 md:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <Link href={`/productos/${product.id}`} className="group block h-full">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-card shadow-lg transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Hover overlay with CTA */}
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-3 rounded-full bg-secondary px-8 py-4 text-sm font-semibold text-secondary-foreground shadow-xl">
                      <ShoppingBag className="h-5 w-5" />
                      Ver producto
                    </span>
                  </div>

                  {/* Featured badge */}
                  {product.featured && (
                    <div className="absolute left-5 top-5">
                      <span className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground shadow-md">
                        <Sparkles className="h-3.5 w-3.5 text-secondary" />
                        Destacado
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Product Info */}
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {product.category}
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-medium leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                      {product.name}
                    </h3>
                  </div>
                  <p className="shrink-0 font-serif text-3xl font-bold text-primary">
                    ${product.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}