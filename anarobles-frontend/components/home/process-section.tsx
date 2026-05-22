"use client"

import { motion } from "framer-motion"
import { Sparkles, Pencil, Palette, Check } from "lucide-react"
import { getProcessPhases } from "@/lib/data"
import type { ProcessPhase } from "@/lib/data"

interface ProcessSectionProps {
  phases?: ProcessPhase[]
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Pencil,
  Palette,
  Check,
}

export function ProcessSection({ phases = getProcessPhases() }: ProcessSectionProps) {
  return (
    <section className="section-lg relative bg-secondary overflow-hidden">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          {/* Kicker on dark */}
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary-foreground/50">
            <span className="h-px w-8 bg-secondary-foreground/25" />
            Mi Proceso
            <span className="h-px w-8 bg-secondary-foreground/25" />
          </span>
          <h2
            className="mt-6 font-serif font-light tracking-tight text-secondary-foreground"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Del Idea <span className="font-bold">a la Obra</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-secondary-foreground/65">
            Cada pieza pasa por un viaje creativo que transforma emociones en arte tangible
          </p>
        </motion.div>

        {/* Connecting line + phases — horizontal on desktop */}
        <div className="relative">

          {/* Horizontal connector line (desktop only) */}
          <div
            className="absolute left-0 right-0 hidden h-px bg-secondary-foreground/12 lg:block"
            style={{ top: "3rem" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {phases.map((phase, index) => {
              const IconComponent = iconMap[phase.icon] || Sparkles

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col items-center text-center lg:items-center"
                >
                  {/* Number + icon bubble */}
                  <div className="relative mb-8">
                    {/* Big decorative number behind */}
                    <span
                      className="absolute -top-5 left-1/2 -translate-x-1/2 font-serif font-bold text-secondary-foreground/6 select-none"
                      style={{ fontSize: "5rem", lineHeight: 1 }}
                      aria-hidden="true"
                    >
                      {phase.phaseNumber}
                    </span>

                    {/* Icon circle — sits on the horizontal line */}
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-float ring-4 ring-secondary">
                      <IconComponent className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Phase title */}
                  <h3 className="font-serif text-2xl font-semibold text-secondary-foreground">
                    {phase.title}
                  </h3>

                  {/* Thin rule */}
                  <div className="my-4 h-px w-8 bg-primary/60" />

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-secondary-foreground/65">
                    {phase.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
