"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getRecentPosts } from "@/lib/data"
import type { BlogPost } from "@/lib/data"

interface BlogPreviewProps {
  posts?: BlogPost[]
  limit?: number
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export function BlogPreview({ posts = getRecentPosts(3), limit = 3 }: BlogPreviewProps) {
  const displayedPosts = posts.slice(0, limit)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

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
            Blog
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
            Últimas Historias
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Artículos sobre técnicas, proceso creativo y el mundo del arte
          </p>
        </motion.div>

        {/* Blog cards grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={cardVariant}
              initial="hidden"
              animate="show"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-lg"
            >
              {/* Cover image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Category badge */}
                <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl font-semibold text-card-foreground">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <time className="text-xs text-muted-foreground">
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group/cta inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-accent"
                  >
                    <span>Leer más</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 rounded-full bg-secondary px-10 py-4 text-sm font-semibold uppercase tracking-wider text-secondary-foreground shadow-lg shadow-secondary/20 transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/20"
          >
            <span>Leer más artículos</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}