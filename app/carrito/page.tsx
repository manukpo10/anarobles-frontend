"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  Package
} from "lucide-react"

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart()

  const shippingCost = subtotal > 150 ? 0 : 15
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-28">
        {/* Header */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-5xl font-light text-primary-foreground md:text-6xl lg:text-7xl"
            >
              Carrito
            </motion.h1>
          </div>
        </section>

        {/* Empty State */}
        <section className="flex min-h-[60vh] items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-md px-6 text-center"
          >
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-foreground">
              Tu carrito está vacío
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Explora nuestras piezas únicas y lleva el arte a tu espacio
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/productos"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ShoppingBag className="h-5 w-5" />
                Explorar tienda
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Header */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-2 text-sm text-primary-foreground/60"
          >
            <Link href="/" className="hover:text-primary-foreground transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-primary-foreground transition-colors">
              Tienda
            </Link>
            <span>/</span>
            <span className="text-primary-foreground">Carrito</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-between gap-8"
          >
            <div>
              <h1 className="font-serif text-5xl font-light text-primary-foreground md:text-6xl lg:text-7xl">
                Tu carrito
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/70">
                {itemCount} {itemCount === 1 ? "obra seleccionada" : "obras seleccionadas"}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="hidden text-sm font-medium text-primary-foreground/60 underline transition-colors hover:text-primary-foreground md:block"
            >
              Vaciar carrito
            </button>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="group border-b border-border/30 py-8 first:pt-0 last:border-b-0"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <Link href={`/productos/${item.id}`} className="shrink-0">
                        <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-muted md:h-40 md:w-40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link 
                              href={`/productos/${item.id}`}
                              className="font-serif text-lg font-medium text-foreground transition-colors hover:text-primary md:text-xl"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.category}
                            </p>
                            {item.featured && (
                              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-secondary">
                                <Sparkles className="h-3 w-3" />
                                Destacado
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive md:hidden"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-4 md:mt-0">
                          {/* Quantity */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:border-primary hover:text-primary"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price & Delete */}
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="font-serif text-xl font-semibold text-primary md:text-2xl">
                                ${(item.price * item.quantity).toLocaleString("es-AR")}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-muted-foreground">
                                  ${item.price} c/u
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="hidden shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive md:block"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Mobile clear cart */}
              <button
                onClick={clearCart}
                className="mt-8 w-full text-sm font-medium text-muted-foreground underline transition-colors hover:text-primary md:hidden"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-32 rounded-3xl bg-muted/30 p-8">
                <h2 className="font-serif text-2xl font-medium text-foreground">
                  Resumen del pedido
                </h2>

                {/* Promo Code */}
                <div className="mt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    Código de descuento
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Ingresá tu código"
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
                    />
                    <button className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      Envío
                    </span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        `$${shippingCost}`
                      )}
                    </span>
                  </div>
                  {subtotal < 150 && (
                    <p className="text-xs text-muted-foreground">
                      ¡Agregá ${(150 - subtotal).toLocaleString("es-AR")} más para obtener envío gratis!
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-border/30 pt-6">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-serif text-2xl font-semibold text-primary">
                      ${total.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-4">
                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Finalizar compra
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    href="/productos"
                    className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-foreground/20 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Seguir comprando
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2 text-xs">
                    <Truck className="h-4 w-4" />
                    Envío seguro
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Shield className="h-4 w-4" />
                    Pago protegido
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}