"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, Sparkles } from "lucide-react"
import { getFeaturedCursos, type Curso } from "@/lib/data"
import { Carousel } from "@/components/ui/carousel"

export function FeaturedWorks() {
  const [featuredCursos, setFeaturedCursos] = useState<Curso[]>([])

  useEffect(() => {
    setFeaturedCursos(getFeaturedCursos().slice(0, 6))
  }, [])

  if (featuredCursos.length === 0) return null

  const cursoCards = featuredCursos.map((curso) => (
    <Link key={curso.id} href={`/cursos/${curso.id}`} className="group block h-full">
      <motion.div 
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-lg transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20"
      >
        <Image
          src={curso.image}
          alt={curso.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Top badges - visible on hover */}
        <div className="absolute left-5 top-5 flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground shadow-md">
            {curso.nivel}
          </span>
          {curso.featured && (
            <span className="flex items-center gap-1.5 rounded-full bg-secondary/95 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
              Destacado
            </span>
          )}
        </div>

        {/* Content overlay at bottom - visible on hover */}
        <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/90">
            {curso.modalidad}
          </p>
          <h3 className="font-serif text-2xl font-semibold leading-tight text-primary-foreground drop-shadow-md">
            {curso.title}
          </h3>
          <div className="mt-4 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/80">
              <Clock className="h-4 w-4" />
              {curso.duracion}
            </span>
            <span className="ml-auto font-serif text-2xl font-bold text-primary-foreground drop-shadow-md">
              ${curso.precio.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Hover arrow indicator */}
        <span 
          className="absolute bottom-6 right-6 flex h-12 w-12 translate-x-4 items-center justify-center rounded-full bg-secondary opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-110"
        >
          <ArrowRight className="h-5 w-5 text-secondary-foreground" />
        </span>
      </motion.div>
    </Link>
  ))

  return (
    <section className="group/section bg-background py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-secondary"
          >
            <span className="h-px w-12 bg-secondary/60" />
            Cursos
            <span className="h-px w-12 bg-secondary/60" />
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-6xl font-light tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            Talleres{' '}
            <span className="font-semibold text-gradient">Destacados</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Una selección de los cursos más buscados, pensados para acompañarte
            sin importar el punto del camino en el que estés.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <Carousel items={cursoCards} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <Link
            href="/cursos"
            className="group inline-flex items-center gap-4 rounded-full border-2 border-foreground/20 bg-background px-10 py-5 text-sm font-semibold uppercase tracking-wider text-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20"
          >
            Ver todos los cursos
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}