"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Package, Users, TrendingUp, Eye, DollarSign, ShoppingCart, Star, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const stats = [
  { label: "Total Cursos", value: "12", change: "+2 este mes", icon: BookOpen, color: "text-primary" },
  { label: "Productos", value: "48", change: "+5 esta semana", icon: Package, color: "text-secondary" },
  { label: "Alumnos", value: "523", change: "+23 nuevos", icon: Users, color: "text-green-500" },
  { label: "Ingresos", value: "$12,450", change: "+15% vs mes anterior", icon: DollarSign, color: "text-emerald-500" },
]

const recentActivity = [
  { id: 1, type: "purchase", message: "María García compró el curso 'Pintura al Óleo para Principiantes'", time: "Hace 5 minutos" },
  { id: 2, type: "review", message: "Nuevo review de 5 estrellas en 'Técnicas de Acuarela'", time: "Hace 23 minutos" },
  { id: 3, type: "enrollment", message: "Juan Pérez se inscribió en 'Arte Abstracto Intermedio'", time: "Hace 1 hora" },
  { id: 4, type: "purchase", message: "Ana López compró 'Set de Pinceles Profesionales'", time: "Hace 2 horas" },
  { id: 5, type: "review", message: "Nuevo review de 4 estrellas en 'Introducción al Dibujo'", time: "Hace 3 horas" },
]

const topCourses = [
  { name: "Pintura al Óleo para Principiantes", students: 156, revenue: "$3,900", rating: 4.9 },
  { name: "Técnicas de Acuarela Avanzadas", students: 98, revenue: "$2,450", rating: 4.8 },
  { name: "Arte Abstracto: Expresión Libre", students: 87, revenue: "$2,175", rating: 4.7 },
]

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

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Bienvenido, <span className="italic">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aquí está el resumen de tu academia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cursos/nuevo"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Curso
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/25 transition-all hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="rounded-2xl bg-background p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl bg-muted p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change.split(" ")[0]}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="rounded-2xl bg-background p-6 shadow-sm border border-border lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-medium text-foreground">Actividad Reciente</h2>
            <button className="text-sm text-primary hover:underline">Ver todo</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-xl bg-muted/50 p-4">
                <div className={`mt-1 rounded-full p-2 ${
                  activity.type === "purchase" ? "bg-secondary/10 text-secondary" :
                  activity.type === "review" ? "bg-yellow-100 text-yellow-600" :
                  "bg-primary/10 text-primary"
                }`}>
                  {activity.type === "purchase" && <ShoppingCart className="h-4 w-4" />}
                  {activity.type === "review" && <Star className="h-4 w-4" />}
                  {activity.type === "enrollment" && <Users className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Courses */}
        <motion.div variants={itemVariants} className="rounded-2xl bg-background p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-medium text-foreground">Cursos Populares</h2>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.name} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{course.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      {course.revenue}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <Star className="h-3 w-3 fill-current" />
                      {course.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl bg-primary/10 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
            Ver todos los cursos
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <h2 className="font-serif text-xl font-medium mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/cursos/nuevo"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-foreground/20 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/30"
          >
            <BookOpen className="h-4 w-4" />
            Crear nuevo curso
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
            Vista previa del sitio
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}