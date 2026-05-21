"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Monitor } from "lucide-react"
import { getFeaturedCursos } from "@/lib/data"
import type { Curso } from "@/lib/data"

interface CoursesPreviewProps {
  cursos?: Curso[]
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
}

export function CoursesPreview({ cursos: propCursos }: CoursesPreviewProps) {
  const [displayedCourses, setDisplayedCourses] = useState<Curso[]>([])

  useEffect(() => {
    const courses = propCursos || getFeaturedCursos()
    setDisplayedCourses(courses.slice(0, 4))
  }, [propCursos])

  return (
    <section className="section-md bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <span className="kicker">Aprendé con Ana</span>
          <h2
            className="mt-6 font-serif font-light text-foreground"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Cursos <span className="font-semibold">Destacados</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground lg:text-lg">
            Talleres pensados para acompañarte desde donde estés. Sin apuro, con materia.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {displayedCourses.map((curso) => (
            <motion.div key={curso.id} variants={cardAnim} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}>
              <Link
                href={`/cursos/${curso.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-shadow duration-300 hover:shadow-hover"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={curso.image}
                    alt={curso.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">

                  {/* Level kicker */}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
                    {curso.nivel}
                  </span>

                  {/* Title */}
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-card-foreground">
                    {curso.title}
                  </h3>
                  {curso.subtitle && (
                    <p className="mt-1 text-sm italic leading-snug text-muted-foreground">
                      {curso.subtitle}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="my-4 h-px w-full bg-border" />

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 shrink-0" />
                      {curso.modalidad}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {curso.duracion}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-end justify-between">
                    <span className="font-serif text-2xl font-bold text-foreground">
                      ${curso.precio.toLocaleString("es-AR")}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-secondary-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <Link href="/cursos" className="group btn-primary">
            <span>Ver todos los cursos</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
