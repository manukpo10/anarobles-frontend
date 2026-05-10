"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock, ArrowRight, Mail, HelpCircle } from "lucide-react"

function PendingContent() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const order = searchParams.get("order")
    if (order) {
      setOrderId(order)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100"
        >
          <Clock className="h-12 w-12 text-yellow-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-4xl text-foreground"
        >
          Pago pendiente
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-muted-foreground"
        >
          Tu pedido {orderId && <span className="font-medium text-foreground">#{orderId}</span>} está siendo procesado.
          <br />
          Te notificaremos por email cuando se confirme el pago.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 space-y-4"
        >
          <div className="rounded-2xl bg-muted/30 p-6 text-left">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Revisá tu email</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Te enviamos las instrucciones para completar el pago si elegiste transferencia o efectivo.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-muted/30 p-6 text-left">
            <div className="flex items-start gap-3">
              <HelpCircle className="mt-1 h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">¿Problemas con el pago?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Si tenés dificultades, podés{" "}
                  <Link href="/contacto" className="text-primary hover:underline">
                    contactarnos
                  </Link>{" "}
                  o intentar nuevamente desde tu panel de control.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <Link
            href="/mi-cuenta"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir a mi cuenta
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function PendingFallback() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
          <Clock className="h-12 w-12 text-yellow-600" />
        </div>
        <h1 className="font-serif text-4xl text-foreground">Cargando...</h1>
      </div>
    </div>
  )
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<PendingFallback />}>
      <PendingContent />
    </Suspense>
  )
}
