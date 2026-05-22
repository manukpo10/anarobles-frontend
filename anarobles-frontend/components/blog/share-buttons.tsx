"use client"

import { useState } from "react"
import { Link2, MessageCircle, Twitter } from "lucide-react"

interface ShareButtonsProps {
  titulo: string
  slug: string
}

export function ShareButtons({ titulo, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://anaceciliarobles.com/blog/${slug}`

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://anaceciliarobles.com/blog/${slug}`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 mr-1">
        Compartir
      </span>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        title={copied ? "¡Copiado!" : "Copiar enlace"}
        aria-label={copied ? "Enlace copiado" : "Copiar enlace"}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-105"
      >
        <Link2 className="h-4 w-4" />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
            ¡Copiado!
          </span>
        )}
      </button>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir por WhatsApp"
        aria-label="Compartir por WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" />
      </a>

      {/* Twitter/X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Compartir en Twitter/X"
        aria-label="Compartir en Twitter/X"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-105"
      >
        <Twitter className="h-4 w-4" />
      </a>
    </div>
  )
}
