"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getFeaturedCursos } from "@/lib/data"
import type { Curso } from "@/lib/data"

interface CoursesPreviewProps {
  cursos?: Curso[]
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function CoursesPreview({ cursos = getFeaturedCursos() }: CoursesPreviewProps) {
  const displayedCourses = cursos.slice(0, 4)

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-secondary">
            Aprendé con Ana
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
            Cursos Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Encontrá tu próximo taller y empezá a explorar tu creatividad
          </p>
        </motion.div>

        {/* Course cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {displayedCourses.map((curso) => (
            <motion.div
              key={curso.id}
              variants={cardVariant}
              initial="hidden"
              animate="show"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href={`/cursos/${curso.id}`}
                className="group block overflow-hidden rounded-2xl bg-card shadow-lg shadow-secondary/10 transition-shadow duration-400 hover:shadow-xl hover:shadow-secondary/20"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={curso.image}
                    alt={curso.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                </div>

                {/* Card content */}
                <div className="p-6">
                  {/* Nivel badge */}
                  <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                    {curso.nivel}
                  </span>

                  {/* Title */}
                  <h3 className="mt-4 font-serif text-xl font-semibold text-card-foreground">
                    {curso.title}
                  </h3>

                  {/* Meta info */}
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {curso.modalidad}
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-foreground">
                      ${curso.precio.toLocaleString("es-AR")}
                    </span>
                    <span className="text-xs text-muted-foreground">{curso.duracion}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <Link
            href="/cursos"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-secondary px-10 py-4 text-sm font-semibold uppercase tracking-wider text-secondary transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground"
          >
            <span>Ver todos los cursos</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}