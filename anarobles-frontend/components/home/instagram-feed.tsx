"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram } from "lucide-react"

interface Post {
  id: string
  permalink: string
  mediaUrl: string
  caption: string
}

const INSTAGRAM_URL = "https://www.instagram.com/anaroblesartedibujo/"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const itemAnim = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1 },
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {})
  }, [])

  if (posts.length === 0) return null

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
          {posts.map((post) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemAnim}
              className="group relative aspect-square overflow-hidden rounded-none bg-muted"
            >
              <Image
                src={post.mediaUrl}
                alt={post.caption || "Post de Instagram"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 16vw"
                unoptimized
              />
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
            href={INSTAGRAM_URL}
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
