"use client"

import { motion } from "framer-motion"
import { NewsletterForm } from "@/components/newsletter-form"

interface NewsletterData {
  headline: string
  subtext: string
}

interface NewsletterSectionProps {
  data?: NewsletterData
}

const defaultData: NewsletterData = {
  headline: "Unirme a la comunidad",
  subtext:
    "Recibí novedades, avances de cursos y contenido exclusivo directo a tu correo.",
}

export function NewsletterSection({
  data = defaultData,
}: NewsletterSectionProps) {
  return (
    <section className="relative overflow-hidden bg-secondary py-20 lg:py-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/50 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-accent/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-serif text-4xl font-semibold text-secondary-foreground md:text-5xl">
            {data.headline}
          </h2>
          <p className="mt-4 text-lg text-secondary-foreground/80">
            {data.subtext}
          </p>

          {/* Newsletter form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <NewsletterForm />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decorative wave */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/20 to-transparent" />
    </section>
  )
}