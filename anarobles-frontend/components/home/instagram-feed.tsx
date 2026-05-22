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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const itemAnim = {
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1 },
}

export function InstagramFeed({
  images = defaultImages,
  instagramUrl = defaultInstagramUrl,
}: InstagramFeedProps) {
  return (
    <section className="section-sm bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <span className="kicker">Instagram</span>
          <h2
            className="mt-6 font-serif font-light text-foreground"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Seguime en{" "}
            <span className="font-bold text-primary">@anaroblesartedibujo</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-3 gap-1 sm:grid-cols-6 sm:gap-1.5"
        >
          {images.map((img) => (
            <motion.a
              key={img.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemAnim}
              className="group relative aspect-square overflow-hidden rounded-none bg-muted"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 16vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors duration-300 group-hover:bg-primary/75">
                <Instagram className="h-7 w-7 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center"
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group btn-ghost"
          >
            <Instagram className="h-4 w-4" />
            <span>Seguime en Instagram</span>
          </a>
        </motion.div>

      </div>
    </section>
  )
}
