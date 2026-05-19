"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Clock, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  Package,
  Users,
  BookOpen,
  Award,
  Play,
  Star
} from "lucide-react"
import { getCursos, fetchCursosFromAPI, type Curso } from "@/lib/data"

const categories = [
  { id: "all", label: "Todos" },
  { id: "Oil Painting", label: "Pintura al Óleo" },
  { id: "Watercolor", label: "Acuarela" },
  { id: "Drawing", label: "Dibujo" },
  { id: "Digital Art", label: "Arte Digital" },
  { id: "Mixed Media", label: "Técnicas Mixtas" },
] as const

type CategoryFilter = (typeof categories)[number]["id"]

export default function CursosPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all")
  const [cursosList, setCursosList] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCursos = async () => {
      const data = await fetchCursosFromAPI()
      if (data.length === 0) {
        setCursosList(getCursos())
      } else {
        setCursosList(data)
      }
      setLoading(false)
    }
    loadCursos()
  }, [])

  const filteredCursos = useMemo(() =>
    activeFilter === "all"
      ? cursosList
      : cursosList.filter((c) => c.category === activeFilter),
    [activeFilter, cursosList]
  )

  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-28 lg:py-40">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        {/* Artistic brush stroke */}
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0 50 Q300 20 600 50 T1200 50 L1200 100 L0 100 Z" fill="#194052"/>
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-4"
          >
            <span className="h-px w-12 bg-secondary/60" />
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-secondary">
              Academia
            </span>
            <span className="h-px w-12 bg-secondary/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 font-serif text-6xl font-light tracking-tight text-primary-foreground md:text-7xl lg:text-8xl"
          >
            Cursos de <span className="italic">Arte</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-primary-foreground/70"
          >
            Aprendé a crear desde la sensibilidad y la técnica. 
            Cursos pensados para todos los niveles, con acompañamiento personalizado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Users className="h-5 w-5" />
              <span className="text-sm">+500 alumnos</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">10 cursos</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Award className="h-5 w-5" />
              <span className="text-sm">Certificados</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border/30 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Filtrar</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto py-1 md:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeFilter === category.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <span className="hidden text-sm text-muted-foreground lg:block">
              {filteredCursos.length} cursos
            </span>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-muted-foreground">Cargando cursos...</p>
            </div>
          )}
          {/* Featured Course */}
          {activeFilter === "all" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="mb-8 flex items-center gap-4">
                <Sparkles className="h-5 w-5 text-secondary" />
                <h2 className="font-serif text-2xl font-medium text-foreground">
                  Curso destacado
                </h2>
              </div>
              
              <Link href={`/cursos/1`} className="group block">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-3xl bg-muted/50"
                >
                  <div className="grid lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-video lg:aspect-auto lg:h-full">
                      <Image
                        src="/artwork-1.jpg"
                        alt="Pintura al Óleo: Iniciación"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/20 lg:block hidden" />
                      
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex h-20 w-20 items-center justify-center rounded-full bg-background/90 shadow-xl backdrop-blur-sm"
                        >
                          <Play className="ml-1 h-8 w-8 text-primary" fill="currentColor" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12">
                      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                        <Sparkles className="h-3 w-3" />
                        Destacado
                      </span>
                      
                      <h3 className="mt-6 font-serif text-3xl font-medium text-foreground lg:text-4xl">
                        Pintura al Óleo: Iniciación
                      </h3>
                      
                      <p className="mt-4 leading-relaxed text-muted-foreground">
                        Un recorrido por los fundamentos de la pintura al óleo: preparación de la paleta, 
                        mezcla de colores, capas y veladuras. Trabajaremos sobre tres obras propias 
                        durante el cursado.
                      </p>

                      <div className="mt-8 flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          8 semanas
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          Nivel Inicial
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          128 alumnos
                        </div>
                      </div>

                      <div className="mt-10 flex items-center gap-6">
                        <span className="font-serif text-4xl font-semibold text-primary">
                          $12.000
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Ver curso
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* All Courses Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex items-center gap-4"
          >
            <h2 className="font-serif text-2xl font-medium text-foreground">
              {activeFilter === "all" ? "Todos los cursos" : categories.find(c => c.id === activeFilter)?.label}
            </h2>
          </motion.div>

          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredCursos.map((curso, index) => (
                <motion.div
                  key={curso.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group"
                >
                  <Link href={`/cursos/${curso.id}`} className="block h-full">
                    {/* Course Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-muted/30 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-foreground/5">
                      {/* Image */}
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={curso.image}
                          alt={curso.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Badges */}
                        <div className="absolute left-4 top-4 flex flex-col gap-2">
                          {curso.featured && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                              <Sparkles className="h-3 w-3" />
                              Destacado
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                            <BookOpen className="h-3 w-3" />
                            {curso.nivel}
                          </span>
                        </div>

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-background/90 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                          >
                            <Play className="ml-0.5 h-6 w-6 text-primary" fill="currentColor" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <span>{curso.modalidad}</span>
                          <span>·</span>
                          <span>{curso.duracion}</span>
                        </div>

                        <h3 className="mt-3 font-serif text-xl font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
                          {curso.title}
                        </h3>

                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {curso.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-secondary text-secondary" />
                            <span className="text-sm font-medium text-foreground">4.9</span>
                            <span className="text-xs text-muted-foreground">(64)</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-2xl font-semibold text-primary">
                              ${curso.precio.toLocaleString("es-AR")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCursos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-32 text-center"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="font-serif text-xl text-foreground">
                No hay cursos en esta categoría
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Ver todos los cursos
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles className="mx-auto h-12 w-12 text-secondary" />
            <h2 className="mt-6 font-serif text-4xl font-light text-foreground md:text-5xl">
              ¿No sabés por dónde <span className="italic">empezar</span>?
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Escribime y te ayudo a encontrar el curso ideal para tu nivel e intereses. 
              La primera consulta es gratuita.
            </p>
            <Link
              href="/contacto"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Consultar sin compromiso
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}