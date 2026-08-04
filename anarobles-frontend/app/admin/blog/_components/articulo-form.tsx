"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Pencil, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { ArticuloContent } from "@/components/blog/articulo-content"
import {
  CATEGORIA_LABELS,
  fetchAdminArticulos,
  subirImagenArticuloAPI,
  type Articulo,
  type CategoriaSlug,
} from "@/lib/articulos"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const CATEGORIAS = Object.entries(CATEGORIA_LABELS) as [CategoriaSlug, string][]

/** "color, óleo,  pintura " → ["color", "óleo", "pintura"] */
const parseLista = (valor: string): string[] =>
  valor.split(",").map((v) => v.trim()).filter(Boolean)

const hoyISO = () => new Date().toISOString().slice(0, 10)

interface Props {
  /** Ausente = alta. Presente = edición de ese artículo. */
  articulo?: Articulo
  titulo: string
  subtitulo: string
  textoBotón: string
  onSubmit: (datos: Partial<Articulo>) => Promise<Articulo | null>
}

export function ArticuloForm({ articulo, titulo, subtitulo, textoBotón, onSubmit }: Props) {
  const router = useRouter()
  const { token } = useAuth()
  const esEdicion = !!articulo

  const [isLoading, setIsLoading] = useState(false)
  const [vistaPrevia, setVistaPrevia] = useState(false)
  const [otrosArticulos, setOtrosArticulos] = useState<Articulo[]>([])

  const [formData, setFormData] = useState({
    titulo: articulo?.titulo ?? "",
    subtitulo: articulo?.subtitulo ?? "",
    resumen: articulo?.resumen ?? "",
    categoria: (articulo?.categoria ?? "arte-y-tecnica") as CategoriaSlug,
    fechaPublicacion: articulo?.fechaPublicacion ?? hoyISO(),
    tiempoLectura: articulo?.tiempoLectura ? String(articulo.tiempoLectura) : "",
    imagenDestacadaAlt: articulo?.imagenDestacadaAlt ?? "",
    contenido: articulo?.contenido ?? "",
    metaDescripcion: articulo?.metaDescripcion ?? "",
    palabrasClave: (articulo?.palabrasClave ?? []).join(", "),
    destacado: articulo?.destacado ?? false,
    publicado: articulo?.publicado ?? true,
  })

  const [relacionados, setRelacionados] = useState<string[]>(articulo?.relacionados ?? [])
  const [imagen, setImagen] = useState<string>(articulo?.imagenDestacada ?? "")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // Para elegir artículos relacionados hace falta saber cuáles existen. Se excluye
  // el que se está editando: un artículo no puede relacionarse consigo mismo.
  useEffect(() => {
    if (!token) return
    let cancelado = false
    fetchAdminArticulos(token).then((lista) => {
      if (!cancelado) setOtrosArticulos(lista.filter((a) => a.slug !== articulo?.slug))
    })
    return () => { cancelado = true }
  }, [token, articulo?.slug])

  const palabrasCount = useMemo(
    () => (formData.contenido.trim() ? formData.contenido.trim().split(/\s+/).length : 0),
    [formData.contenido],
  )
  // Mismo cálculo que hace el backend cuando tiempoLectura llega vacío (200 ppm),
  // para que lo que se ve acá coincida con lo que se va a guardar.
  const lecturaEstimada = Math.max(1, Math.ceil(palabrasCount / 200))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!token) {
      setUploadError("Necesitás estar logueada para subir imágenes")
      return
    }
    setUploading(true)
    setUploadError("")
    try {
      const result = await subirImagenArticuloAPI(token, file)
      if (result) setImagen(result.url)
      else setUploadError("No se pudo subir la imagen. Intentá de nuevo.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const toggleRelacionado = (slug: string) => {
    setRelacionados((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Error", { description: "Necesitás estar logueada para publicar" })
      return
    }
    if (!imagen) {
      toast.error("Falta la imagen", { description: "Subí una imagen de portada antes de guardar" })
      return
    }
    if (!formData.contenido.trim()) {
      toast.error("Falta el contenido", { description: "El artículo no puede quedar vacío" })
      return
    }

    setIsLoading(true)
    try {
      const guardado = await onSubmit({
        titulo: formData.titulo,
        subtitulo: formData.subtitulo || undefined,
        resumen: formData.resumen,
        categoria: formData.categoria,
        fechaPublicacion: formData.fechaPublicacion,
        tiempoLectura: formData.tiempoLectura ? parseInt(formData.tiempoLectura, 10) : undefined,
        imagenDestacada: imagen,
        imagenDestacadaAlt: formData.imagenDestacadaAlt || undefined,
        contenido: formData.contenido,
        metaDescripcion: formData.metaDescripcion || undefined,
        palabrasClave: parseLista(formData.palabrasClave),
        relacionados,
        destacado: formData.destacado,
        publicado: formData.publicado,
      })

      if (guardado) {
        toast.success(esEdicion ? "Artículo actualizado ✓" : "Artículo creado ✓", {
          description: formData.publicado
            ? "Ya está publicado en el blog"
            : "Guardado como borrador — no aparece en el blog",
        })
        setTimeout(() => router.push("/admin/blog"), 1200)
        return
      }
      toast.error("Error", { description: "No se pudo guardar el artículo" })
    } catch {
      toast.error("Error", { description: "No se pudo guardar el artículo" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">{titulo}</h1>
          <p className="mt-1 text-muted-foreground">{subtitulo}</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Columna principal ─────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: El lenguaje secreto del color"
                    required
                  />
                  {esEdicion && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      La dirección del artículo (<code>/blog/{articulo?.slug}</code>) no cambia
                      aunque edites el título, para no romper los enlaces ya compartidos.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subtitulo">Subtítulo (opcional)</Label>
                  <Input
                    id="subtitulo"
                    value={formData.subtitulo}
                    onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                    placeholder="Una línea que amplía el título"
                  />
                </div>

                <div>
                  <Label htmlFor="resumen">Resumen</Label>
                  <Textarea
                    id="resumen"
                    value={formData.resumen}
                    onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                    placeholder="Dos o tres líneas que se ven en el listado del blog"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Contenido</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVistaPrevia((v) => !v)}
                >
                  {vistaPrevia ? (
                    <><Pencil className="mr-2 h-4 w-4" /> Escribir</>
                  ) : (
                    <><Eye className="mr-2 h-4 w-4" /> Vista previa</>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {vistaPrevia ? (
                  <div className="min-h-[24rem] rounded-lg border border-border bg-background p-6">
                    {formData.contenido.trim() ? (
                      <ArticuloContent contenido={formData.contenido} />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Todavía no escribiste nada.
                      </p>
                    )}
                  </div>
                ) : (
                  <Textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    placeholder={"## Un subtítulo\n\nEscribí acá el artículo.\n\n**Negrita**, *cursiva*, y > para una cita."}
                    rows={22}
                    className="font-mono text-sm"
                    required
                  />
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    Se escribe en Markdown: <code>##</code> subtítulo, <code>**negrita**</code>,{" "}
                    <code>*cursiva*</code>, <code>&gt;</code> cita. Usá la vista previa para ver
                    cómo queda.
                  </span>
                  <span className="tabular-nums">
                    {palabrasCount} palabras · ~{lecturaEstimada} min
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buscadores y redes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaDescripcion">Descripción para Google (opcional)</Label>
                  <Textarea
                    id="metaDescripcion"
                    value={formData.metaDescripcion}
                    onChange={(e) => setFormData({ ...formData, metaDescripcion: e.target.value })}
                    placeholder="Si la dejás vacía se usa el resumen"
                    rows={2}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Es el texto que aparece debajo del título en los resultados de búsqueda.
                    Rinde mejor entre 120 y 160 caracteres — vas {formData.metaDescripcion.length}.
                  </p>
                </div>

                <div>
                  <Label htmlFor="palabrasClave">Palabras clave (opcional)</Label>
                  <Input
                    id="palabrasClave"
                    value={formData.palabrasClave}
                    onChange={(e) => setFormData({ ...formData, palabrasClave: e.target.value })}
                    placeholder="color, óleo, técnica"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Separadas por comas.</p>
                </div>
              </CardContent>
            </Card>

            {otrosArticulos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Artículos relacionados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Se muestran al final del artículo para invitar a seguir leyendo.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {otrosArticulos.map((a) => (
                      <button
                        key={a.slug}
                        type="button"
                        onClick={() => toggleRelacionado(a.slug)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          relacionados.includes(a.slug)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {a.titulo}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* ── Barra lateral ─────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Imagen de portada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagen ? (
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagen} alt="Portada" className="h-full w-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => setImagen("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="block">
                    <div className="flex aspect-[3/2] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50">
                      {uploading ? (
                        <>
                          <Spinner className="h-6 w-6" />
                          <span className="text-sm text-muted-foreground">Subiendo imagen...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Subir portada</span>
                        </>
                      )}
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
                {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

                <div>
                  <Label htmlFor="imagenAlt">Descripción de la imagen</Label>
                  <Input
                    id="imagenAlt"
                    value={formData.imagenDestacadaAlt}
                    onChange={(e) => setFormData({ ...formData, imagenDestacadaAlt: e.target.value })}
                    placeholder="Ej: Paleta de colores sobre lienzo"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    La leen quienes usan lector de pantalla, y Google la usa para entender la foto.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(v) => setFormData({ ...formData, categoria: v as CategoriaSlug })}
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map(([slug, label]) => (
                        <SelectItem key={slug} value={slug}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fecha">Fecha de publicación</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fechaPublicacion}
                    onChange={(e) => setFormData({ ...formData, fechaPublicacion: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tiempoLectura">Tiempo de lectura (min)</Label>
                  <Input
                    id="tiempoLectura"
                    type="number"
                    min={1}
                    value={formData.tiempoLectura}
                    onChange={(e) => setFormData({ ...formData, tiempoLectura: e.target.value })}
                    placeholder={`Automático: ${lecturaEstimada}`}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Si lo dejás vacío se calcula solo según el largo del texto.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="publicado">Publicado</Label>
                    <p className="text-xs text-muted-foreground">Apagado = borrador</p>
                  </div>
                  <Switch
                    id="publicado"
                    checked={formData.publicado}
                    onCheckedChange={(c) => setFormData({ ...formData, publicado: c })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="destacado">Destacado</Label>
                    <p className="text-xs text-muted-foreground">Va arriba de todo en el blog</p>
                  </div>
                  <Switch
                    id="destacado"
                    checked={formData.destacado}
                    onCheckedChange={(c) => setFormData({ ...formData, destacado: c })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading || uploading || !imagen}>
              {isLoading ? "Guardando..." : textoBotón}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Los cambios pueden tardar unos minutos en verse en el blog público.
            </p>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}
