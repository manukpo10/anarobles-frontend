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
    <section className="section-sm relative overflow-hidden bg-primary">
      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Ambient blobs — subtle, on orange bg */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-foreground/8 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

      {/* Large decorative character */}
      <span
        className="pointer-events-none absolute -right-8 -top-8 font-serif font-bold text-primary-foreground/5 select-none leading-none"
        style={{ fontSize: "22rem", lineHeight: 1 }}
        aria-hidden="true"
      >
        A
      </span>

      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Kicker on orange */}
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary-foreground/55">
            <span className="h-px w-8 bg-primary-foreground/30" />
            Comunidad
            <span className="h-px w-8 bg-primary-foreground/30" />
          </span>

          <h2
            className="mt-6 font-serif font-light text-primary-foreground"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
          >
            {data.headline}
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/70">
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
