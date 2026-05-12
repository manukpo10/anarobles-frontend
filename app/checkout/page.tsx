"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CreditCard, Lock, Check, ShieldCheck, Loader2, Package, BookOpen, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCheckout, CheckoutItem } from "@/contexts/checkout-context"
import { useCart } from "@/contexts/cart-context"
import { confirmarCheckoutDemo, crearPreferenciaCheckout } from "@/lib/data"

const MERCADO_PAGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "TEST-xxxxx"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, addItem, removeItem, clearItems, total, processCheckout } = useCheckout()
  const { items: cartItems, clearCart } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [mpError, setMpError] = useState<string | null>(null)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent("/checkout")}`)
    }
  }, [authLoading, isAuthenticated, router])

// Load cart items into checkout on mount
  useEffect(() => {
    if (cartItems.length > 0) {
      cartItems.forEach((cartItem) => {
        const checkoutItem: CheckoutItem = {
          id: cartItem.id,
          type: "product",
          title: cartItem.name,
          price: cartItem.price,
          image: cartItem.image,
          quantity: cartItem.quantity
        }
        if (!items.find(i => i.id === cartItem.id && i.type === "product")) {
          addItem(checkoutItem)
        }
      })
      clearCart()
    }
  }, [cartItems, items, addItem, clearCart])

  const handleMercadoPagoCheckout = async () => {
    setIsProcessing(true)
    setMpError(null)

    try {
      if (!token) throw new Error("No estás autenticado")

      // Use crearPreferenciaCheckout from lib/data.ts - calls backend directly
      const result = await crearPreferenciaCheckout(token, items)
      
      if (!result) {
        throw new Error("No se pudo conectar con el servidor")
      }

      if (result.demo) {
        // Demo mode: store in sessionStorage, redirect to success page
        sessionStorage.setItem("checkout-demo", "true")
        sessionStorage.setItem("checkout-order", result.externalReference)
        router.push(`/checkout/success?order=${result.externalReference}&demo=true`)
        return
      }

      // Redirect to Mercado Pago
      if (result.initPoint) {
        window.location.href = result.initPoint
      } else if (result.sandboxInitPoint) {
        window.location.href = result.sandboxInitPoint
      } else {
        throw new Error("No se pudo obtener el enlace de pago")
      }
    } catch (error: any) {
      console.error("Mercado Pago error:", error)
      setMpError(error?.message || "Error al conectar con Mercado Pago. Probá de nuevo.")
      setIsProcessing(false)
    }
  }

  const handleSimulatePayment = async () => {
    setIsProcessing(true)
    setMpError(null)

    try {
      if (!token) throw new Error("No estás autenticado")

      // Usar el mismo flujo que MercadoPago para que el backend cree la orden
      const result = await crearPreferenciaCheckout(token, items)

      if (!result) {
        throw new Error("No se pudo conectar con el servidor")
      }

      // Simular: guardar en sessionStorage y redirigir a éxito como demo
      sessionStorage.setItem("checkout-demo", "true")
      sessionStorage.setItem("checkout-order", result.externalReference)
      router.push(`/checkout/success?order=${result.externalReference}&demo=true`)
    } catch (error: any) {
      console.error("Simulate payment error:", error)
      setMpError(error?.message || "Error al simular el pago. Probá de nuevo.")
      setIsProcessing(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
          >
            <Check className="h-12 w-12 text-green-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-4xl text-foreground"
          >
            ¡Compra exitosa!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-muted-foreground"
          >
            Tu pedido #{orderId} fue procesado correctamente.
            <br />
            Te enviamos un email con los detalles a {user?.email}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row justify-center"
          >
            <Link
              href="/mi-cuenta?tab=courses"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <BookOpen className="h-5 w-5" />
              Ver mis cursos
            </Link>
            <Link
              href="/mi-cuenta?tab=orders"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              <Package className="h-5 w-5" />
              Ver mis pedidos
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Volver al inicio
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Link
          href={items.length > 0 && items[0]?.type === "course" ? `/cursos/${items[0]?.id}` : "/cursos"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <h1 className="font-serif text-4xl text-foreground">Finalizar compra</h1>
        <p className="mt-2 text-muted-foreground">Completá tu compra de forma segura</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-background p-8 shadow-xl ring-1 ring-border"
            >
              <h2 className="font-serif text-xl font-medium text-foreground mb-6">Tu pedido</h2>
              
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-4 text-muted-foreground">No hay productos en tu pedido</p>
                  <Link
                    href="/productos"
                    className="mt-4 inline-block text-sm text-primary hover:underline"
                  >
                    Ver productos
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-6 border-b border-border/50 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                            {item.type === "course" ? (
                              <BookOpen className="h-3 w-3" />
                            ) : (
                              <span>{item.quantity}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{item.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                            {item.type === "course" ? "Curso" : "Producto"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-foreground">
                            ${item.price.toLocaleString("es-AR")}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              x{item.quantity}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Mercado Pago Integration */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 rounded-3xl bg-gradient-to-br from-[#00B1EA]/10 to-[#001E60]/10 p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00B1EA]/20">
                    <CreditCard className="h-6 w-6 text-[#00B1EA]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-medium text-foreground">Pago con Mercado Pago</h2>
                    <p className="text-sm text-muted-foreground">Pago 100% seguro</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Protección de datos
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4 text-green-600" />
                    Pago encriptado
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    onClick={handleMercadoPagoCheckout}
                    disabled={isProcessing}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    className="flex-1 flex items-center justify-center gap-3 rounded-full bg-[#00B1EA] py-4 text-sm font-semibold text-white shadow-lg shadow-[#00B1EA]/30 transition-all hover:bg-[#0099D6] disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="px-6 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    Simular pago (demo)
                  </button>
                </div>

                {mpError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
                  >
                    {mpError}
                  </motion.div>
                )}

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Al hacer clic en "Pagar con Mercado Pago", serás redirigido a la plataforma 
                  de Mercado Pago para completar tu transacción de forma segura.
                </p>
              </motion.div>
            )}
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl bg-background p-8 shadow-xl ring-1 ring-border"
              >
                <h3 className="font-serif text-lg font-medium text-foreground mb-6">
                  Resumen
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${total.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Descuento</span>
                    <span className="text-green-600">$0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-serif text-2xl font-bold text-primary">
                      ${total.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">
                    <Lock className="inline h-3 w-3 mr-1" />
                    Tus datos están protegidos. El pago es procesado por Mercado Pago.
                  </p>
                </div>
              </motion.div>

              {/* User Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 rounded-3xl bg-muted/30 p-6"
              >
                <h4 className="text-sm font-medium text-foreground mb-3">Datos del comprador</h4>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-24">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando checkout...</p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
