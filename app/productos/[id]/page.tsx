"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Ruler,
  Droplet,
  Layers,
  Shield,
  Truck,
  ChevronRight,
  Sparkles,
  Award,
  ArrowRight,
  Loader2
} from "lucide-react"
import { getProductById, fetchProductByIdFromAPI, fetchProductsFromAPI, Product } from "@/lib/data"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [productsList, setProductsList] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { addItem } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      const fetched = await fetchProductByIdFromAPI(id)
      setProduct(fetched)
      setIsLoading(false)
    }
    loadProduct()
  }, [id])

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProductsFromAPI()
      setProductsList(products)
    }
    loadProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    addItem(product)
    router.push("/carrito")
  }

  const relatedProducts = productsList
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const details = productDetails[product.id]

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl px-6 py-6 lg:px-8"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground transition-colors hover:text-primary">
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/productos" className="text-muted-foreground transition-colors hover:text-primary">
                Productos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Product Detail */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-square overflow-hidden rounded-3xl bg-muted/50 shadow-2xl"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges */}
                <div className="absolute left-5 top-5 flex flex-col gap-2">
                  {product.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                      <Sparkles className="h-3 w-3" />
                      Destacado
                    </span>
                  )}
                  {details?.stock === "limited" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                      Stock limitado
                    </span>
                  )}
                  {details?.stock === "last-units" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground animate-pulse">
                      Últimas unidades
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category}
              </span>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 font-serif text-4xl font-medium leading-tight text-foreground md:text-5xl lg:text-6xl"
              >
                {product.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-8"
              >
                <span className="font-serif text-4xl font-semibold text-primary md:text-5xl">
                  ${product.price}
                </span>
                {details?.edition && (
                  <span className="ml-4 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-medium text-secondary">
                    <Sparkles className="h-4 w-4" />
                    {details.edition}
                  </span>
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 leading-relaxed text-muted-foreground"
              >
                {product.description}
              </motion.p>

              {/* Product Specs */}
              {details && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-8 space-y-3"
                >
                  {details.technique && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Técnica
                        </p>
                        <p className="font-medium text-foreground">
                          {details.technique}
                        </p>
                      </div>
                    </div>
                  )}
                  {details.dimensions && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Ruler className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Dimensiones
                        </p>
                        <p className="font-medium text-foreground">
                          {details.dimensions}
                        </p>
                      </div>
                    </div>
                  )}
                  {details.material && (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Droplet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Material
                        </p>
                        <p className="font-medium text-foreground">
                          {details.material}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex gap-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Añadir al carrito
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-muted p-4 transition-colors hover:bg-muted/80"
                >
                  <Heart className="h-5 w-5" />
                </motion.button>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-10 rounded-2xl border border-border/30 bg-muted/30 p-6"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Envío</p>
                      <p className="text-sm font-medium text-foreground">Internacional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Embalaje</p>
                      <p className="text-sm font-medium text-foreground">Protegido</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Certificado</p>
                      <p className="text-sm font-medium text-foreground">Autenticidad</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border/30 bg-muted/20 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-secondary">
                <span className="h-px w-8 bg-secondary/60" />
                Explorá más
                <span className="h-px w-8 bg-secondary/60" />
              </span>
              <h2 className="mt-6 font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
                También te puede <span className="italic">gustar</span>
              </h2>
            </motion.div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/productos/${relatedProduct.id}`}
                    className="group block"
                  >
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted/30 transition-shadow duration-500 group-hover:shadow-xl"
                    >
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>
                    <div className="mt-6">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {relatedProduct.category}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-medium text-foreground transition-colors group-hover:text-primary">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-serif text-2xl font-semibold text-primary">
                          ${relatedProduct.price}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                          Ver más
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <Link
                href="/productos"
                className="group inline-flex items-center gap-3 rounded-full border-2 border-foreground/20 bg-background px-8 py-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Ver todos los productos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}