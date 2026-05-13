"use client"

import { motion } from "framer-motion"

export function PoeticDivider() {
  return (
    <section className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Top decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 h-px w-32 bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
        />

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <span className="absolute -left-4 -top-8 font-serif text-7xl leading-none text-secondary/10 md:-left-8 md:text-8xl">
            &ldquo;
          </span>
          <p className="font-serif text-3xl font-light italic leading-relaxed text-foreground/80 md:text-4xl md:leading-relaxed">
            Donde los colores cuentan historias
            <br />
            <span className="text-foreground/60">y cada pincelada es un susurro del alma</span>
          </p>
          <span className="absolute -bottom-16 -right-4 font-serif text-7xl leading-none text-secondary/10 md:-right-8 md:text-8xl">
            &rdquo;
          </span>
        </motion.blockquote>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-20 h-px w-32 bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
        />
      </div>
    </section>
  )
}
