"use client"

import { Suspense, useEffect } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Package, BookOpen, ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { confirmarCheckoutDemo } from "@/lib/data"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const order = searchParams.get("order")
    const isDemo = searchParams.get("demo") === "true"
    
    if (order) {
      setOrderId(order)
      
      // If demo mode, confirm the checkout on the backend
      if (isDemo && token && !confirmed) {
        confirmarCheckoutDemo(token, order).then(() => {
          setConfirmed(true)
          sessionStorage.removeItem("checkout-demo")
          sessionStorage.removeItem("checkout-order")
        })
      }
    }
  }, [searchParams, token, confirmed])

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-4xl text-foreground"
        >
          ¡Pago exitoso!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-muted-foreground"
        >
          Tu pedido {orderId && <span className="font-medium text-foreground">#{orderId}</span>} ha sido procesado correctamente.
          <br />
          Te enviamos un email con los detalles a tu correo.
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="h-4 w-4" />
            Descargar comprobante
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 rounded-2xl bg-muted/30 p-6"
        >
          <p className="text-sm text-muted-foreground">
            ¿Necesitás ayuda?{" "}
            <Link href="/contacto" className="text-primary hover:underline">
              Contactanos
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function SuccessFallback() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="font-serif text-4xl text-foreground">Cargando...</h1>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
