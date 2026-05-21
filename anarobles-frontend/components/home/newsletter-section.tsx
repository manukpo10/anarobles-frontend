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
  subtext: "Recibí novedades, avances de cursos y contenido exclusivo directo a tu correo.",
}

export function NewsletterSection({ data = defaultData }: NewsletterSectionProps) {
  return (
    <section className="section-sm relative overflow-hidden bg-secondary">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Kicker on dark */}
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary-foreground/50">
            <span className="h-px w-8 bg-secondary-foreground/25" />
            Comunidad
            <span className="h-px w-8 bg-secondary-foreground/25" />
          </span>

          <h2
            className="mt-6 font-serif font-light text-secondary-foreground"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            {data.headline}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-secondary-foreground/65">
            {data.subtext}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <NewsletterForm />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
