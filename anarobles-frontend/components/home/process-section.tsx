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

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

export function ProcessSection({ phases = getProcessPhases() }: ProcessSectionProps) {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-secondary">
            Mi Proceso
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
            Del Idea a la Obra
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Cada pieza pasa por un viaje creativo que transforma emociones en arte tangible
          </p>
        </motion.div>

        {/* Zigzag phases */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-16"
        >
          {phases.map((phase, index) => {
            const isEven = index % 2 === 1
            const IconComponent = iconMap[phase.icon] || Sparkles

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content side */}
                <div
                  className={`flex flex-col ${
                    isEven ? "lg:pl-16 lg:text-right" : "lg:pr-16"
                  }`}
                >
                  {/* Large decorative phase number */}
                  <span
                    className={`font-serif text-[120px] leading-none text-secondary/10 ${
                      isEven ? "lg:ml-auto" : ""
                    }`}
                    style={{ fontSize: "clamp(80px, 15vw, 120px)" }}
                  >
                    {phase.phaseNumber}
                  </span>

                  <div className={`mt-4 flex items-center gap-4 ${isEven ? "lg:justify-end" : ""}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-3xl font-semibold text-foreground">
                      {phase.title}
                    </h3>
                  </div>

                  <p
                    className={`mt-6 text-lg leading-relaxed text-muted-foreground ${
                      isEven ? "lg:ml-auto lg:max-w-lg" : "lg:max-w-lg"
                    }`}
                  >
                    {phase.description}
                  </p>
                </div>

                {/* Visual side - decorative circle with icon */}
                <div className="flex items-center justify-center">
                  <div className="relative h-64 w-64">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/5" />
                    <div
                      className={`absolute inset-4 rounded-full bg-secondary/10 ${
                        isEven ? "animate-pulse" : ""
                      }`}
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className={`absolute inset-8 rounded-full bg-secondary/15 ${
                        !isEven ? "animate-pulse" : ""
                      }`}
                      style={{ animationDelay: "1s" }}
                    />

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary shadow-lg">
                        <IconComponent className="h-12 w-12 text-secondary-foreground" />
                      </div>
                    </div>

                    {/* Decorative dots */}
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-3 w-3 rounded-full bg-primary"
                        style={{
                          top: `${15 + i * 25}%`,
                          left: isEven ? "5%" : "95%",
                          transform: "translateX(-50%)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}