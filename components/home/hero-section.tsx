"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, Palette, Brush, Camera } from "lucide-react"

const features = [
  { icon: Palette, label: "Técnicas Mixtas" },
  { icon: Brush, label: "Arte Digital" },
  { icon: Camera, label: "Fotografía" },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      {/* Background with gradient layers */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/fondo1.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/60 to-primary/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-primary/20" />
      </div>

      {/* Decorative elements */}
      <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
      
      {/* Logo watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <div className="relative h-48 w-[400px] sm:h-64 sm:w-[550px] lg:h-80 lg:w-[700px]">
          <Image
            src="/logo_transparente.png"
            alt=""
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>
      </div>

      {/* Artistic brush stroke decoration */}
      <svg className="absolute right-20 top-1/4 w-40 h-40 opacity-10" viewBox="0 0 100 100">
        <path d="M10 50 Q30 20 50 50 T90 50" stroke="#194052" strokeWidth="2" fill="none"/>
        <path d="M10 60 Q40 30 60 60 T100 60" stroke="#D9622C" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Eyebrow with decorative lines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-4"
          >
            <span className="h-px w-16 bg-secondary" />
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-secondary">
              Artista Plástica
            </span>
            <span className="h-px w-16 bg-secondary" />
          </motion.div>

          {/* Main Title - elegant split */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-8xl font-light tracking-tight text-primary-foreground md:text-9xl lg:text-[10rem]"
          >
            Ana Cecilia
            <span className="block font-semibold">Robles</span>
          </motion.h1>

          {/* Subtitle - poetic */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl text-xl leading-relaxed text-primary-foreground/75 md:text-2xl"
          >
            Donde los colores cuentan historias y cada pincelada es un susurro del alma
          </motion.p>

          {/* Feature icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-8 pt-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 rounded-full bg-primary-foreground/10 px-5 py-3 backdrop-blur-sm"
              >
                <feature.icon className="h-5 w-5 text-secondary" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row"
          >
            <Link
              href="/cursos"
              className="group relative inline-flex items-center gap-4 rounded-full bg-secondary px-10 py-5 text-sm font-semibold uppercase tracking-wider text-secondary-foreground shadow-xl shadow-secondary/30 transition-all duration-400 hover:bg-accent hover:shadow-2xl hover:shadow-accent/30"
            >
              <span>Ver Cursos</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-2" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </Link>
            <Link
              href="/sobre-mi"
              className="group inline-flex items-center gap-4 rounded-full border-2 border-primary-foreground/30 px-10 py-5 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary/20"
            >
              <span>Conocer más</span>
            </Link>
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto h-px w-48 bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
          />
        </motion.div>
      </div>

      {/* Scroll Indicator - elegant design */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary-foreground/40">
            Scroll
          </span>
          <div className="relative">
            <ChevronDown className="h-6 w-6 text-primary-foreground/40" />
            <div className="absolute inset-0 animate-ping">
              <ChevronDown className="h-6 w-6 text-primary-foreground/20" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade to content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}