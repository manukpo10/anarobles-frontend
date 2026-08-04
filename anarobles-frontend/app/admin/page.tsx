"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Package, Images, FileText, Eye, Plus, PenLine, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  getCursos, getProducts, fetchAdminCursos, fetchAdminProductos,
  type Curso, type Product,
} from "@/lib/data"
import { fetchAdminObras, type Obra } from "@/lib/obras"
import { fetchAdminArticulos, formatFecha, type Articulo } from "@/lib/articulos"
import { Spinner } from "@/components/ui/spinner"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Ordena por fecha de última edición descendente. Solo las obras y los artículos
 * traen updatedAt desde la API; los que no lo tienen quedan al final en vez de
 * colarse arriba como si fueran lo más reciente.
 */
const porMasReciente = <T extends { updatedAt?: string }>(a: T, b: T) =>
  (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const [cargando, setCargando] = useState(true)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [productos, setProductos] = useState<Product[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [articulos, setArticulos] = useState<Articulo[]>([])

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      // Cursos y productos mantienen el respaldo local que ya usan sus propias
      // páginas del panel; obras y artículos no lo tienen (viven solo en el
      // servidor), así que si el backend no responde quedan vacíos y punto.
      const [c, p, o, a] = await Promise.all([
        token ? fetchAdminCursos(token) : Promise.resolve([]),
        token ? fetchAdminProductos(token) : Promise.resolve([]),
        token ? fetchAdminObras(token) : Promise.resolve([]),
        token ? fetchAdminArticulos(token) : Promise.resolve([]),
      ])
      if (cancelado) return
      setCursos(c.length > 0 ? c : getCursos())
      setProductos(p.length > 0 ? p : getProducts())
      setObras(o)
      setArticulos(a)
      setCargando(false)
    }
    cargar()
    return () => { cancelado = true }
  }, [token])

  const borradores = articulos.filter((a) => a.publicado === false)

  const stats = [
    { label: "Cursos", value: cursos.length, icon: BookOpen, color: "text-primary", href: "/admin/cursos" },
    { label: "Productos", value: productos.length, icon: Package, color: "text-secondary", href: "/admin/productos" },
    { label: "Obras en galería", value: obras.length, icon: Images, color: "text-accent", href: "/admin/galeria" },
    { label: "Artículos del blog", value: articulos.length, icon: FileText, color: "text-emerald-600", href: "/admin/blog" },
  ]

  // "Última actividad" real: lo que efectivamente se editó, sacado de los mismos
  // datos de arriba. No hay endpoint de ventas ni de inscripciones para el admin,
  // así que no se muestran — un número inventado sobre el propio negocio es peor
  // que no mostrar nada, porque nadie lo pone en duda.
  const recientes = [
    ...obras.map((o) => ({
      id: `obra-${o.id}`,
      tipo: "Obra" as const,
      titulo: o.titulo,
      imagen: o.imagen,
      updatedAt: o.updatedAt,
      href: `/admin/galeria/${o.id}/edit`,
    })),
    ...articulos.map((a) => ({
      id: `art-${a.id}`,
      tipo: "Artículo" as const,
      titulo: a.titulo,
      imagen: a.imagenDestacada,
      updatedAt: a.updatedAt,
      href: `/admin/blog/${a.id}/edit`,
    })),
  ].sort(porMasReciente).slice(0, 6)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Bienvenida, <span className="italic">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">Este es el contenido publicado en tu sitio</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/galeria/nuevo"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nueva obra
          </Link>
          <Link
            href="/admin/blog/nuevo"
            className="flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 transition-all hover:bg-secondary/90"
          >
            <PenLine className="h-4 w-4" />
            Escribir artículo
          </Link>
        </div>
      </motion.div>

      {/* Stats — cada tarjeta lleva a su sección */}
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Link
              href={stat.href}
              className="block rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className={`inline-flex rounded-xl bg-muted p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-semibold text-foreground">
                  {cargando ? <span className="text-muted-foreground/40">—</span> : stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Borradores pendientes — solo aparece si hay algo que hacer */}
      {borradores.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">
                {borradores.length === 1
                  ? "Tenés 1 artículo sin publicar"
                  : `Tenés ${borradores.length} artículos sin publicar`}
              </p>
              <p className="text-sm text-amber-800">
                Están guardados como borrador y no se ven en el blog.
              </p>
            </div>
          </div>
          <Link
            href="/admin/blog"
            className="shrink-0 rounded-full bg-amber-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Ver borradores
          </Link>
        </motion.div>
      )}

      {/* Última actividad real */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-foreground">Editado recientemente</h2>
        </div>

        {cargando ? (
          <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
        ) : recientes.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Todavía no hay obras ni artículos cargados. Si el servidor recién arranca,
            puede tardar unos segundos.
          </p>
        ) : (
          <div className="space-y-3">
            {recientes.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-4 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.imagen} alt={item.titulo} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.titulo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.tipo}
                    {item.updatedAt && ` · ${formatFecha(item.updatedAt.slice(0, 10))}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Accesos rápidos */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground"
      >
        <h2 className="mb-4 font-serif text-xl font-medium">Accesos rápidos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/galeria/nuevo"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-foreground/20 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/30"
          >
            <Images className="h-4 w-4" />
            Subir obra
          </Link>
          <Link
            href="/admin/blog/nuevo"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-foreground/20 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/30"
          >
            <FileText className="h-4 w-4" />
            Escribir artículo
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-foreground/20 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/30"
          >
            <Package className="h-4 w-4" />
            Agregar producto
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-foreground/20 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/30"
          >
            <Eye className="h-4 w-4" />
            Ver el sitio
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
