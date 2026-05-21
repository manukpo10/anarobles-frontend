"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      {/* Background image + overlays */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/fondo1.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/55 to-primary/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/35 via-transparent to-primary/15" />
      </div>

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />

      {/* Logo watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
        <div className="relative h-56 w-[480px] sm:h-72 sm:w-[600px] lg:h-96 lg:w-[760px]">
          <Image
            src="/logo_transparente.png"
            alt=""
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-10"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-4"
          >
            <span className="h-px w-12 bg-primary-foreground/30" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground/60">
              Artista Plástica
            </span>
            <span className="h-px w-12 bg-primary-foreground/30" />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif leading-[0.95] tracking-tight text-primary-foreground"
            style={{ fontSize: "clamp(3.5rem, 12vw, 7.5rem)" }}
          >
            Ana Cecilia
            <span className="block font-semibold italic">Robles</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-md text-lg leading-relaxed text-primary-foreground/65 md:text-xl"
          >
            Donde los colores cuentan historias y cada pincelada es un susurro del alma
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/cursos"
              className="group inline-flex items-center gap-3 rounded-full bg-secondary px-9 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-secondary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-accent/25"
            >
              <span>Ver Cursos</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sobre-mi"
              className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/25 px-9 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/85 transition-all duration-300 hover:border-primary-foreground/60 hover:bg-primary-foreground/8"
            >
              Conocé a Ana
            </Link>
          </motion.div>

          {/* Thin decorative rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-32 bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent"
          />
        </motion.div>
      </div>

      {/* Scroll indicator — vertical line, no text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="scroll-line" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/40" />
      </motion.div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
