"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal } = useCart()

  const shippingCost = subtotal > 150 ? 0 : 15
  const total = subtotal + shippingCost

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/30 p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl font-medium text-foreground">
                  Carrito ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  Tu carrito está vacío
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Agregá obras para verlas aquí
                </p>
                <Link
                  href="/productos"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explorar tienda
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="group flex gap-4 border-b border-border/20 py-4 last:border-b-0"
                      >
                        {/* Image */}
                        <Link href={`/productos/${item.id}`} onClick={closeCart} className="shrink-0">
                          <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-2">
                            <Link 
                              href={`/productos/${item.id}`} 
                              onClick={closeCart}
                              className="text-sm font-medium text-foreground transition-colors hover:text-primary line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-end justify-between gap-2">
                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:border-primary hover:text-primary"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:border-primary hover:text-primary"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-semibold text-primary">
                              ${(item.price * item.quantity).toLocaleString("es-AR")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-border/30 p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Gratis</span>
                        ) : (
                          `$${shippingCost}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border/30 pt-3">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-serif text-xl font-semibold text-primary">
                        ${total.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/carrito"
                      onClick={closeCart}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Ver carrito completo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-foreground/20 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Finalizar compra
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}