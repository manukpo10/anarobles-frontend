import Link from "next/link"
import Image from "next/image"
import type { Articulo } from "@/lib/articulos"
import { CATEGORIA_LABELS, formatFecha } from "@/lib/articulos"

interface BlogCardProps {
  articulo: Articulo
  priority?: boolean
}

export function BlogCard({ articulo, priority = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${articulo.slug}`}
      className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={articulo.imagenDestacada}
          alt={articulo.imagenDestacadaAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category chip */}
        <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full px-2.5 py-0.5">
          {CATEGORIA_LABELS[articulo.categoria]}
        </span>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground mt-2 line-clamp-2">
          {articulo.titulo}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {articulo.resumen}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground/70">
          <span>{formatFecha(articulo.fechaPublicacion)}</span>
          <span aria-hidden="true">·</span>
          <span>{articulo.tiempoLectura} min de lectura</span>
        </div>
      </div>
    </Link>
  )
}
