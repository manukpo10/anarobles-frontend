"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
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
import { crearObraAPI, subirImagenObraAPI, getCategorias, type Disponibilidad } from "@/lib/obras"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function NuevaObraPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    año: "",
    tecnica: "",
    dimensiones: "",
    disponibilidad: "disponible" as Disponibilidad,
    destacada: false,
    precio: "",
    descripcion: "",
  })
  const [imagen, setImagen] = useState<{ url: string; width: number; height: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const categoriasSugeridas = getCategorias()

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
      const result = await subirImagenObraAPI(token, file)
      if (result) {
        setImagen(result)
      } else {
        setUploadError("No se pudo subir la imagen. Intentá de nuevo.")
      }
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Error", { description: "Necesitás estar logueada para crear obras" })
      return
    }
    if (!imagen) {
      toast.error("Error", { description: "Subí una imagen antes de guardar" })
      return
    }

    setIsLoading(true)
    try {
      const created = await crearObraAPI(token, {
        titulo: formData.titulo,
        categoria: formData.categoria,
        año: parseInt(formData.año, 10),
        tecnica: formData.tecnica,
        dimensiones: formData.dimensiones || undefined,
        disponibilidad: formData.disponibilidad,
        destacada: formData.destacada,
        imagen: imagen.url,
        imgW: imagen.width,
        imgH: imagen.height,
        descripcion: formData.descripcion || undefined,
        precio: formData.precio ? parseFloat(formData.precio) : undefined,
      })

      if (created) {
        toast.success("Obra creada correctamente ✓", { description: "Guardada en el servidor" })
        setTimeout(() => {
          router.push("/admin/galeria")
        }, 1500)
        return
      }

      toast.error("Error", { description: "No se pudo crear la obra" })
    } catch (error) {
      toast.error("Error", { description: "No se pudo crear la obra" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Nueva Obra
          </h1>
          <p className="mt-1 text-muted-foreground">
            Completa la información de la obra
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: Flor de Jacarandá"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  {categoriasSugeridas.length > 0 && (
                    <div className="mb-2 mt-1.5 flex flex-wrap gap-2">
                      {categoriasSugeridas.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, categoria: cat })}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            formData.categoria === cat
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                  <Input
                    id="categoria"
                    list="categorias-sugeridas"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ej: retratos, naturaleza, o una categoría nueva"
                    required
                  />
                  <datalist id="categorias-sugeridas">
                    {categoriasSugeridas.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="año">Año</Label>
                    <Input
                      id="año"
                      type="number"
                      value={formData.año}
                      onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                      placeholder="2026"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tecnica">Técnica</Label>
                    <Input
                      id="tecnica"
                      value={formData.tecnica}
                      onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                      placeholder="Ej: Acuarela sobre papel"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="dimensiones">Dimensiones</Label>
                    <Input
                      id="dimensiones"
                      value={formData.dimensiones}
                      onChange={(e) => setFormData({ ...formData, dimensiones: e.target.value })}
                      placeholder="Ej: 21 × 28 cm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="precio">Precio ($)</Label>
                    <Input
                      id="precio"
                      type="number"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Dejalo vacío si querés mostrar &quot;Consultar&quot;.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Describe la obra..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Imagen de la Obra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagen ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagen.url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => setImagen(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="block">
                      <div className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                        {uploading ? (
                          <>
                            <Spinner className="h-6 w-6" />
                            <span className="text-sm text-muted-foreground">Subiendo imagen...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Subir imagen
                            </span>
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
                  {uploadError && (
                    <p className="text-sm text-destructive">{uploadError}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="disponibilidad">Disponibilidad</Label>
                  <Select
                    value={formData.disponibilidad}
                    onValueChange={(value) => setFormData({ ...formData, disponibilidad: value as Disponibilidad })}
                  >
                    <SelectTrigger id="disponibilidad">
                      <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="vendida">Vendida</SelectItem>
                      <SelectItem value="consultar">Consultar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="destacada">Obra Destacada</Label>
                  <Switch
                    id="destacada"
                    checked={formData.destacada}
                    onCheckedChange={(checked) => setFormData({ ...formData, destacada: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || uploading || !imagen}
            >
              {isLoading ? "Creando..." : "Crear Obra"}
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}
