"use client"

import { useAuth } from "@/contexts/auth-context"
import { crearArticuloAPI, type Articulo } from "@/lib/articulos"
import { ArticuloForm } from "../_components/articulo-form"

export default function NuevoArticuloPage() {
  const { token } = useAuth()

  return (
    <ArticuloForm
      titulo="Nuevo artículo"
      subtitulo="Escribí una entrada para el blog"
      textoBotón="Publicar artículo"
      onSubmit={(datos: Partial<Articulo>) =>
        token ? crearArticuloAPI(token, datos) : Promise.resolve(null)
      }
    />
  )
}
