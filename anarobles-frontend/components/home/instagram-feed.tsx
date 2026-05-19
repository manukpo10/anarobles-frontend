"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram } from "lucide-react"

interface InstagramImage {
  id: string
  src: string
  alt: string
}

interface InstagramFeedProps {
  images?: InstagramImage[]
  instagramUrl?: string
}

// TODO: integrar API de Instagram cuando esté disponible
const defaultImages: InstagramImage[] = [
  { id: "1", src: "/artwork-1.jpg", alt: "Pintura al óleo - obra 1" },
  { id: "2", src: "/artwork-2.jpg", alt: "Acuarela - obra 2" },
  { id: "3", src: "/artwork-3.jpg", alt: "Ilustración digital - obra 3" },
  { id: "4", src: "/artwork-4.jpg", alt: "Técnicas mixtas - obra 4" },
  { id: "5", src: "/artwork-5.jpg", alt: "Paisaje - obra 5" },
  { id: "6", src: "/artwork-6.jpg", alt: "Bodegón - obra 6" },
]

const defaultInstagramUrl = "https://www.instagram.com/anaroblesartedibujo/"

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
}

export function InstagramFeed({
  images = defaultImages,
  instagramUrl = defaultInstagramUrl,
}: InstagramFeedProps) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-secondary">
            Instagram
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
            Seguime en @anaroblesartedibujo
          </h2>
        </motion.div>

        {/* Instagram grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {images.map((img) => (
            <motion.a
              key={img.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariant}
              initial="hidden"
              animate="show"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors duration-300 group-hover:bg-primary/60">
                <Instagram className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-primary px-10 py-4 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <Instagram className="h-5 w-5" />
            <span>Seguime en Instagram</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}