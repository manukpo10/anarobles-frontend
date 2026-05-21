"use client"

import { motion } from "framer-motion"
import { obras } from "@/lib/obras"

export function GaleriaHeader() {
  const total      = obras.length
  const tecnicas   = Array.from(new Set(obras.map((o) => o.tecnica.split("—")[0].trim())))
  // Build a short technique summary: first 3 unique base techniques
  const tecSummary = tecnicas.slice(0, 3).join(" · ")

  return (
    <header className="relative border-b border-border/40 bg-background pb-14 pt-36 lg:pt-44 lg:pb-18">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">

          {/* Left — title block */}
          <div>
            {/* Eyebrow — meaningful, not repeated */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground"
            >
              {tecSummary}
            </motion.span>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-serif font-light leading-none tracking-tight text-foreground"
              style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)" }}
            >
              Galería
            </motion.h1>

            {/* Orange accent rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-px w-14 origin-left bg-primary"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-serif text-lg italic text-muted-foreground lg:text-xl"
            >
              Explorando formas, colores y emociones
            </motion.p>
          </div>

          {/* Right — obra count (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="hidden lg:flex flex-col items-end gap-1"
          >
            <span
              className="font-serif font-light leading-none text-foreground/8 select-none"
              style={{ fontSize: "5rem", lineHeight: 1 }}
              aria-hidden="true"
            >
              {String(total).padStart(2, "0")}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {total} obras
            </span>
          </motion.div>

        </div>
      </div>
    </header>
  )
}
