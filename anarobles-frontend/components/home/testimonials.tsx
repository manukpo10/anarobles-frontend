"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { User } from "lucide-react"
import { getTestimonials } from "@/lib/data"
import type { Testimonial } from "@/lib/data"

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

export function Testimonials({ testimonials = getTestimonials() }: TestimonialsProps) {
  if (testimonials.length === 0) return null

  const [main, ...sides] = testimonials

  return (
    <section className="section-md bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <span className="kicker">Testimonios</span>
          <h2
            className="mt-6 font-serif font-light text-foreground"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Lo que dicen <span className="font-semibold">mis alumnos</span>
          </h2>
        </motion.div>

        {/* Asymmetric layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

          {/* Main testimonial — large, dominant */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col justify-between rounded-2xl bg-secondary p-8 shadow-float lg:p-10"
          >
            {/* Large decorative quote */}
            <span
              className="font-serif leading-none text-secondary-foreground/8 select-none"
              style={{ fontSize: "8rem", lineHeight: 0.7 }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Quote */}
            <blockquote className="-mt-4 flex-1">
              <p className="font-serif text-xl font-light italic leading-relaxed text-secondary-foreground lg:text-2xl">
                &ldquo;{main.quote}&rdquo;
              </p>
            </blockquote>

            {/* Thin rule */}
            <div className="my-8 h-px w-16 bg-primary/50" />

            {/* Author */}
            <footer className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary-foreground/10">
                {main.avatar ? (
                  <Image
                    src={main.avatar}
                    alt={main.author}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-secondary-foreground/50" />
                )}
              </div>
              <div>
                <p className="font-semibold text-secondary-foreground">{main.author}</p>
                <p className="mt-0.5 text-xs text-secondary-foreground/55">{main.context}</p>
              </div>
            </footer>
          </motion.article>

          {/* Side testimonials — compact stack */}
          <div className="flex flex-col gap-6">
            {sides.map((t, index) => (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-1 flex-col rounded-2xl bg-card p-6 shadow-card"
              >
                {/* Small quote mark */}
                <span
                  className="font-serif leading-none text-secondary/15 select-none"
                  style={{ fontSize: "3.5rem", lineHeight: 0.8 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <blockquote className="-mt-1 flex-1">
                  <p className="font-serif text-base italic leading-relaxed text-card-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>

                <footer className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.author}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.context}</p>
                  </div>
                </footer>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
