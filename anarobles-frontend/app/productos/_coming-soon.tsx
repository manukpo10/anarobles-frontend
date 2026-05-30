"use client"

import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { ProductosHeader } from "@/components/productos/productos-header"

export default function ProductosComingSoon() {
  return (
    <div className="min-h-screen bg-background">
      <ProductosHeader />

      <section className="bg-background py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="rounded-2xl bg-card border border-border shadow-sm p-10 lg:p-14">
            <p className="text-base leading-relaxed text-foreground">
              Estamos curando una selección especial de obras y productos para vos.
              Pronto vas a poder llevar el arte de Ana Cecilia a tu espacio.
            </p>

            <p className="mt-4 text-base text-muted-foreground">
              Mientras tanto, explorá la galería para ver todas las obras disponibles.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/galeria"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-medium transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver la galería
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border border-border rounded-full px-8 py-3 font-medium text-foreground hover:bg-muted transition-colors"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
