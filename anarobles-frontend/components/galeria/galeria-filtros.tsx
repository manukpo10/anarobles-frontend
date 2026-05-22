"use client"

import { getCategorias, getAños } from "@/lib/obras"
import type { Categoria } from "@/lib/obras"

interface GaleriaFiltrosProps {
  categoriaActiva: "todas" | Categoria
  añoActivo: number | null
  onCategoria: (c: "todas" | Categoria) => void
  onAño: (a: number | null) => void
}

const LABEL: Record<string, string> = {
  todas:      "Todas",
  retratos:   "Retratos",
  naturaleza: "Naturaleza",
}

export function GaleriaFiltros({
  categoriaActiva,
  añoActivo,
  onCategoria,
  onAño,
}: GaleriaFiltrosProps) {
  const categorias: Array<"todas" | Categoria> = ["todas", ...getCategorias()]
  const años = getAños()

  return (
    <div className="sticky top-[4.5rem] z-30 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Horizontal scroll on mobile */}
        <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-none">

          {/* Category chips */}
          <div className="flex shrink-0 items-center gap-2">
            {categorias.map((cat) => {
              const active = categoriaActiva === cat
              return (
                <button
                  key={cat}
                  onClick={() => onCategoria(cat)}
                  className={[
                    "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {LABEL[cat] ?? cat}
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="hidden h-4 w-px shrink-0 bg-border lg:block" aria-hidden="true" />

          {/* Year chips */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onAño(null)}
              className={[
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
                añoActivo === null
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              Todos los años
            </button>
            {años.map((año) => {
              const active = añoActivo === año
              return (
                <button
                  key={año}
                  onClick={() => onAño(active ? null : año)}
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {año}
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
