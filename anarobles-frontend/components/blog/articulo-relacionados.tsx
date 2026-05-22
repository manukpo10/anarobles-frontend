import { getArticulosRelacionados } from "@/lib/articulos"
import { BlogCard } from "./blog-card"

interface ArticuloRelacionadosProps {
  slugs: string[]
}

export function ArticuloRelacionados({ slugs }: ArticuloRelacionadosProps) {
  const relacionados = getArticulosRelacionados(slugs)

  if (relacionados.length === 0) return null

  return (
    <section className="section-sm border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="kicker">Seguí explorando</span>
          <h2
            className="mt-4 font-serif font-light text-foreground"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            También te puede interesar
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relacionados.map((articulo) => (
            <BlogCard key={articulo.slug} articulo={articulo} />
          ))}
        </div>
      </div>
    </section>
  )
}
