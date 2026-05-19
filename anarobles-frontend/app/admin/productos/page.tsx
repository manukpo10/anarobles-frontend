"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react"
import { getProducts, deleteProduct, fetchAdminProductos, eliminarProductoAPI, type Product } from "@/lib/data"
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

export default function AdminProductosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [productsList, setProductsList] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const { toast } = useToast()
  const { token } = useAuth()

  useEffect(() => {
    const load = async () => {
      if (token) {
        const data = await fetchAdminProductos(token)
        if (data.length > 0) {
          setProductsList(data)
          return
        }
      }
      setProductsList(getProducts())
    }
    load()
  }, [token])

  const categories = Array.from(new Set(productsList.map(p => p.category)))

  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    setDeletePending(true)
    try {
      if (token) {
        const ok = await eliminarProductoAPI(token, deleteTargetId)
        if (ok) {
          const data = await fetchAdminProductos(token)
          setProductsList(data)
          toast({ title: "Producto eliminado", description: "Eliminado del servidor" })
          setDeleteTargetId(null)
          return
        }
      }
      deleteProduct(deleteTargetId)
      setProductsList(getProducts())
      toast({ title: "Producto eliminado", description: "El producto ha sido eliminado" })
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
              <BreadcrumbPage className="text-primary">Productos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Gestión de Productos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra tu catálogo de productos
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 transition-all hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-semibold text-foreground">{productsList.length}</p>
        </div>
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Destacados</p>
          <p className="text-2xl font-semibold text-secondary">{productsList.filter(p => p.featured).length}</p>
        </div>
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Categorías</p>
          <p className="text-2xl font-semibold text-primary">{categories.length}</p>
        </div>
        <div className="rounded-xl bg-background p-4 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-semibold text-foreground">
            ${productsList.reduce((acc, p) => acc + p.price, 0)}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-2xl bg-background p-4 shadow-sm border border-border sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
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

      {/* Products Table */}
      <motion.div variants={itemVariants} className="rounded-2xl bg-background shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.featured && (
                              <Badge variant="secondary" className="mr-2">
                                Destacado
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">${product.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/productos/${product.id}`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/productos/${product.id}/edit`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setDeleteTargetId(product.id)}
                              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro de que querés eliminar este producto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
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

      {filteredProducts.length === 0 && (
        <div className="rounded-2xl bg-background p-12 text-center shadow-sm border border-border">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium text-foreground">No se encontraron productos</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Intenta con otros términos de búsqueda o cambia los filtros
          </p>
        </div>
      )}

      {/* Add Product Card */}
      <motion.div variants={itemVariants}>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-6 transition-all hover:border-secondary/60 hover:bg-secondary/5 hover:shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
            <Plus className="h-7 w-7 text-secondary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Agregar nuevo producto</p>
            <p className="text-sm text-muted-foreground">Crear un nuevo producto para la tienda</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}