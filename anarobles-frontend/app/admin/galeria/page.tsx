"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Eye, Filter, Star, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { fetchAdminObras, eliminarObraAPI, type Obra, type Disponibilidad } from "@/lib/obras"
import { formatPrice } from "@/lib/utils"
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

const DISP_LABEL: Record<Disponibilidad, string> = {
  disponible: "Disponible",
  consultar: "Consultar",
  vendida: "Vendida",
}

// Same color convention as the public lightbox's DISP map: emerald / primary-outline / struck-gray.
const DISP_BADGE: Record<Disponibilidad, string> = {
  disponible: "border-emerald-300 bg-emerald-50 text-emerald-700",
  consultar: "border-primary/50 bg-transparent text-primary",
  vendida: "border-border bg-muted text-muted-foreground line-through",
}

type SortKey = "updatedAt" | "titulo" | "categoria" | "disponibilidad" | "precio"
type SortDir = "asc" | "desc"

// precio sorts with unset values always last, independent of direction — otherwise
// "sin precio" would jump to the top when sorting descending, which reads as if it
// were the highest price rather than simply not set yet.
const compareObras = (a: Obra, b: Obra, sortBy: SortKey, sortDir: SortDir): number => {
  if (sortBy === "precio") {
    if (a.precio == null && b.precio == null) return 0
    if (a.precio == null) return 1
    if (b.precio == null) return -1
    return sortDir === "asc" ? a.precio - b.precio : b.precio - a.precio
  }
  let cmp = 0
  switch (sortBy) {
    case "titulo": cmp = a.titulo.localeCompare(b.titulo, "es"); break
    case "categoria": cmp = a.categoria.localeCompare(b.categoria, "es"); break
    case "disponibilidad": cmp = a.disponibilidad.localeCompare(b.disponibilidad, "es"); break
    case "updatedAt": cmp = (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""); break
  }
  return sortDir === "asc" ? cmp : -cmp
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function AdminGaleriaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [obrasList, setObrasList] = useState<Obra[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  // Default: most recently edited/created first — otherwise an edit lands the obra
  // wherever the backend happens to return it (effectively its original creation
  // order), which could be on the last page.
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const { toast } = useToast()
  const { token } = useAuth()

  useEffect(() => {
    const load = async () => {
      if (!token) return
      const data = await fetchAdminObras(token)
      setObrasList(data)
    }
    load()
  }, [token])

  const categories = Array.from(new Set(obrasList.map(o => o.categoria)))

  const filteredObras = obrasList.filter(obra => {
    const matchesSearch = obra.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || obra.categoria === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedObras = [...filteredObras].sort((a, b) => compareObras(a, b, sortBy, sortDir))

  const totalPages = Math.ceil(sortedObras.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedObras = sortedObras.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSort = (column: SortKey) => {
    if (sortBy === column) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
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
      const ok = await eliminarObraAPI(token, deleteTargetId)
      if (ok) {
        const data = await fetchAdminObras(token)
        setObrasList(data)
        toast({ title: "Obra eliminada", description: "Eliminada del servidor" })
      } else {
        toast({ title: "Error", description: "No se pudo eliminar la obra", variant: "destructive" })
      }
      setDeleteTargetId(null)
    } finally {
      setDeletePending(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Breadcrumb */}
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
              <BreadcrumbPage className="text-primary">Galería</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Gestión de Galería
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra las obras de la galería
          </p>
        </div>
        <Link
          href="/admin/galeria/nuevo"
          className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 transition-all hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva Obra
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Total Obras</p>
          <p className="text-2xl font-semibold text-foreground">{obrasList.length}</p>
        </div>
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Destacadas</p>
          <p className="text-2xl font-semibold text-secondary">{obrasList.filter(o => o.destacada).length}</p>
        </div>
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Categorías</p>
          <p className="text-2xl font-semibold text-primary">{categories.length}</p>
        </div>
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Disponibles</p>
          <p className="text-2xl font-semibold text-foreground">
            {obrasList.filter(o => o.disponibilidad === "disponible").length}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-2xl bg-background p-4 shadow-sm border border-border sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar obras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Obras Table */}
      <motion.div variants={itemVariants} className="rounded-2xl bg-background shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  onClick={() => handleSort("titulo")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Obra <SortIcon column="titulo" /></span>
                </th>
                <th
                  onClick={() => handleSort("categoria")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Categoría <SortIcon column="categoria" /></span>
                </th>
                <th
                  onClick={() => handleSort("disponibilidad")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Disponibilidad <SortIcon column="disponibilidad" /></span>
                </th>
                <th
                  onClick={() => handleSort("precio")}
                  className="cursor-pointer select-none px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1.5">Precio <SortIcon column="precio" /></span>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedObras.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron obras
                  </td>
                </tr>
              ) : (
                paginatedObras.map((obra) => (
                  <tr key={obra.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={obra.imagen}
                            alt={obra.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{obra.titulo}</p>
                          {obra.destacada && (
                            <Badge variant="secondary" className="mt-1 gap-1">
                              <Star className="h-3 w-3" />
                              Destacada
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {obra.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${DISP_BADGE[obra.disponibilidad]}`}>
                        {DISP_LABEL[obra.disponibilidad]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        {obra.disponibilidad === "consultar" || obra.precio === undefined
                          ? "Consultar"
                          : `$${formatPrice(obra.precio)}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/galeria?obra=${encodeURIComponent(obra.slug)}`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/galeria/${obra.id}/edit`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setDeleteTargetId(obra.id)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás segura de que querés eliminar esta obra?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La obra será eliminada permanentemente de la galería.
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {filteredObras.length === 0 && (
        <div className="rounded-2xl bg-background p-12 text-center shadow-sm border border-border">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium text-foreground">No se encontraron obras</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Intenta con otros términos de búsqueda o cambia los filtros
          </p>
        </div>
      )}

      {/* Add Obra Card */}
      <motion.div variants={itemVariants}>
        <Link
          href="/admin/galeria/nuevo"
          className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-6 transition-all hover:border-secondary/60 hover:bg-secondary/5 hover:shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
            <Plus className="h-7 w-7 text-secondary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Agregar nueva obra</p>
            <p className="text-sm text-muted-foreground">Crear una nueva obra para la galería</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
