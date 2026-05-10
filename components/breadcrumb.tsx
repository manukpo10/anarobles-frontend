"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const routeNames: Record<string, string> = {
  "sobre-mi": "Sobre Mí",
  cursos: "Cursos",
  productos: "Productos",
  contacto: "Contacto",
  "[id]": "",
}

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1
    const name = routeNames[segment] || segment

    return { href, name, isLast }
  })

  return (
    <nav
      className={cn(
        "mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 lg:px-8",
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-secondary"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Inicio</span>
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          
          {crumb.isLast ? (
            <span className="text-sm font-medium text-foreground">
              {crumb.name}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-sm text-muted-foreground transition-colors hover:text-secondary"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export function AnimatedBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1
    const name = routeNames[segment] || segment

    return { href, name, isLast }
  })

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 lg:px-8",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="/"
          className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-secondary"
        >
          <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">Inicio</span>
        </Link>
      </motion.div>

      {breadcrumbs.map((crumb, index) => (
        <motion.div
          key={crumb.href}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className="flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          
          {crumb.isLast ? (
            <span className="text-sm font-medium text-foreground">
              {crumb.name}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-sm text-muted-foreground transition-colors hover:text-secondary"
            >
              {crumb.name}
            </Link>
          )}
        </motion.div>
      ))}
    </motion.nav>
  )
}