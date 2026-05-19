"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { aboutIntroData } from "@/lib/data"

interface AboutIntroProps {
  data?: typeof aboutIntroData
}

export function AboutIntro({ data = aboutIntroData }: AboutIntroProps) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image block */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[400px] lg:mx-0 lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20">
              <Image
                src={data.image}
                alt={`Foto de ${data.eyebrow}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to gradient if image missing
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
              {/* Fallback overlay if image fails */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/30 to-primary/30">
                <span className="font-serif text-4xl text-secondary/40">Ana</span>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
          </motion.div>

          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-medium uppercase tracking-widest text-secondary"
            >
              {data.eyebrow}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 font-serif text-5xl md:text-6xl text-foreground"
            >
              {data.headline}
            </motion.h2>

            <div className="mt-8 space-y-6">
              {data.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={data.ctaHref}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-4 text-sm font-semibold uppercase tracking-wider text-secondary-foreground shadow-lg shadow-secondary/20 transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/20"
              >
                <span>{data.ctaLabel}</span>
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}