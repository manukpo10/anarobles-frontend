"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Monitor } from "lucide-react"
import { cursos as staticCursos } from "@/lib/data"
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
  const displayedCourses = (propCursos ?? staticCursos.filter((c) => c.featured)).slice(0, 4)

  return (
    <section className="section-md noise-texture overflow-hidden bg-background">
      {/* Warm accent blob */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

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
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Cursos <span className="font-bold text-primary">Destacados</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground lg:text-xl">
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
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card border border-border/70 shadow-sm ring-1 ring-black/[0.02] transition-all duration-500 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={curso.image}
                    alt={curso.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                  />
                  {/* Subtle gradient for depth and badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/10" aria-hidden="true" />

                  {/* Floating level badge */}
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-md ring-1 ring-black/[0.04]">
                    {curso.nivel}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">

                  {/* Title */}
                  <h3 className="font-serif text-xl font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
                    {curso.title}
                  </h3>
                  {curso.subtitle && (
                    <p className="mt-1.5 line-clamp-2 text-sm italic leading-snug text-muted-foreground">
                      {curso.subtitle}
                    </p>
                  )}

                  {/* Meta row */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                      {curso.modalidad}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                      {curso.duracion}
                    </span>
                  </div>

                  {/* Divider — pushes price to the bottom */}
                  <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Price */}
                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Desde
                      </span>
                      <span className="font-serif text-2xl font-bold leading-tight text-foreground">
                        ${curso.precio.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
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
          <Link href="/cursos" className="group btn-ghost">
            <span>Ver todos los cursos</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
