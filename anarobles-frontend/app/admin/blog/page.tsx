"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Plus, Search, Edit, Trash2, Eye, Filter, Star,
  ArrowUp, ArrowDown, ArrowUpDown, FileText,
} from "lucide-react"
import {
  fetchAdminArticulos,
  eliminarArticuloAPI,
  formatFecha,
  CATEGORIA_LABELS,
  type Articulo,
  type CategoriaSlug,
} from "@/lib/articulos"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

const ITEMS_PER_PAGE = 10

type SortKey = "updatedAt" | "titulo" | "categoria" | "fechaPublicacion" | "publicado"
type SortDir = "asc" | "desc"

const compareArticulos = (a: Articulo, b: Articulo, sortBy: SortKey, sortDir: SortDir): number => {
  let cmp = 0
  switch (sortBy) {
    case "titulo": cmp = a.titulo.localeCompare(b.titulo, "es"); break
    case "categoria": cmp = a.categoria.localeCompare(b.categoria, "es"); break
    case "fechaPublicacion": cmp = a.fechaPublicacion.localeCompare(b.fechaPublicacion); break
    case "updatedAt": cmp = (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""); break
    // Borradores primero en ascendente: son los que piden atención.
    case "publicado": cmp = Number(a.publicado ?? true) - Number(b.publicado ?? true); break
  }
  return sortDir === "asc" ? cmp : -cmp
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AdminBlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [articulosList, setArticulosList] = useState<Articulo[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  // Igual que en galería: lo último editado primero, para que un artículo recién
  // guardado no caiga en la última página.
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const { toast } = useToast()
  const { token } = useAuth()

  useEffect(() => {
    const load = async () => {
      if (!token) return
      setArticulosList(await fetchAdminArticulos(token))
    }
    load()
  }, [token])

  const categories = Array.from(new Set(articulosList.map((a) => a.categoria)))

  const filtered = articulosList.filter((a) => {
    const matchesSearch = a.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || a.categoria === filterCategory
    return matchesSearch && matchesCategory
  })

  const sorted = [...filtered].sort((a, b) => compareArticulos(a, b, sortBy, sortDir))

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSort = (column: SortKey) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortDir("asc")
    }
    setCurrentPage(1)
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortBy !== column) return <ArrowUpDown className="h-3 w-3 opacity-30" />
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || !token) return
    setDeletePending(true)
    try {
      const ok = await eliminarArticuloAPI(token, deleteTargetId)
      if (ok) {
        setArticulosList(await fetchAdminArticulos(token))
        toast({ title: "Artículo eliminado", description: "Eliminado del servidor" })
      } else {
        toast({ title: "Error", description: "No se pudo eliminar el artículo", variant: "destructive" })
      }
      setDeleteTargetId(null)
    } finally {
      setDeletePending(false)
    }
  }

  // Compartido entre la fila de escritorio y la tarjeta de mobile, para que el
  // flujo de confirmación de borrado exista en un solo lugar.
  const ArticuloActions = ({ articulo }: { articulo: Articulo }) => (
    <>
      <Link
        href={`/blog/${articulo.slug}`}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Ver en el blog"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <Link
        href={`/admin/blog/${articulo.id}/edit`}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        title="Editar"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            onClick={() => setDeleteTargetId(articulo.id)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás segura de que querés eliminar este artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Si solo querés sacarlo del blog sin perderlo,
              editalo y apagá el interruptor &quot;Publicado&quot; para dejarlo como borrador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTargetId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deletePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )

  const EstadoBadge = ({ publicado }: { publicado?: boolean }) =>
    publicado === false ? (
      <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        Borrador
      </span>
    ) : (
      <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        Publicado
      </span>
    )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground transition-colors hover:text-primary">
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-muted-foreground transition-colors hover:text-primary">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">Gestión del Blog</h1>
          <p className="mt-1 text-muted-foreground">Escribí y administrá los artículos</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 transition-all hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo Artículo
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold text-foreground">{articulosList.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Publicados</p>
          <p className="text-2xl font-semibold text-foreground">
            {articulosList.filter((a) => a.publicado !== false).length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Borradores</p>
          <p className="text-2xl font-semibold text-secondary">
            {articulosList.filter((a) => a.publicado === false).length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Destacados</p>
          <p className="text-2xl font-semibold text-primary">
            {articulosList.filter((a) => a.destacado).length}
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORIA_LABELS[cat as CategoriaSlug] ?? cat}
              </option>
            ))}
          </select>
          {/* Solo mobile: en escritorio esto lo cubren los encabezados de columna,
              que no existen en el layout de tarjetas. */}
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={(e) => {
              const [col, dir] = e.target.value.split("-") as [SortKey, SortDir]
              setSortBy(col)
              setSortDir(dir)
              setCurrentPage(1)
            }}
            className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:hidden"
          >
            <option value="updatedAt-desc">Recién editados primero</option>
            <option value="updatedAt-asc">Recién editados al final</option>
            <option value="fechaPublicacion-desc">Más nuevos primero</option>
            <option value="fechaPublicacion-asc">Más viejos primero</option>
            <option value="titulo-asc">Título (A-Z)</option>
            <option value="titulo-desc">Título (Z-A)</option>
            <option value="categoria-asc">Categoría (A-Z)</option>
            <option value="categoria-desc">Categoría (Z-A)</option>
            <option value="publicado-asc">Borradores primero</option>
            <option value="publicado-desc">Publicados primero</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {/* Escritorio: tabla */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  onClick={() => handleSort("titulo")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Artículo <SortIcon column="titulo" /></span>
                </th>
                <th
                  onClick={() => handleSort("categoria")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Categoría <SortIcon column="categoria" /></span>
                </th>
                <th
                  onClick={() => handleSort("publicado")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Estado <SortIcon column="publicado" /></span>
                </th>
                <th
                  onClick={() => handleSort("fechaPublicacion")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Fecha <SortIcon column="fechaPublicacion" /></span>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron artículos
                  </td>
                </tr>
              ) : (
                paginated.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image src={a.imagenDestacada} alt={a.titulo} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{a.titulo}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {a.tiempoLectura} min de lectura
                          </p>
                          {a.destacado && (
                            <Badge variant="secondary" className="mt-1 gap-1">
                              <Star className="h-3 w-3" />
                              Destacado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {CATEGORIA_LABELS[a.categoria] ?? a.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4"><EstadoBadge publicado={a.publicado} /></td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{formatFecha(a.fechaPublicacion)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <ArticuloActions articulo={a} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: tarjetas apiladas, mismo criterio que la galería. */}
        <div className="divide-y divide-border md:hidden">
          {paginated.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted-foreground">No se encontraron artículos</p>
          ) : (
            paginated.map((a) => (
              <div key={a.id} className="p-4">
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={a.imagenDestacada} alt={a.titulo} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{a.titulo}</p>
                    {a.destacado && (
                      <Badge variant="secondary" className="mt-1 gap-1">
                        <Star className="h-3 w-3" />
                        Destacado
                      </Badge>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {CATEGORIA_LABELS[a.categoria] ?? a.categoria}
                      </span>
                      <EstadoBadge publicado={a.publicado} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatFecha(a.fechaPublicacion)} · {a.tiempoLectura} min
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-1 border-t border-border/60 pt-3">
                  <ArticuloActions articulo={a} />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {totalPages > 1 && (
        <motion.div variants={itemVariants}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {filtered.length === 0 && articulosList.length > 0 && (
        <div className="rounded-2xl border border-border bg-background p-12 text-center shadow-sm">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium text-foreground">No se encontraron artículos</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Intentá con otros términos de búsqueda o cambiá los filtros
          </p>
        </div>
      )}

      {articulosList.length === 0 && (
        <div className="rounded-2xl border border-border bg-background p-12 text-center shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium text-foreground">Todavía no hay artículos</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Empezá escribiendo el primero — o esperá unos segundos si el servidor recién arranca.
          </p>
        </div>
      )}

      <motion.div variants={itemVariants}>
        <Link
          href="/admin/blog/nuevo"
          className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-6 transition-all hover:border-secondary/60 hover:bg-secondary/5 hover:shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
            <Plus className="h-7 w-7 text-secondary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Escribir nuevo artículo</p>
            <p className="text-sm text-muted-foreground">Crear una nueva entrada para el blog</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
