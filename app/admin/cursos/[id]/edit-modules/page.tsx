"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Edit, GripVertical, Video, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCursoById, updateCurso, actualizarCursoAPI } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function EditModulesPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { token } = useAuth()
  const [curso, setCurso] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])

  useEffect(() => {
    const cursoId = params.id as string
    const cursoData = getCursoById(cursoId)
    if (cursoData) {
      setCurso(cursoData)
      setModules(cursoData.modules || [])
    }
  }, [params.id])

  const addModule = () => {
    const newModule = {
      id: `m${Date.now()}`,
      title: "Nuevo Módulo",
      lessons: []
    }
    setModules([...modules, newModule])
  }

  const updateModule = (index: number, field: string, value: string) => {
    const updated = [...modules]
    updated[index] = { ...updated[index], [field]: value }
    setModules(updated)
  }

  const deleteModule = (index: number) => {
    if (confirm("¿Estás seguro de que querés eliminar este módulo?")) {
      setModules(modules.filter((_, i) => i !== index))
    }
  }

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules]
    updated[moduleIndex].lessons.push({
      id: `l${Date.now()}`,
      title: "Nueva Lección",
      duration: "10 min",
      type: "video"
    })
    setModules(updated)
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    const updated = [...modules]
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value
    }
    setModules(updated)
  }

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules]
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_: any, i: number) => i !== lessonIndex)
    setModules(updated)
  }

  const handleSave = async () => {
    if (!curso) return

    if (token) {
      const actualizado = await actualizarCursoAPI(token, curso.id, {
        title: curso.title,
        modules
      })
      if (actualizado) {
        toast({
          title: "Módulos actualizados",
          description: "Los cambios han sido guardados exitosamente en el servidor"
        })
        router.push("/admin/cursos")
        return
      }
    }

    updateCurso(curso.id, { modules })

    toast({
      title: "Módulos actualizados",
      description: "Los cambios han sido guardados exitosamente"
    })
  }

  if (!curso) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            Editar Módulos
          </h1>
          <p className="mt-1 text-muted-foreground">
            {curso.title}
          </p>
        </div>
      </motion.div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1">
                    <Input
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                      className="font-medium"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteModule(moduleIndex)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons.map((lesson: any, lessonIndex: number) => (
                    <div key={lesson.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      
                      {lesson.type === "video" && <Video className="h-4 w-4 text-muted-foreground" />}
                      {lesson.type === "pdf" && <FileText className="h-4 w-4 text-muted-foreground" />}
                      {lesson.type === "quiz" && <HelpCircle className="h-4 w-4 text-muted-foreground" />}
                      
                      <div className="flex-1 grid gap-2 sm:grid-cols-3">
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                          placeholder="Título de la lección"
                        />
                        <Input
                          value={lesson.duration}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, "duration", e.target.value)}
                          placeholder="Duración"
                        />
                        <Select
                          value={lesson.type}
                          onValueChange={(value) => updateLesson(moduleIndex, lessonIndex, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(moduleIndex)}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Lección
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={addModule} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Módulo
        </Button>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground">
          Guardar Cambios
        </Button>
      </div>
    </motion.div>
  )
}
