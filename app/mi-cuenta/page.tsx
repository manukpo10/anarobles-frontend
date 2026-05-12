"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Lock, Bell, CreditCard, BookOpen, Package, Heart, ChevronRight, Save } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"
import { getUserEnrollments, getCursoById, getCourseProgress, getUserPurchases, fetchMisCursos, fetchMisOrdenes, type Inscripcion, type Orden } from "@/lib/data"

const tabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "orders", label: "Mis Pedidos", icon: Package },
  { id: "courses", label: "Mis Cursos", icon: BookOpen },
  { id: "wishlist", label: "Lista de Deseos", icon: Heart },
]

export default function MiCuentaPage() {
  return (
    <Suspense fallback={null}>
      <MiCuentaContent />
    </Suspense>
  )
}

function MiCuentaContent() {
  const { user, token, updateUser } = useAuth()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "profile"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+54 11 1234 5678",
    address: "Calle Falsa 123, Buenos Aires, Argentina",
  })
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [backendOrders, setBackendOrders] = useState<Orden[]>([])
  const [backendInscripciones, setBackendInscripciones] = useState<Inscripcion[]>([])

  useEffect(() => {
    const loadFromBackend = async () => {
      if (!token) return
      const [ordenes, inscripciones] = await Promise.all([
        fetchMisOrdenes(token),
        fetchMisCursos(token),
      ])
      setBackendOrders(ordenes)
      setBackendInscripciones(inscripciones)

      if (inscripciones.length > 0) {
        setEnrolledCourses(inscripciones.map(i => ({
          id: String(i.cursoId),
          title: i.cursoTitulo,
          image: i.cursoImagen,
        })))
      }

      if (ordenes.length > 0) {
        const flat = ordenes.flatMap(o => o.items.map(it => ({
          id: `${o.externalReference}-${it.id}`,
          productId: String(it.referenciaId),
          productName: it.titulo,
          price: it.precio,
          quantity: it.cantidad,
          image: it.imagen,
          date: o.createdAt,
          estado: o.estado,
        })))
        setPurchases(flat)
      }
    }
    loadFromBackend()
  }, [token])

  useEffect(() => {
    // Only seed localStorage if user exists and no backend data available
    if (user && backendInscripciones.length === 0 && backendOrders.length === 0) {
      // Seed localStorage for offline fallback - but don't overwrite backend data
      const existingEnrollments = JSON.parse(localStorage.getItem("enrollments") || "{}")
      if (!existingEnrollments[user.id] || existingEnrollments[user.id].length === 0) {
        existingEnrollments[user.id] = ["1"]
        localStorage.setItem("enrollments", JSON.stringify(existingEnrollments))
        
        const progress = JSON.parse(localStorage.getItem("progress") || "{}")
        if (!progress[user.id]) progress[user.id] = {}
        progress[user.id]["1"] = ["l1", "l2"]
        localStorage.setItem("progress", JSON.stringify(progress))
      }
      
      const existingPurchases = JSON.parse(localStorage.getItem("purchases") || "{}")
      if (!existingPurchases[user.id] || existingPurchases[user.id].length === 0) {
        existingPurchases[user.id] = [
          { id: `PUR-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, productId: "1", productName: "Print Despertar Carmesí", price: 85, quantity: 1, image: "/artwork-1.jpg", date: "2026-03-15T10:00:00.000Z" }
        ]
        localStorage.setItem("purchases", JSON.stringify(existingPurchases))
      }
    }
  }, [user, backendInscripciones.length, backendOrders.length])

  // Use backend data as primary, fallback to localStorage only for display
  const displayEnrollments = backendInscripciones.length > 0 
    ? backendInscripciones.map(i => ({
        id: String(i.cursoId),
        title: i.cursoTitulo,
        image: i.cursoImagen,
      }))
    : enrolledCourses

  const displayPurchases = backendOrders.length > 0
    ? backendOrders.flatMap(o => o.items.map(it => ({
        id: `${o.externalReference}-${it.id}`,
        productId: String(it.referenciaId),
        productName: it.titulo,
        price: it.precio,
        quantity: it.cantidad,
        image: it.imagen,
        date: o.createdAt,
        estado: o.estado,
      })))
    : purchases

  const handleSave = () => {
    updateUser({ name: formData.name, email: formData.email })
    setIsEditing(false)
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <h1 className="font-serif text-4xl font-light text-foreground">
                Mi <span className="italic">Cuenta</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Gestiona tu perfil y preferencias
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="rounded-2xl bg-background p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                      <span className="text-2xl font-semibold text-secondary">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                        <ChevronRight className={`ml-auto h-4 w-4 ${activeTab === tab.id ? "" : "opacity-0"}`} />
                      </button>
                    ))}
                  </nav>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div variants={itemVariants} className="lg:col-span-3">
                {activeTab === "profile" && (
                  <div className="rounded-2xl bg-background p-8 shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="font-serif text-2xl font-medium text-foreground">Información Personal</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Actualiza tu información de perfil</p>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="rounded-full bg-primary/10 px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          Editar Perfil
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="rounded-full bg-muted px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            <Save className="h-4 w-4" />
                            Guardar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Nombre completo
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          Dirección de envío
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          disabled={!isEditing}
                          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div className="mt-8 border-t border-border pt-8">
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Cambiar Contraseña
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <input
                          type="password"
                          placeholder="Contraseña actual"
                          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <input
                          type="password"
                          placeholder="Nueva contraseña"
                          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <input
                          type="password"
                          placeholder="Confirmar contraseña"
                          className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <button className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                        Actualizar Contraseña
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="rounded-2xl bg-background p-8 shadow-sm border border-border">
                    <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Mis Pedidos</h2>
                    <div className="space-y-4">
                      {displayPurchases.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                          <p className="text-muted-foreground mb-4">No tienes ningún pedido</p>
                          <Link
                            href="/productos"
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            Ver productos
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      ) : (
                        displayPurchases.map((purchase) => (
                          <div key={purchase.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                                <img src={purchase.image} alt={purchase.productName} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{purchase.productName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(purchase.date).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                                </p>
                                <p className="text-xs text-muted-foreground">Cantidad: {purchase.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-foreground">${(purchase.price * purchase.quantity).toLocaleString("es-AR")}</p>
                              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                Completado
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="rounded-2xl bg-background p-8 shadow-sm border border-border">
                    <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Mis Cursos</h2>
                    {displayEnrollments.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No estás inscripto en ningún curso</p>
                        <Link
                          href="/cursos"
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Ver todos los cursos
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {displayEnrollments.map((course: any) => {
                          const progress = getCourseProgress(user?.id || "", course.id)
                          const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + m.lessons.length, 0) || 0
                          return (
                            <div key={course.id} className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted shrink-0">
                                {course.image ? (
                                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-foreground truncate">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {totalLessons} lecciones
                                </p>
                                <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{progress}% completado</p>
                                <Link
                                  href={`/cursos/${course.id}`}
                                  className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  Continuar aprendiendo
                                  <ChevronRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div className="rounded-2xl bg-background p-8 shadow-sm border border-border">
                    <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Mi Lista de Deseos</h2>
                    <p className="text-muted-foreground text-center py-8">
                      Tu lista de deseos está vacía
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}