"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Eye, BookOpen } from "lucide-react"
import { getCursos, deleteCurso, fetchAdminCursos, eliminarCursoAPI, type Curso } from "@/lib/data"
import { Button } from "@/components/ui/button"
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

const ITEMS_PER_PAGE = 10

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

function getNivelBadgeVariant(nivel: string): "secondary" | "outline" | "destructive" {
  switch (nivel) {
    case "Inicial":
      return "secondary"
    case "Intermedio":
      return "outline"
    case "Avanzado":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function AdminCursosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cursosList, setCursosList] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const { toast } = useToast()
  const { token } = useAuth()

  useEffect(() => {
    const loadCursos = async () => {
      if (token) {
        const cursos = await fetchAdminCursos(token)
        if (cursos.length > 0) {
          setCursosList(cursos)
        } else {
          setCursosList(getCursos())
        }
      } else {
        setCursosList(getCursos())
      }
      setLoading(false)
    }
    loadCursos()
  }, [token])

  const filteredCursos = cursosList.filter(curso => 
    curso.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCursos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCursos = filteredCursos.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    setDeletePending(true)
    try {
      if (token) {
        const success = await eliminarCursoAPI(token, deleteTargetId)
        if (success) {
          setCursosList(cursosList.filter(c => c.id !== deleteTargetId))
          toast({
            title: "Curso eliminado",
            description: "El curso ha sido eliminado exitosamente"
          })
          setDeleteTargetId(null)
          return
        }
      }
      deleteCurso(deleteTargetId)
      setCursosList(getCursos())
      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado exitosamente"
      })
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Gestión de Cursos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra todos tus cursos y contenido educativo
          </p>
        </div>
        <Link
          href="/admin/cursos/nuevo"
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo Curso
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-2xl bg-background p-4 shadow-sm border border-border sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <select className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Todas las categorías</option>
            <option>Oil Painting</option>
            <option>Watercolor</option>
            <option>Drawing</option>
          </select>
          <select className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Todos los niveles</option>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
      </motion.div>

      {/* Courses Table */}
      <motion.div variants={itemVariants} className="rounded-2xl bg-background shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Curso</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nivel</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alumnos</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCursos.map((curso) => (
                <tr key={curso.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={curso.image}
                          alt={curso.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{curso.title}</p>
                        <p className="text-sm text-muted-foreground">{curso.modalidad}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getNivelBadgeVariant(curso.nivel)}>
                      {curso.nivel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">${curso.precio}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {Math.floor(Math.random() * 100) + 20}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-foreground">{(4 + Math.random()).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/cursos/${curso.id}`}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/cursos/${curso.id}/edit`}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/cursos/${curso.id}/edit-modules`}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-secondary transition-colors"
                        title="Editar módulos"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => setDeleteTargetId(curso.id)}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de que querés eliminar este curso?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El curso será eliminado permanentemente.
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
              ))}
              {paginatedCursos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron cursos
                  </td>
                </tr>
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

      {/* Add Course Card */}
      <motion.div variants={itemVariants}>
        <Link
          href="/admin/cursos/nuevo"
          className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-6 transition-all hover:border-primary/60 hover:bg-primary/5 hover:shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Plus className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Agregar nuevo curso</p>
            <p className="text-sm text-muted-foreground">Crear un nuevo curso con módulos y lecciones</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}