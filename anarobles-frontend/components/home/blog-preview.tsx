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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function BlogPreview({ posts = getRecentPosts(3), limit = 3 }: BlogPreviewProps) {
  const [featured, ...secondary] = posts.slice(0, limit)

  if (!featured) return null

  return (
    <section className="section-md bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="kicker">Blog</span>
          <h2
            className="mt-6 font-serif font-light text-foreground"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Últimas <span className="font-semibold">Historias</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Artículos sobre técnicas, proceso creativo y el mundo del arte
          </p>
        </motion.div>

        {/* Magazine layout: large left + stack right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">

          {/* Featured article — large */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-shadow duration-300 hover:shadow-hover"
          >
            {/* Cover */}
            <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-[3/2]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 90vw, 58vw"
                priority
              />
              {/* Category pill */}
              <span className="absolute left-5 top-5 rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
                {featured.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-7 lg:p-8">
              <time className="text-xs text-muted-foreground">{formatDate(featured.date)}</time>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-card-foreground lg:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
                {featured.excerpt}
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="group/cta mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-accent"
              >
                Leer artículo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </motion.article>

          {/* Secondary articles — stacked */}
          <div className="flex flex-col gap-6">
            {secondary.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex overflow-hidden rounded-2xl bg-card shadow-card transition-shadow duration-300 hover:shadow-hover"
              >
                {/* Thumbnail */}
                <div className="relative w-36 shrink-0 overflow-hidden bg-muted sm:w-44">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="160px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-card-foreground">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group/cta inline-flex items-center gap-1.5 text-xs font-semibold text-secondary transition-colors hover:text-accent"
                    >
                      Leer
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <Link href="/blog" className="group btn-ghost">
            <span>Leer más artículos</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
