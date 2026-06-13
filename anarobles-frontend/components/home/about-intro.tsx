"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { aboutIntroData } from "@/lib/data"

const ARTIST_IMAGES = [
  "/artista1.jpeg",
  "/artista2.jpeg",
  "/artista3.jpeg",
  "/artista4.jpg",
]

interface AboutIntroProps {
  data?: typeof aboutIntroData
}

export function AboutIntro({ data = aboutIntroData }: AboutIntroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARTIST_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section-md overflow-hidden noise-texture bg-background">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-[52%_48%]">

          {/* ── Image block ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-12 lg:mb-0 lg:pr-16"
          >
            {/* Orange L-bracket — now pops on dark */}
            <div
              className="absolute -bottom-4 -left-4 z-0 hidden lg:block"
              aria-hidden="true"
              style={{
                width: "40%",
                height: "50%",
                borderBottom: "3px solid oklch(0.718 0.176 41)",
                borderLeft: "3px solid oklch(0.718 0.176 41)",
              }}
            />

            {/* Photo */}
            <div className="relative z-10 aspect-[3/4] w-full overflow-hidden bg-secondary/50" style={{ borderRadius: 0 }}>
              {ARTIST_IMAGES.map((src, i) => (
                <div
                  key={src}
                  className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
                  style={{ opacity: i === currentIndex ? 1 : 0 }}
                >
                  <Image
                    src={src}
                    alt={`Foto de ${data.eyebrow}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 90vw, 52vw"
                  />
                </div>
              ))}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center">
                <span className="font-serif text-5xl text-foreground/10">Ana</span>
              </div>
            </div>

            {/* Floating label */}
            <div className="absolute bottom-8 right-0 z-20 hidden lg:block">
              <div className="bg-primary px-5 py-3 shadow-float">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground/70">
                  Artista Plástica
                </p>
                <p className="mt-0.5 font-serif text-base font-semibold text-primary-foreground">
                  Buenos Aires, Argentina
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Text block ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start"
          >
            {/* Kicker */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="kicker"
            >
              {data.eyebrow}
            </motion.span>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-serif font-light text-foreground leading-tight"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
            >
              {data.headline}
            </motion.h2>

            {/* Orange rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 h-0.5 w-12 origin-left bg-primary"
            />

            {/* Body */}
            <div className="mt-6 space-y-5">
              {data.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-lg leading-relaxed text-foreground/65 lg:text-xl"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10"
            >
              <Link href={data.ctaHref} className="group btn-primary">
                <span>{data.ctaLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
