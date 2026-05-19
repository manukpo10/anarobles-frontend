"use client"

import { motion } from "framer-motion"
import { Palette, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-primary pb-32 pt-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        {/* Brush stroke */}
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0 50 Q300 20 600 50 T1200 50 L1200 100 L0 100 Z" fill="#194052"/>
        </svg>

        <div className="relative mx-auto max-w-3xl px-6 pt-20 text-center lg:px-8">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-4"
          >
            <span className="h-px w-8 bg-primary-foreground/40" />
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground/80">
              Cursos
            </span>
            <span className="h-px w-8 bg-primary-foreground/40" />
          </motion.div>

          {/* Coming soon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-5 py-2"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/90">Próximamente</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-5xl font-light tracking-tight text-primary-foreground md:text-7xl lg:text-8xl"
          >
            Cursos de <span className="italic">Arte</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/70"
          >
            Estamos preparando una experiencia de aprendizaje única para vos.
            Cursos guiados por Ana Cecilia, con el mismo cariño y dedicación que ponemos en cada obra.
          </motion.p>
        </div>
      </section>

      {/* Content section */}
      <section className="relative -mt-20 pb-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-background p-10 shadow-xl shadow-foreground/5 ring-1 ring-border/50 lg:p-14"
          >
            {/* Decorative line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            {/* Suggestion text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-base text-muted-foreground"
            >
              Mientras tanto, conocé mis obras en la galería o explorá la tienda.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/galeria"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Palette className="h-4 w-4" />
                Ir a la galería
              </Link>
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
              >
                Consultar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Brush stroke decoration */}
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-12 w-36 h-2 opacity-15"
              viewBox="0 0 160 12"
            >
              <path 
                d="M0 6 Q40 2 80 6 T160 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                className="text-primary"
              />
            </motion.svg>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
