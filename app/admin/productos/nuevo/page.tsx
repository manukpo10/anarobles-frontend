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
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { crearProductoAPI } from "@/lib/data"

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

export default function NuevoProductoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    featured: false
  })
  const [imagePreview, setImagePreview] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const products = JSON.parse(localStorage.getItem("products") || "[]")
    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price)
    }

    try {
      if (token) {
        const created = await crearProductoAPI(token, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image || "/artwork-1.jpg",
          category: formData.category,
          featured: formData.featured,
        })
        if (created) {
          toast({ title: "Producto creado correctamente ✓", description: "Guardado en el servidor" })
          router.push("/admin/productos")
          return
        }
      }

      products.push(newProduct)
      localStorage.setItem("products", JSON.stringify(products))

      toast({
        title: "Producto creado correctamente ✓",
        description: "El producto ha sido creado exitosamente"
      })

      router.push("/admin/productos")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive"
      })
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
            Nuevo Producto
          </h1>
          <p className="mt-1 text-muted-foreground">
            Completa la información del producto
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
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Set de Pinceles Profesionales"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el producto..."
                    rows={5}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Herramientas">Herramientas</SelectItem>
                        <SelectItem value="Pintura">Pintura</SelectItem>
                        <SelectItem value="Papelería">Papelería</SelectItem>
                        <SelectItem value="Libros">Libros</SelectItem>
                        <SelectItem value="Merchandising">Merchandising</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Precio ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          setImagePreview("")
                          setFormData({ ...formData, image: "" })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="block">
                      <div className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Subir imagen
                        </span>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Producto Destacado</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "Crear Producto"}
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}
