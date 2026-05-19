"use client"

import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Plus, Trash2, GripVertical, Video, FileText, HelpCircle, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { fetchCursoByIdFromAPI, actualizarCursoAPI } from "@/lib/data"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`
  }
  return null
}

function isYouTubeUrl(url: string): boolean {
  return getYouTubeEmbedUrl(url) !== null
}

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

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

interface Lesson {
  id: string
  title: string
  duration: string
  type: "video" | "pdf" | "quiz"
  videoUrl: string
  pdfUrl: string
  quizQuestions: QuizQuestion[]
  resources: { name: string; url: string }[]
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export default function EditarCursoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "",
    modalidad: "",
    duracion: "",
    nivel: "",
    precio: "",
    description: "",
    image: "",
    introVideoUrl: "",
    featured: false,
    publicado: true
  })
  const [imagePreview, setImagePreview] = useState("")
  const [introVideoPreview, setIntroVideoPreview] = useState("")
  const [lessonVideoPreviews, setLessonVideoPreviews] = useState<Record<string, string>>({})
  const [modules, setModules] = useState<Module[]>([])

  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadCurso = async () => {
      const curso = await fetchCursoByIdFromAPI(id)
      if (curso) {
        setFormData({
          id: curso.id,
          title: curso.title,
          category: curso.category,
          modalidad: curso.modalidad,
          duracion: curso.duracion,
          nivel: curso.nivel,
          precio: curso.precio.toString(),
          description: curso.description,
          image: curso.image,
          introVideoUrl: (curso as any).introVideoUrl || "",
          featured: curso.featured || false,
          publicado: (curso as any).publicado !== false
        })
        setImagePreview(curso.image)
        setIntroVideoPreview((curso as any).introVideoUrl || "")

        if ((curso as any).modules && (curso as any).modules.length > 0) {
          setModules((curso as any).modules)
        }
      }
      setLoadingData(false)
    }
    loadCurso()
  }, [id])

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

  const addModule = () => {
    setModules([...modules, {
      id: `m${Date.now()}`,
      title: "",
      lessons: []
    }])
  }

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId))
  }

  const updateModule = (moduleId: string, title: string) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, title } : m))
  }

  const addLesson = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        lessons: [...m.lessons, {
          id: `l${Date.now()}`,
          title: "",
          duration: "",
          type: "video" as const,
          videoUrl: "",
          pdfUrl: "",
          quizQuestions: [],
          resources: []
        }]
      } : m
    ))
  }

  const handleIntroVideoChange = (url: string) => {
    setFormData({ ...formData, introVideoUrl: url })
    setIntroVideoPreview(url)
  }

  const handleLessonVideoChange = (moduleId: string, lessonId: string, url: string) => {
    updateLesson(moduleId, lessonId, "videoUrl", url)
    setLessonVideoPreviews(prev => ({ ...prev, [lessonId]: url }))
  }

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ))
  }

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
      } : m
    ))
  }

  const addQuizQuestion = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => 
          l.id === lessonId ? {
            ...l,
            quizQuestions: [...l.quizQuestions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]
          } : l
        )
      } : m
    ))
  }

  const updateQuizQuestion = (moduleId: string, lessonId: string, qIndex: number, field: string, value: any) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => 
          l.id === lessonId ? {
            ...l,
            quizQuestions: l.quizQuestions.map((q, i) => 
              i === qIndex ? { ...q, [field]: value } : q
            )
          } : l
        )
      } : m
    ))
  }

  const removeQuizQuestion = (moduleId: string, lessonId: string, qIndex: number) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => 
          l.id === lessonId ? {
            ...l,
            quizQuestions: l.quizQuestions.filter((_, i) => i !== qIndex)
          } : l
        )
      } : m
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const modulesData = modules.map(m => ({
        ...m,
        lessons: m.lessons.map(l => ({
          ...l,
          quizQuestions: l.type === "quiz" ? l.quizQuestions : undefined,
          videoUrl: l.type === "video" ? l.videoUrl : undefined,
          pdfUrl: l.type === "pdf" ? l.pdfUrl : undefined,
        }))
      }))

      if (!token) {
        toast.error("Error", { description: "Necesitás estar logueado para actualizar cursos" })
        return
      }

      const actualizado = await actualizarCursoAPI(token, formData.id, {
        title: formData.title,
        description: formData.description,
        precio: parseFloat(formData.precio),
        image: formData.image,
        category: formData.category,
        duracion: formData.duracion,
        nivel: formData.nivel as any,
        modalidad: formData.modalidad as any,
        introVideoUrl: formData.introVideoUrl,
        publicado: formData.publicado,
        featured: formData.featured,
        modules: modulesData,
      })

if (actualizado) {
        toast.success("Curso editado correctamente ✓", { description: "El curso ha sido actualizado exitosamente en el servidor" })
        setTimeout(() => router.push("/admin/cursos"), 2000)
        return
      }
    } catch (error) {
      toast.error("Error", { description: "No se pudo actualizar el curso" })
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
            Editar Curso
          </h1>
          <p className="mt-1 text-muted-foreground">
            Modificá la información del curso y sus lecciones
          </p>
        </div>
      </motion.div>

      {loadingData ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
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
                  <Label htmlFor="title">Título del Curso</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Pintura al Óleo para Principiantes"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el contenido del curso..."
                    rows={5}
                    required
                  />
                </div>

                {/* Video de introducción del curso */}
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-5 w-5 text-primary" />
                    <Label htmlFor="introVideo" className="font-medium text-primary">
                      Video de Introducción del Curso
                    </Label>
                  </div>
                  <Input
                    id="introVideo"
                    value={(formData as any).introVideoUrl || ""}
                    onChange={(e) => handleIntroVideoChange(e.target.value)}
                    placeholder="URL del video de introducción (ej: https://...)"
                    className="mb-2"
                  />
                  {introVideoPreview && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-border">
                      {isYouTubeUrl(introVideoPreview) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(introVideoPreview) || ""}
                          className="w-full aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : introVideoPreview.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={introVideoPreview}
                          controls
                          className="w-full aspect-video"
                        >
                          Tu navegador no soporta el elemento de video
                        </video>
                      ) : (
                        <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center text-muted-foreground gap-2">
                          <span>Vista previa no disponible</span>
                          <a
                            href={introVideoPreview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            Abrir en nueva pestaña
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Este video se mostrará en la página principal del curso como introducción
                  </p>
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
                        <SelectItem value="Oil Painting">Oil Painting</SelectItem>
                        <SelectItem value="Watercolor">Watercolor</SelectItem>
                        <SelectItem value="Drawing">Drawing</SelectItem>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="modalidad">Modalidad</Label>
                    <Select
                      value={formData.modalidad}
                      onValueChange={(value) => setFormData({ ...formData, modalidad: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Virtual">Virtual</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="duracion">Duración</Label>
                    <Input
                      id="duracion"
                      value={formData.duracion}
                      onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                      placeholder="Ej: 8 semanas"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nivel">Nivel</Label>
                    <Select
                      value={formData.nivel}
                      onValueChange={(value) => setFormData({ ...formData, nivel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inicial">Inicial</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                        <SelectItem value="Todos los niveles">Todos los niveles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="precio">Precio ($)</Label>
                  <Input
                    id="precio"
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Modules Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Módulos y Lecciones</CardTitle>
                <Button type="button" onClick={addModule} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Módulo
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module, mIndex) => (
                  <div key={module.id} className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(module.id, e.target.value)}
                            placeholder={`Módulo ${mIndex + 1}: Título`}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* Lessons */}
                    <div className="ml-6 space-y-3">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lesson.id} className="rounded-lg bg-muted/30 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Lección {lIndex + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLesson(module.id, lesson.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <Input
                            value={lesson.title}
                            onChange={(e) => updateLesson(module.id, lesson.id, "title", e.target.value)}
                            placeholder="Título de la lección"
                          />

                          <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                              value={lesson.duration}
                              onChange={(e) => updateLesson(module.id, lesson.id, "duration", e.target.value)}
                              placeholder="Duración (ej: 15 min)"
                            />
                            <Select
                              value={lesson.type}
                              onValueChange={(value: "video" | "pdf" | "quiz") => updateLesson(module.id, lesson.id, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">
                                  <div className="flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    Video
                                  </div>
                                </SelectItem>
                                <SelectItem value="pdf">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    PDF
                                  </div>
                                </SelectItem>
                                <SelectItem value="quiz">
                                  <div className="flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    Quiz
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Video URL */}
                          {lesson.type === "video" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  value={lesson.videoUrl}
                                  onChange={(e) => handleLessonVideoChange(module.id, lesson.id, e.target.value)}
                                  placeholder="URL del video (ej: https://...)"
                                />
                              </div>
                              {lessonVideoPreviews[lesson.id] && (
                                <div className="rounded-lg overflow-hidden border border-border">
                                  <video
                                    src={lessonVideoPreviews[lesson.id]}
                                    controls
                                    className="w-full aspect-video"
                                  >
                                    Tu navegador no soporta el elemento de video
                                  </video>
                                </div>
                              )}
                            </div>
                          )}

                          {/* PDF URL */}
                          {lesson.type === "pdf" && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <Input
                                value={lesson.pdfUrl}
                                onChange={(e) => updateLesson(module.id, lesson.id, "pdfUrl", e.target.value)}
                                placeholder="URL del PDF"
                              />
                            </div>
                          )}

                          {/* Quiz Questions */}
                          {lesson.type === "quiz" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Preguntas del Quiz</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addQuizQuestion(module.id, lesson.id)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Agregar Pregunta
                                </Button>
                              </div>
                              {lesson.quizQuestions.map((q, qIndex) => (
                                <div key={qIndex} className="rounded bg-background p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Pregunta {qIndex + 1}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeQuizQuestion(module.id, lesson.id, qIndex)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={q.question}
                                    onChange={(e) => updateQuizQuestion(module.id, lesson.id, qIndex, "question", e.target.value)}
                                    placeholder="Escribí la pregunta"
                                    className="text-sm"
                                  />
                                  <div className="space-y-1">
                                    {q.options.map((opt, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name={`correct-${lesson.id}-${qIndex}`}
                                          checked={q.correctAnswer === optIndex}
                                          onChange={() => updateQuizQuestion(module.id, lesson.id, qIndex, "correctAnswer", optIndex)}
                                        />
                                        <Input
                                          value={opt}
                                          onChange={(e) => {
                                            const newOptions = [...q.options]
                                            newOptions[optIndex] = e.target.value
                                            updateQuizQuestion(module.id, lesson.id, qIndex, "options", newOptions)
                                          }}
                                          placeholder={`Opción ${optIndex + 1}`}
                                          className="text-sm"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addLesson(module.id)}
                        className="w-full border-dashed"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Lección
                      </Button>
                    </div>
                  </div>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay módulos aún.</p>
                    <p className="text-sm">Hacé clic en "Agregar Módulo" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg">
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
                      <div className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                        <Image className="h-8 w-8 text-muted-foreground" />
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
                  <Label htmlFor="featured">Curso Destacado</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="publicado">Publicado</Label>
                  <Switch
                    id="publicado"
                    checked={(formData as any).publicado !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked } as any)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar Curso"}
            </Button>
          </motion.div>
        </div>
        </form>
      )}
    </motion.div>
  )
}
