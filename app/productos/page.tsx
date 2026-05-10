"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  SlidersHorizontal, 
  Package,
  Heart,
  Maximize2,
  X,
  ChevronRight,
  Droplet,
  Ruler,
  Layers
} from "lucide-react"
import { getProducts, fetchProductsFromAPI, Product } from "@/lib/data"
import { useCart } from "@/contexts/cart-context"

const categories = [
  { id: "all", label: "Todos" },
  { id: "Herramientas", label: "Herramientas" },
  { id: "Pintura", label: "Pintura" },
  { id: "Papelería", label: "Papelería" },
  { id: "Libros", label: "Libros" },
  { id: "Merchandising", label: "Merchandising" },
] as const

type CategoryFilter = (typeof categories)[number]["id"]

const productDetails: Record<string, {
  technique?: string
  dimensions?: string
  material?: string
  stock?: "limited" | "available" | "last-units"
  edition?: string
}> = {
  "1": { technique: "Giclée Fine Art", dimensions: "50x70 cm", material: "Papel algodón 310gsm", stock: "last-units", edition: "Edición de 50" },
  "2": { technique: "Giclée Pigmentada", dimensions: "40x60 cm", material: "Papel algodón 310gsm", stock: "limited", edition: "Edición de 100" },
  "3": { technique: "Impresión offset", dimensions: "A5 (14x21 cm)", material: "Papel Munken 120gsm" },
  "4": { technique: "Impresión digital", dimensions: "10x15 cm c/u", material: "Cartulina mate 300gsm" },
  "5": { technique: "Serigrafía", dimensions: "38x42 cm", material: "Algodón orgánico 340gsm", stock: "limited" },
  "6": { technique: "Archivo digital HD", dimensions: "5000x7000 px (300 DPI)", material: "PDF/JPG de alta resolución", edition: "Licencia personal" },
}

export default function ProductosPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all")
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [productsList, setProductsList] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const load = async () => {
      const data = await fetchProductsFromAPI()
      setProductsList(data.length > 0 ? data : getProducts())
    }
    load()
  }, [])

  const filteredProducts = useMemo(() =>
    activeFilter === "all"
      ? productsList
      : productsList.filter((p) => p.category === activeFilter),
    [activeFilter, productsList]
  )

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Header / Hero */}
      <section className="relative overflow-hidden bg-primary py-28 lg:py-40">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        {/* Artistic brush stroke */}
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0 50 Q300 20 600 50 T1200 50 L1200 100 L0 100 Z" fill="#194052"/>
        </svg>
        
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-4"
          >
            <span className="h-px w-12 bg-secondary/60" />
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-secondary">
              Tienda
            </span>
            <span className="h-px w-12 bg-secondary/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 font-serif text-6xl font-light tracking-tight text-primary-foreground md:text-7xl lg:text-8xl"
          >
            Tienda de <span className="italic">Arte</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-primary-foreground/70"
          >
            Piezas únicas para llevar el arte a tu espacio
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border/30 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium text-foreground">Filtrar</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto py-1 md:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeFilter === category.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <span className="hidden text-sm text-muted-foreground lg:block">
              {filteredProducts.length} productos
            </span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            layout
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group"
                >
                  {/* Product Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-muted/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-foreground/5">
                    {/* Image */}
                    <div 
                      className="relative aspect-[4/5] cursor-pointer"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* Quick view button */}
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-background/95 px-6 py-3 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Vista rápida
                      </motion.button>

                      {/* Badges */}
                      <div className="absolute left-4 top-4 flex flex-col gap-2">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground backdrop-blur-sm">
                            <Sparkles className="h-3 w-3" />
                            Destacado
                          </span>
                        )}
                        {productDetails[product.id]?.stock === "limited" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                            Stock limitado
                          </span>
                        )}
                        {productDetails[product.id]?.stock === "last-units" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground backdrop-blur-sm animate-pulse">
                            Últimas unidades
                          </span>
                        )}
                      </div>

                      {/* Wishlist button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist(product.id)
                        }}
                        className="absolute right-4 top-4 z-10 rounded-full bg-background/95 p-2.5 shadow-lg backdrop-blur-sm transition-colors hover:bg-background"
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${
                            wishlist.has(product.id) 
                              ? "fill-accent text-accent" 
                              : "text-foreground/60"
                          }`}
                        />
                      </motion.button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {product.category}
                          </p>
                          <h3 className="mt-2 font-serif text-xl font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
                            {product.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <span className="font-serif text-2xl font-semibold text-primary">
                          ${product.price}
                        </span>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            addItem(product)
                            router.push("/carrito")
                          }}
                          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Añadir
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32 text-center"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="font-serif text-xl text-foreground">
                No hay productos en esta categoría
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Ver todos los productos
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-muted p-2 transition-colors hover:bg-muted/80"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid lg:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-square bg-muted/50 lg:aspect-auto">
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-8 lg:p-12">
                  <div className="mb-6">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {quickViewProduct.category}
                    </span>
                    <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground lg:text-4xl">
                      {quickViewProduct.name}
                    </h2>
                  </div>

                  <p className="text-3xl font-semibold text-primary lg:text-4xl">
                    ${quickViewProduct.price}
                  </p>

                  <p className="mt-6 leading-relaxed text-muted-foreground">
                    {quickViewProduct.description}
                  </p>

                  {/* Product Specs */}
                  {productDetails[quickViewProduct.id] && (
                    <div className="mt-8 space-y-4 rounded-2xl bg-muted/50 p-6">
                      {productDetails[quickViewProduct.id].technique && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Layers className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Técnica
                            </p>
                            <p className="font-medium text-foreground">
                              {productDetails[quickViewProduct.id].technique}
                            </p>
                          </div>
                        </div>
                      )}
                      {productDetails[quickViewProduct.id].dimensions && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Ruler className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Dimensiones
                            </p>
                            <p className="font-medium text-foreground">
                              {productDetails[quickViewProduct.id].dimensions}
                            </p>
                          </div>
                        </div>
                      )}
                      {productDetails[quickViewProduct.id].material && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Droplet className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Material
                            </p>
                            <p className="font-medium text-foreground">
                              {productDetails[quickViewProduct.id].material}
                            </p>
                          </div>
                        </div>
                      )}
                      {productDetails[quickViewProduct.id].edition && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
                          <Sparkles className="h-4 w-4" />
                          {productDetails[quickViewProduct.id].edition}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={() => {
                        addItem(quickViewProduct)
                        router.push("/carrito")
                      }}
                      className="flex-1 flex items-center justify-center gap-3 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Añadir al carrito
                    </button>
                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className={`rounded-full p-4 transition-colors ${
                        wishlist.has(quickViewProduct.id)
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${wishlist.has(quickViewProduct.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <Link
                    href={`/productos/${quickViewProduct.id}`}
                    className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    Ver detalles completos
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}