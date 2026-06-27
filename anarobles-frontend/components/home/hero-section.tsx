"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/fondo1.jpeg')" }}
        />
      </div>

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Ambient blob — top right */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Logo watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025]">
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

      {/* Main content — centered */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-8 py-32 text-center lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <span className="h-px w-12 bg-white/50" />
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/90">
            Artista Plástica
          </span>
          <span className="h-px w-12 bg-white/50" />
        </motion.div>

        {/* Name — centered and dramatic */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-white"
          style={{
            fontSize: "clamp(3.5rem, 11vw, 8rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            textShadow: "2px 2px 8px rgba(0,0,0,0.8), 0px 0px 16px rgba(0,0,0,0.6), 0px 0px 24px rgba(0,0,0,0.4)",
          }}
        >
          Ana Cecilia
          <span className="block text-secondary" style={{ fontSize: "clamp(4rem, 12vw, 9rem)" }}>
            Robles
          </span>
        </motion.h1>

        {/* Thin orange rule — centered */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 mx-auto h-0.5 w-20 origin-center bg-primary"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 mx-auto text-lg leading-relaxed text-white md:text-xl"
          style={{
            maxWidth: "44ch",
            textShadow: "1px 1px 6px rgba(0,0,0,0.85), 0px 0px 12px rgba(0,0,0,0.55)",
          }}
        >
          Donde los colores cuentan historias y cada trazo es un susurro del alma
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/galeria"
            className="group inline-flex items-center gap-3 rounded-full bg-secondary px-9 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Ver obras</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 rounded-full border-2 px-9 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderColor: "#1A5276" }}
          >
            Encargar una obra
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator — centered bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <div className="scroll-line" />
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">
          Scroll
        </span>
      </motion.div>

      {/* Bottom fade to cream */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
