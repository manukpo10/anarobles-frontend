"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

/**
 * Envuelve el contenido con la barra y el pie del sitio público, salvo en /admin.
 *
 * El panel es una superficie aparte: trae su propia navegación completa en la
 * barra lateral, así que la del sitio duplica enlaces. Peor todavía, la barra
 * pública es `fixed` con z-50 y mide 97px, por encima del z-40 de la barra
 * lateral del panel — le tapaba los primeros 65px al contenido (el breadcrumb
 * entero y la mitad del título). El pie del sitio debajo de un dashboard
 * tampoco aporta nada.
 *
 * Es un componente cliente porque necesita usePathname(); el layout raíz sigue
 * siendo de servidor y solo delega acá el envoltorio.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const esPanel = pathname?.startsWith("/admin") ?? false

  if (esPanel) {
    return <main className="flex-grow">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
