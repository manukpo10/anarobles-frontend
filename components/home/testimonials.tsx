"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { User } from "lucide-react"
import { getTestimonials } from "@/lib/data"
import type { Testimonial } from "@/lib/data"

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Testimonials({ testimonials = getTestimonials() }: TestimonialsProps) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-secondary">
            Testimonios
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
            Lo que dicen mis alumnos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Experiencias de quienes ya pasaron por mis talleres y cursos
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.id}
              variants={cardVariant}
              initial="hidden"
              animate="show"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col rounded-2xl bg-card p-8 shadow-lg"
            >
              {/* Large decorative quote mark */}
              <span className="font-serif text-8xl leading-none text-secondary/10">
                &ldquo;
              </span>

              {/* Quote text */}
              <blockquote className="relative z-10 mt-4 flex-1">
                <p className="font-serif text-lg italic leading-relaxed text-card-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Author info */}
              <footer className="mt-8 flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary/20">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-secondary" />
                  )}
                </div>

                {/* Name and context */}
                <div>
                  <p className="font-medium text-card-foreground">{testimonial.author}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{testimonial.context}</p>
                </div>
              </footer>

              {/* Bottom decorative line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}