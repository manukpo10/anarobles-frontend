"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/contexts/auth-context"
import {
  actualizarArticuloAPI,
  fetchAdminArticuloByIdAPI,
  type Articulo,
} from "@/lib/articulos"
import { ArticuloForm } from "../../_components/articulo-form"

export default function EditarArticuloPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const id = String(params.id)

  const [articulo, setArticulo] = useState<Articulo | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!token) return
    let cancelado = false
    fetchAdminArticuloByIdAPI(token, id).then((a) => {
      if (cancelado) return
      if (!a) {
        toast.error("Error", { description: "No se encontró el artículo" })
        router.push("/admin/blog")
        return
      }
      setArticulo(a)
      setCargando(false)
    })
    return () => { cancelado = true }
  }, [token, id, router])

  if (cargando || !articulo) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    // key fuerza un form nuevo por artículo: sin él, el estado inicial del
    // formulario quedaría fijado al primero que se haya cargado.
    <ArticuloForm
      key={articulo.id}
      articulo={articulo}
      titulo="Editar artículo"
      subtitulo={articulo.titulo}
      textoBotón="Guardar cambios"
      onSubmit={(datos: Partial<Articulo>) =>
        token ? actualizarArticuloAPI(token, id, datos) : Promise.resolve(null)
      }
    />
  )
}
