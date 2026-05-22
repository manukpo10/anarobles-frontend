"use client"

import { motion } from "framer-motion"

export function ProductosHeader() {
  return (
    <header className="relative overflow-hidden bg-secondary noise-texture pb-16 pt-36 lg:pt-44 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />

      <span
        className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 font-serif font-bold text-secondary-foreground/5 select-none leading-none"
        style={{ fontSize: "30rem", lineHeight: 1 }}
        aria-hidden="true"
      >
        P
      </span>

      <div className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary"
            >
              <span className="h-px w-8 bg-primary/50" />
              Tienda &amp; Obras
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-serif font-light leading-none tracking-tight text-secondary-foreground"
              style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
            >
              Productos
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-0.5 w-16 origin-left bg-primary"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-serif text-xl italic text-secondary-foreground/55 lg:text-2xl"
            >
              Llevate una obra original o una pieza especial a tu espacio
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col items-end gap-1"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Próximamente
            </span>
          </motion.div>

        </div>
      </div>
    </header>
  )
}
