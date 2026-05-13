"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCheckout } from "@/contexts/checkout-context"
import { 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  ChevronRight,
  Sparkles,
  Check,
  MapPin,
  Star,
  ChevronDown,
  Circle,
  FileText,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  GraduationCap,
  Download,
  X,
  RotateCcw
} from "lucide-react"
import { getCursoById, getCourseProgress, updateLessonProgress, getLessonProgress, isUserEnrolled, getCursos, fetchCursoByIdFromAPI, fetchMisCursos, estoyInscripto, inscribirEnCursoAPI, completarLeccion, type Curso, type Lesson, type QuizQuestion } from "@/lib/data"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

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

export default function CursoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(["m1"]))
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [showIntroVideo, setShowIntroVideo] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const { addItem } = useCheckout()

  // Check enrollment status with backend on mount
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!token || !user) return
      const enrolled = await estoyInscripto(token, id)
      setIsEnrolled(enrolled)
      if (enrolled) {
        // Load completed lessons from backend
        const completed = getLessonProgress(user.id, id)
        setCompletedLessons(new Set(completed))
      }
    }
    checkEnrollment()
  }, [token, user, id])

  useEffect(() => {
    const loadCurso = async () => {
      const data = await fetchCursoByIdFromAPI(id)
      console.log("Curso cargado:", data)
      console.log("Modules:", data?.modules)
      if (data) {
        setCurso(data)
      } else {
        setCurso(getCursoById(id) || null)
      }
      setLoading(false)
    }
    loadCurso()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!curso) {
    notFound()
  }

  const modules = curso.modules || []

  const toggleLesson = (lessonId: string) => {
    if (!user) return
    // Update local state
    setCompletedLessons(prev => {
      const next = new Set(prev)
      if (next.has(lessonId)) {
        next.delete(lessonId)
      } else {
        next.add(lessonId)
        // Also update localStorage for offline
        updateLessonProgress(user.id, id, lessonId)
        // Call backend to mark lesson complete
        if (token) {
          completarLeccion(token, id, lessonId)
        }
      }
      return next
    })
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalDuration = modules.reduce((acc, m) => {
    return acc + m.lessons.reduce((a, l) => {
      if (l.type === "video") {
        return a + parseInt(l.duration) || 0
      }
      return a
    }, 0)
  }, 0)
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0

  const currentIndex = getCursos().findIndex((c) => c.id === id)
  const prevCurso = currentIndex > 0 ? getCursos()[currentIndex - 1] : null
  const nextCurso = currentIndex < getCursos().length - 1 ? getCursos()[currentIndex + 1] : null

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/checkout`)
      return
    }
    
    if (token) {
      // Try backend enrollment first
      const success = await inscribirEnCursoAPI(token, id)
      if (success) {
        setIsEnrolled(true)
      }
    }
    
    // Add to checkout in either case
    addItem({
      id: String(curso.id),
      type: "course",
      title: curso.title,
      price: curso.precio,
      image: curso.image,
      quantity: 1
    })
    router.push("/checkout")
  }

  const openLesson = (lesson: Lesson) => {
    if (lesson.type === "video" && lesson.videoUrl) {
      setCurrentVideoUrl(lesson.videoUrl)
    } else {
      setCurrentLesson(lesson)
    }
    setQuizAnswers([])
    setQuizSubmitted(false)
    setQuizScore(0)
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const submitQuiz = () => {
    if (!currentLesson?.quizQuestions) return
    let score = 0
    currentLesson.quizQuestions.forEach((q: QuizQuestion, idx: number) => {
      if (quizAnswers[idx] === q.correctAnswer) score++
    })
    setQuizScore(score)
    setQuizSubmitted(true)
    // Mark lesson as completed if passed
    if (score >= currentLesson.quizQuestions.length / 2) {
      toggleLesson(currentLesson.id)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Lesson Viewer Modal */}
      <AnimatePresence>
        {currentLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setCurrentLesson(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setCurrentLesson(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 md:p-8">
                <h2 className="mb-6 font-serif text-2xl font-medium text-gray-900">
                  {currentLesson.title}
                </h2>

                {/* Video Player */}
                {currentLesson.type === "video" && currentLesson.videoUrl && (
                  <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-black">
                    <video 
                      src={currentLesson.videoUrl}
                      controls
                      className="h-full w-full"
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                )}

                {/* PDF Viewer */}
                {currentLesson.type === "pdf" && currentLesson.pdfUrl && (
                  <div className="mb-6 h-[60vh] overflow-hidden rounded-xl border border-gray-200">
                    <iframe
                      src={currentLesson.pdfUrl}
                      className="h-full w-full"
                      title={currentLesson.title}
                    />
                  </div>
                )}

                {/* Quiz */}
                {currentLesson.type === "quiz" && currentLesson.quizQuestions && (
                  <div className="mb-6 space-y-6">
                    {!quizSubmitted ? (
                      <>
                        {currentLesson.quizQuestions.map((q: QuizQuestion, qIdx: number) => (
                          <div key={qIdx} className="rounded-xl border border-gray-200 p-4">
                            <p className="mb-3 font-medium text-gray-900">{q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((opt: string, oIdx: number) => (
                                <button
                                  key={oIdx}
                                  onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                    quizAnswers[qIdx] === oIdx
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={submitQuiz}
                          disabled={quizAnswers.length < (currentLesson.quizQuestions?.length || 0)}
                          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                          Enviar respuestas
                        </button>
                      </>
                    ) : (
                      <div className="rounded-2xl bg-gray-50 p-6 text-center">
                        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                          quizScore >= (currentLesson.quizQuestions?.length || 1) / 2 ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {quizScore >= (currentLesson.quizQuestions?.length || 1) / 2 ? (
                            <Check className="h-8 w-8 text-green-600" />
                          ) : (
                            <X className="h-8 w-8 text-red-600" />
                          )}
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">
                          {quizScore >= (currentLesson.quizQuestions?.length || 1) / 2 ? "¡Aprobado!" : "No aprobado"}
                        </h3>
                        <p className="mt-2 text-gray-600">
                          Obtuviste {quizScore} de {currentLesson.quizQuestions?.length} respuestas correctas
                        </p>
                        {quizScore >= (currentLesson.quizQuestions?.length || 1) / 2 && (
                          <p className="mt-4 text-sm text-green-600">Lección marcada como completada</p>
                        )}
                        <button
                          onClick={() => {
                            setQuizSubmitted(false)
                            setQuizAnswers([])
                          }}
                          className="mt-4 text-sm text-primary hover:underline"
                        >
                          Reintentar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
                      <Download className="h-4 w-4" />
                      Recursos descargables
                    </h3>
                    <div className="space-y-2">
                      {currentLesson.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          download
                          className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{res.name}</span>
                          <Download className="ml-auto h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl px-6 py-6 lg:px-8"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground transition-colors hover:text-primary">
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cursos" className="text-muted-foreground transition-colors hover:text-primary">
                Cursos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary">{curso.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Content */}
      <section className="pb-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Video Preview */}
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted mb-8">
                  {currentVideoUrl ? (
                    <div className="relative h-full w-full">
                      {isYouTubeUrl(currentVideoUrl) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(currentVideoUrl) || ""}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={currentVideoUrl}
                          controls
                          autoPlay
                          className="h-full w-full object-cover"
                        >
                          Tu navegador no soporta el elemento de video.
                        </video>
                      )}
                      <button
                        onClick={() => setCurrentVideoUrl(null)}
                        className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : showIntroVideo && curso.introVideoUrl ? (
                    <div className="relative h-full w-full">
                      {isYouTubeUrl(curso.introVideoUrl) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(curso.introVideoUrl) || ""}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={curso.introVideoUrl}
                          controls
                          autoPlay
                          className="h-full w-full object-cover"
                        >
                          Tu navegador no soporta el elemento de video.
                        </video>
                      )}
                      <button
                        onClick={() => setShowIntroVideo(false)}
                        className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={curso.image}
                        alt={curso.title}
                        fill
                        className="object-cover"
                      />
                      {(curso.introVideoUrl || currentVideoUrl) && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => curso.introVideoUrl && setShowIntroVideo(true)}
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl"
                          >
                            <Play className="ml-1 h-8 w-8 text-primary-foreground" fill="currentColor" />
                          </motion.button>
                          <span className="text-white font-medium text-sm">Ver video</span>
                        </div>
                      )}
                    </>
                  )}
                  {curso.featured && !showIntroVideo && !currentVideoUrl && (
                    <div className="absolute left-5 top-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                        <Sparkles className="h-3 w-3" />
                        Destacado
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {curso.nivel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {curso.duracion}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {curso.modalidad}
                  </span>
                </div>

                <h1 className="font-serif text-4xl font-medium leading-tight text-foreground md:text-5xl lg:text-6xl">
                  {curso.title}
                </h1>

                {/* Instructor */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                    <Image
                      src="/artist-portrait.jpg"
                      alt="Ana Cecilia Robles"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ana Cecilia Robles</p>
                    <p className="text-sm text-muted-foreground">Artista Plástica · Instructora</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="font-medium">4.9</span>
                    <span className="text-sm text-muted-foreground">(128 alumnos)</span>
                  </div>
                </div>

                <p className="mt-8 leading-relaxed text-muted-foreground">
                  {curso.description}
                </p>
              </motion.div>

              {/* Course Content */}
              <motion.div
                id="course-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border/30 bg-muted/20 p-8"
              >
                <h2 className="mb-6 font-serif text-2xl font-medium text-foreground">
                  Contenido del curso
                </h2>

                {/* Progress */}
                <div className="mb-8">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>

                {/* Modules */}
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => {
                    const isExpanded = expandedModules.has(module.id)
                    const moduleLessonsCompleted = module.lessons.filter(l => completedLessons.has(l.id)).length
                    
                    return (
                      <div key={module.id} className="rounded-xl border border-border/30 bg-background overflow-hidden">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <span className="font-serif text-lg font-medium text-primary">
                                {moduleIndex + 1}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {module.lessons.length} lecciones · {moduleLessonsCompleted}/{module.lessons.length} completadas
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-border/30">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center gap-4 border-b border-border/20 p-5 last:border-b-0 transition-colors hover:bg-muted/30 ${
                                  currentLesson?.id === lesson.id ? "bg-primary/5" : ""
                                }`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (isEnrolled) {
                                      toggleLesson(lesson.id)
                                    }
                                  }}
                                  className="shrink-0"
                                  disabled={!isEnrolled}
                                >
                                  {completedLessons.has(lesson.id) ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" fill="currentColor" />
                                  ) : (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                                      {lesson.type === "video" && <Play className="ml-0.5 h-3 w-3 text-muted-foreground" fill="currentColor" />}
                                    </div>
                                  )}
                                </button>
                                <div className="flex-1">
                                  <p className={`font-medium ${
                                    completedLessons.has(lesson.id) ? "text-muted-foreground line-through" : "text-foreground"
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      {lesson.type === "video" && <Play className="h-3 w-3" />}
                                      {lesson.type === "pdf" && <FileText className="h-3 w-3" />}
                                      {lesson.type === "quiz" && <HelpCircle className="h-3 w-3" />}
                                      {lesson.duration}
                                    </span>
                                    {lesson.resources && lesson.resources.length > 0 && (
                                      <span className="flex items-center gap-1 text-xs text-primary">
                                        <Download className="h-3 w-3" />
                                        {lesson.resources.length} recurso(s)
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {lesson.type === "video" && lesson.videoUrl && (
                                  <button
                                    onClick={() => openLesson(lesson)}
                                    className="shrink-0 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span>Ver video</span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border/30 bg-muted/20 p-6"
                >
                  <div className="mb-6 text-center">
                    <span className="font-serif text-5xl font-bold text-primary">
                      ${curso.precio.toLocaleString("es-AR")}
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground">Acceso de por vida</p>
                  </div>

                  <motion.button
                    onClick={() => {
                      if (isEnrolled) {
                        const courseContent = document.getElementById("course-content")
                        courseContent?.scrollIntoView({ behavior: "smooth" })
                      } else {
                        handleEnroll()
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-sm font-semibold transition-colors ${
                      isEnrolled 
                        ? "bg-green-600 text-white hover:bg-green-700" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <Check className="h-5 w-5" />
                        Continuar aprendiendo
                      </>
                    ) : (
                      <>
                        Inscribirme ahora
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{totalLessons} clases en video</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{totalDuration}+ minutos de contenido</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>Certificado de finalización</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>Acceso a comunidad privada</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>Soporte personalizado</span>
                    </div>
                  </div>
                </motion.div>

                {/* Features Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl bg-primary p-6 text-primary-foreground"
                >
                  <h3 className="font-serif text-lg font-medium">¿Qué incluye?</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3">
                      <BookOpen className="mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">Materiales y recursos descargables</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">Comunidad de alumnos exclusiva</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">Comentarios y feedback del instructor</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Download className="mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-sm">Acceso offline a videos</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Instructor Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border/30 bg-background p-6"
                >
                  <h3 className="mb-4 font-serif text-lg font-medium text-foreground">Tu instructor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                      <Image
                        src="/artist-portrait.jpg"
                        alt="Ana Cecilia Robles"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ana Cecilia Robles</p>
                      <p className="text-sm text-muted-foreground">Artista Plástica</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Más de 10 años de experiencia en pintura y técnicas mixtas. Ha expuesto en Madrid, 
                    Barcelona, París y Miami.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="border-t border-border/30 bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-12 text-center font-serif text-3xl font-medium text-foreground">
            Otros cursos que te pueden gustar
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {getCursos().filter(c => c.id !== id && c.featured).slice(0, 3).map((related, index) => (
              <motion.div
                key={related.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/cursos/${related.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {related.modalidad} · {related.nivel}
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-medium text-foreground transition-colors group-hover:text-primary">
                      {related.title}
                    </h3>
                    <p className="mt-2 font-semibold text-primary">
                      ${related.precio.toLocaleString("es-AR")}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-border/30 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {prevCurso ? (
              <Link
                href={`/cursos/${prevCurso.id}`}
                className="group flex items-center gap-4 text-left transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Anterior</p>
                  <p className="font-serif text-lg font-medium">{prevCurso.title}</p>
                </div>
              </Link>
            ) : <div />}
            
            {nextCurso && (
              <Link
                href={`/cursos/${nextCurso.id}`}
                className="group flex items-center gap-4 text-right transition-colors hover:text-primary"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Siguiente</p>
                  <p className="font-serif text-lg font-medium">{nextCurso.title}</p>
                </div>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

