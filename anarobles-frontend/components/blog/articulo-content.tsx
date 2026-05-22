"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface ArticuloContentProps {
  contenido: string
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="font-serif text-3xl font-semibold text-foreground mt-14 mb-5 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-serif text-2xl font-medium text-foreground mt-10 mb-4">
      {children}
    </h3>
  ),
  p: ({ children }) => {
    const hasImage = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && (child.type === "img" || !!(child.props as { src?: string }).src)
    )
    if (hasImage) return <div className="mb-6">{children}</div>
    return <p className="text-[1.0625rem] leading-[1.8] text-foreground/85 mb-6">{children}</p>
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary hover:underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 space-y-2 pl-6 list-disc">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 space-y-2 pl-6 list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[1.0625rem] leading-relaxed text-foreground/85 marker:text-primary">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-6 py-3 my-8 bg-primary/5 rounded-r-lg italic text-foreground/80">
      {children}
    </blockquote>
  ),
  img: ({ src, alt }) => (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || ""}
        alt={alt || ""}
        className="rounded-xl w-full object-cover"
      />
      {alt && (
        <figcaption className="text-sm text-center text-muted-foreground mt-3 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  hr: () => <hr className="my-10 border-border" />,
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      return (
        <code className="block bg-muted px-4 py-3 rounded-lg text-sm font-mono text-foreground/80 overflow-x-auto mb-6">
          {children}
        </code>
      )
    }
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground/80">
        {children}
      </code>
    )
  },
}

export function ArticuloContent({ contenido }: ArticuloContentProps) {
  return (
    <article className="max-w-[680px] mx-auto px-6 lg:px-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {contenido}
      </ReactMarkdown>
    </article>
  )
}
