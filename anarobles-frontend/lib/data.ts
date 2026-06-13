// ============= NEW HOME REDESIGN INTERFACES =============

export interface AboutIntroData {
  headline: string
  eyebrow: string
  paragraphs: string[]
  image: string
  ctaLabel: string
  ctaHref: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  slug: string
  category: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  context: string
  avatar?: string
}

export interface ProcessPhase {
  id: string
  phaseNumber: number
  title: string
  description: string
  icon: string
}

// ============= NEW HOME REDESIGN DATA =============

// TODO: reemplazar con datos reales de Ana
export const aboutIntroData: AboutIntroData = {
  headline: "Sobre Ana",
  eyebrow: "Artista Plástica",
  paragraphs: [
    "Ana es una artista visual radicada en Argentina. Su trabajo se desarrolla entre el dibujo, la acuarela y la exploración textil, integrando bordados e intervenciones con hilos sobre sus obras.",
    "Inspirada por la naturaleza, las formas orgánicas y la observación del entorno, explora la relación entre el color, la materia y la experiencia sensible. A través de manchas, transparencias y gestos delicados, construye imágenes que invitan a la contemplación.",
    "El retrato ocupa un lugar central en su producción, entendido como una búsqueda de aquello que permanece más allá de la apariencia. En sus trabajos, el dibujo convive con la acuarela y el bordado, generando un diálogo entre imagen, superficie y textura.",
    "Además de su producción artística, acompaña procesos creativos a través de la enseñanza, compartiendo herramientas de dibujo, acuarela y experimentación material en espacios de formación y exploración.",
  ],
  image: "/artista1.jpeg", // TODO: verificar que exista en /public
  ctaLabel: "Conocé mi historia",
  ctaHref: "/sobre-mi",
}

// TODO: integrar blog API - estos son datos mock
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "El lenguaje secreto del color en la pintura contemporánea",
    excerpt:
      "Cómo los artistas usamos el color para transmitir emociones que las palabras no pueden capturar.",
    date: "2026-03-15",
    image: "/artwork-1.jpg",
    slug: "lenguaje-del-color",
    category: "Arte y Técnica",
  },
  {
    id: "2",
    title: "5 consejos para principiantes en óleo",
    excerpt:
      "Errores comunes y cómo evitarlos cuando estás empezando tu camino en la pintura al óleo.",
    date: "2026-02-28",
    image: "/artwork-2.jpg",
    slug: "consejos-principiantes-oleo",
    category: "Tutoriales",
  },
  {
    id: "3",
    title: "Inspiración mediterránea: del lienzo a la realidad",
    excerpt:
      "Explorando cómo los paisajes del Mediterráneo influyen en mi obra reciente.",
    date: "2026-01-10",
    image: "/artwork-3.jpg",
    slug: "inspiracion-mediterranea",
    category: "Proceso Creativo",
  },
]

// TODO: confirmar con Ana, estas citas necesitan verificación
export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Ana tiene una forma única de enseñar que hace que cada clase se sienta como un descubrimiento. Su paciencia y dedicación me ayudaron a superar bloqueos creativos que tenía hace años.",
    author: "María Fernanda López",
    context: "Taller de Óleo para Principiantes, 2025",
    avatar: "/artwork-1.jpg", // TODO: verificar que existan avatars reales
  },
  {
    id: "2",
    quote:
      "Las técnicas que aprendí en su taller de técnicas mixtas transformaron completamente mi forma de trabajar. Ahora tengo un lenguaje visual propio que antes no sabía que existía.",
    author: "Carlos Rodríguez",
    context: "Curso de Técnicas Mixtas, 2024",
    avatar: "/artwork-2.jpg",
  },
  {
    id: "3",
    quote:
      "Recomiendo completamente los cursos de Ana. La calidad de la enseñanza y el ambiente de clase son excepcionales. Es una artista y docente extraordinaria.",
    author: "Sofía Martínez",
    context: "Taller de Acuarela, 2024",
    avatar: "/artwork-3.jpg",
  },
]

// TODO: reemplazar con fases reales del proceso de Ana
export const processPhases: ProcessPhase[] = [
  {
    id: "1",
    phaseNumber: 1,
    title: "Inspiración",
    description:
      "Todo comienza en la observación, un recuerdo, un momento que pide ser traducido que se transforma en un tema. Esta fase es la más personal y la que define cada obra.",
    icon: "Sparkles",
  },
  {
    id: "2",
    phaseNumber: 2,
    title: "Boceto",
    description:
      "No suelo trabajar desde el boceto, casi siempre termino modificándolo. Creo que la primera impresión, el primer gesto percibido, eso que me llamó a ser dibujado es lo que cuenta. Después todo lo demás se va acomodando solo.",
    icon: "Pencil",
  },
  {
    id: "3",
    phaseNumber: 3,
    title: "Capas y Color",
    description:
      "En el proceso los materiales van tomando su lugar. Las capas son estos procesos en los que cada elemento, material o técnica se distribuyen en la exploración. En la acuarela muchas veces el agua determina el proceso y eso está bien. El color es una elección expresiva.",
    icon: "Palette",
  },
  {
    id: "4",
    phaseNumber: 4,
    title: "Obra Terminada",
    description:
      "El toque final revela la pieza completa, lista para contar su historia. A veces se necesita un paso atrás para ver el todo.",
    icon: "Check",
  },
]

export const getRecentPosts = (limit: number = 3): BlogPost[] =>
  blogPosts.slice(0, limit)

export const getTestimonials = (): Testimonial[] => testimonials

export const getProcessPhases = (): ProcessPhase[] => processPhases

// ============= EXISTING STATIC DATA =============

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export interface Lesson {
  id: string
  title: string
  duration: string
  type: "video" | "pdf" | "quiz"
  videoUrl?: string
  pdfUrl?: string
  quizQuestions?: QuizQuestion[]
  resources?: { name: string; url: string }[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Curso {
  id: string
  title: string
  subtitle?: string
  category: string
  modalidad: "Presencial" | "Online" | "Híbrido" | "Virtual"
  duracion: string
  nivel: "Inicial" | "Intermedio" | "Avanzado" | "Todos los niveles"
  precio: number
  description: string
  image: string
  featured?: boolean
  introVideoUrl?: string
  publicado?: boolean
  modules?: Module[]
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  featured?: boolean
  publicado?: boolean
}

// Helper to get data from localStorage or fallback to static data
const getStoredData = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === "undefined") return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export const getCursos = (): Curso[] => {
  return getStoredData("cursos", cursos)
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const fetchCursosFromAPI = async (): Promise<Curso[]> => {
  try {
    console.log("🔄 Intentando obtener cursos del backend...")
    const res = await fetch(`${API_BASE}/api/cursos`, { 
      cache: "no-store"
    })
    console.log("📡 Response status:", res.status)
    if (!res.ok) {
      console.error("Error fetching cursos:", res.status, res.statusText)
      throw new Error(`HTTP ${res.status}`)
    }
    const apiCursos = await res.json()
    console.log("✅ Cursos obtenidos del backend:", apiCursos.length, apiCursos)
    
    // If backend returns courses, use ONLY those - don't mix with local data
    if (apiCursos.length > 0) {
      return apiCursos.map((c: any) => ({
        id: String(c.id),
        title: c.titulo,
        category: c.categoria || "Pintura",
        modalidad: (c.modalidad || "Online") as Curso["modalidad"],
        duracion: c.duracion || "",
        nivel: (c.nivel || "Inicial") as Curso["nivel"],
        precio: c.precio,
        description: c.descripcion || "",
        image: c.imagen || "/artwork-1.jpg",
        introVideoUrl: c.introVideoUrl || "",
        publicado: c.publicado,
        featured: c.destacado || false,
        modules: c.modulos?.map((m: any) => ({
          id: String(m.id || `m${Math.random()}`),
          title: m.titulo || "",
          lessons: (m.lecciones || []).map((l: any) => ({
            id: String(l.id || `l${Math.random()}`),
            title: l.titulo || "",
            duration: l.duracion || "",
            type: (l.tipo || "video") as "video" | "pdf" | "quiz",
            videoUrl: l.videoUrl || "",
            pdfUrl: l.pdfUrl || "",
            quizQuestions: l.quizJson ? JSON.parse(l.quizJson) : []
          }))
        })) || []
      }))
    }
    
    // Only use local data if backend returned empty array
    console.warn("⚠️ Backend returned empty, usando datos locales")
    return getStoredData("cursos", cursos)
  } catch (error) {
    console.warn("❌ Backend no disponible para cursos:", error)
    return []
  }
}

export const fetchCursoByIdFromAPI = async (id: string): Promise<Curso | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/cursos/${id}`, { 
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      mode: "cors"
    })
    if (!res.ok) {
      console.warn("Backend no disponible para curso específico, usando localStorage")
      return getCursoById(id) || null
    }
    const c = await res.json()
    return {
      id: String(c.id),
      title: c.titulo,
      category: c.categoria || "Pintura",
      modalidad: (c.modalidad || "Online") as Curso["modalidad"],
      duracion: c.duracion || "",
      nivel: (c.nivel || "Inicial") as Curso["nivel"],
      precio: c.precio,
      description: c.descripcion || "",
      image: c.imagen || "/artwork-1.jpg",
      introVideoUrl: c.introVideoUrl || "",
      publicado: c.publicado,
      featured: c.destacado || false,
      modules: c.modulos?.map((m: any) => ({
        id: String(m.id || `m${Math.random()}`),
        title: m.titulo || "",
        lessons: (m.lecciones || []).map((l: any) => ({
          id: String(l.id || `l${Math.random()}`),
          title: l.titulo || "",
          duration: l.duracion || "",
          type: (l.tipo || "video") as "video" | "pdf" | "quiz",
          videoUrl: l.videoUrl || "",
          pdfUrl: l.pdfUrl || "",
          quizQuestions: l.quizJson ? JSON.parse(l.quizJson) : []
        }))
      })) || [],
    }
  } catch (error) {
    console.warn("Error fetching curso por id:", error)
    return getCursoById(id) || null
  }
}

export const fetchAdminCursos = async (token: string): Promise<Curso[]> => {
  if (!token) {
    console.error("No token provided for admin fetch")
    return []
  }
  try {
    const res = await fetch(`${API_BASE}/api/admin/cursos`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      mode: "cors"
    })
    if (!res.ok) {
      console.error(`Error fetching admin cursos: ${res.status}`)
      return []
    }
    const apiCursos = await res.json()

    // If backend returns courses, use ONLY those
    if (apiCursos.length > 0) {
      return apiCursos.map((c: any) => ({
        id: String(c.id),
        title: c.titulo,
        category: c.categoria || "Pintura",
        modalidad: (c.modalidad || "Online") as Curso["modalidad"],
        duracion: c.duracion || "",
        nivel: (c.nivel || "Inicial") as Curso["nivel"],
        precio: c.precio,
        description: c.descripcion || "",
        image: c.imagen || "/artwork-1.jpg",
        introVideoUrl: c.introVideoUrl || "",
        publicado: c.publicado,
        featured: c.destacado || false,
        modules: c.modulos?.map((m: any) => ({
          id: String(m.id || `m${Math.random()}`),
          title: m.titulo || "",
          lessons: (m.lecciones || []).map((l: any) => ({
            id: String(l.id || `l${Math.random()}`),
            title: l.titulo || "",
            duration: l.duracion || "",
            type: (l.tipo || "video") as "video" | "pdf" | "quiz",
            videoUrl: l.videoUrl || "",
            pdfUrl: l.pdfUrl || "",
            quizQuestions: l.quizJson ? JSON.parse(l.quizJson) : []
          }))
        })) || []
      }))
    }

    // Empty is valid - no cursos created yet
    return []
  } catch (error) {
    console.error("Error fetching admin cursos:", error)
    return []
  }
}

export const crearCursoAPI = async (token: string, curso: Partial<Curso>): Promise<Curso | null> => {
  try {
    // Map frontend modules to backend ModuloDto format with safe defaults
    const modulosDto = (curso.modules || []).map((m: any) => ({
      titulo: m.title || "Módulo sin título",
      orden: 0,
      lecciones: (m.lessons || []).map((l: any) => ({
        titulo: l.title || "Lección sin título",
        duracion: l.duration || "0",
        tipo: l.type || "video",
        videoUrl: l.videoUrl || null,
        pdfUrl: l.pdfUrl || null,
        quizJson: l.quizQuestions && l.quizQuestions.length > 0 ? JSON.stringify(l.quizQuestions) : null,
        orden: 0
      }))
    }))

    const requestBody = {
      titulo: curso.title || "",
      descripcion: curso.description || "",
      precio: curso.precio || 0,
      imagen: curso.image || "/artwork-1.jpg",
      categoria: curso.category || "Pintura",
      duracion: curso.duracion || "",
      nivel: curso.nivel || "Inicial",
      modalidad: curso.modalidad || "Online",
      publicado: true,
      introVideoUrl: curso.introVideoUrl || "",
      modulos: modulosDto
    }
    
    console.log("📤 POST /api/admin/cursos:", JSON.stringify(requestBody, null, 2))

    const res = await fetch(`${API_BASE}/api/admin/cursos`, {
      method: "POST",
      cache: "no-store",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      mode: "cors",
      body: JSON.stringify(requestBody)
    })
    
    console.log("📥 Response status:", res.status)
    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ Error response:", errorText)
      throw new Error(`Error creating curso: ${res.status} - ${errorText}`)
    }
    const c = await res.json()
    return {
      id: String(c.id),
      title: c.titulo,
      category: c.categoria || "Pintura",
      modalidad: (c.modalidad || "Online") as Curso["modalidad"],
      duracion: c.duracion || "",
      nivel: (c.nivel || "Inicial") as Curso["nivel"],
      precio: c.precio,
      description: c.descripcion || "",
      image: c.imagen || "/artwork-1.jpg",
      introVideoUrl: c.introVideoUrl || "",
      publicado: c.publicado,
      featured: c.destacado || false,
      modules: c.modulos?.map((m: any) => ({
        id: String(m.id || `m${Math.random()}`),
        title: m.titulo || "",
        lessons: (m.lecciones || []).map((l: any) => ({
          id: String(l.id || `l${Math.random()}`),
          title: l.titulo || "",
          duration: l.duracion || "",
          type: (l.tipo || "video") as "video" | "pdf" | "quiz",
          videoUrl: l.videoUrl || "",
          pdfUrl: l.pdfUrl || "",
          quizQuestions: l.quizJson ? JSON.parse(l.quizJson) : []
        }))
      })) || [],
    }
  } catch (error) {
    console.error("Error creating curso:", error)
    return null
  }
}

export const actualizarCursoAPI = async (token: string, id: string, curso: Partial<Curso>): Promise<Curso | null> => {
  try {
    // Map frontend modules to backend ModuloDto format
    const modulosDto = curso.modules?.map(m => ({
      titulo: m.title,
      orden: 0,
      lecciones: m.lessons.map(l => ({
        titulo: l.title,
        duracion: l.duration,
        tipo: l.type,
        videoUrl: l.videoUrl || null,
        pdfUrl: l.pdfUrl || null,
        quizJson: l.quizQuestions && l.quizQuestions.length > 0 ? JSON.stringify(l.quizQuestions) : null,
        orden: 0
      }))
    })) || []

    const res = await fetch(`${API_BASE}/api/admin/cursos/${id}`, {
      method: "PUT",
      cache: "no-store",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      mode: "cors",
      body: JSON.stringify({
        titulo: curso.title,
        descripcion: curso.description,
        precio: curso.precio,
        imagen: curso.image,
        categoria: curso.category,
        duracion: curso.duracion,
        nivel: curso.nivel,
        modalidad: curso.modalidad,
        publicado: curso.publicado,
        introVideoUrl: curso.introVideoUrl,
        modulos: modulosDto
      })
    })
    if (!res.ok) {
      console.error(`Error updating curso: ${res.status}`)
      return null
    }
    const c = await res.json()
    return {
      id: String(c.id),
      title: c.titulo,
      category: c.categoria || "Pintura",
      modalidad: (c.modalidad || "Online") as Curso["modalidad"],
      duracion: c.duracion || "",
      nivel: (c.nivel || "Inicial") as Curso["nivel"],
      precio: c.precio,
      description: c.descripcion || "",
      image: c.imagen || "/artwork-1.jpg",
      introVideoUrl: c.introVideoUrl || "",
      publicado: c.publicado,
      featured: c.destacado || false,
      modules: c.modulos?.map((m: any) => ({
        id: String(m.id || `m${Math.random()}`),
        title: m.titulo || "",
        lessons: (m.lecciones || []).map((l: any) => ({
          id: String(l.id || `l${Math.random()}`),
          title: l.titulo || "",
          duration: l.duracion || "",
          type: (l.tipo || "video") as "video" | "pdf" | "quiz",
          videoUrl: l.videoUrl || "",
          pdfUrl: l.pdfUrl || "",
          quizQuestions: l.quizJson ? JSON.parse(l.quizJson) : []
        }))
      })) || [],
    }
  } catch (error) {
    console.error("Error updating curso:", error)
    return null
  }
}

export const eliminarCursoAPI = async (token: string, id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/cursos/${id}`, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      mode: "cors"
    })
    return res.ok
  } catch (error) {
    console.error("Error deleting curso:", error)
    return false
  }
}

// ============= PRODUCTOS API =============

const mapProductoFromAPI = (p: any): Product => ({
  id: String(p.id),
  name: p.nombre,
  price: p.precio,
  description: p.descripcion || "",
  image: p.imagen || "/artwork-1.jpg",
  category: p.categoria || "Productos",
  featured: p.destacado || false,
  publicado: p.publicado,
})

export const fetchProductsFromAPI = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/productos`, { cache: "no-store" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()).map(mapProductoFromAPI)
  } catch (error) {
    console.warn("Backend no disponible para productos:", error)
    return []
  }
}

export const fetchProductByIdFromAPI = async (id: string): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/productos/${id}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Error fetching producto")
    return mapProductoFromAPI(await res.json())
  } catch {
    return getProductById(id) || null
  }
}

export const fetchAdminProductos = async (token: string): Promise<Product[]> => {
  if (!token) {
    console.error("No token provided for admin fetch")
    return []
  }
  try {
    const res = await fetch(`${API_BASE}/api/admin/productos`, {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!res.ok) {
      console.error(`Error fetching admin productos: ${res.status}`)
      return []
    }
    return (await res.json()).map(mapProductoFromAPI)
  } catch (error) {
    console.error("Error fetching admin productos:", error)
    return []
  }
}

export const crearProductoAPI = async (token: string, p: Partial<Product>): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        nombre: p.name, descripcion: p.description, precio: p.price,
        imagen: p.image, categoria: p.category, destacado: p.featured, publicado: true
      })
    })
    console.log("crearProductoAPI response status:", res.status)
    if (!res.ok) {
      const errText = await res.text()
      console.error("crearProductoAPI error:", errText)
      throw new Error(`HTTP ${res.status}`)
    }
    const created = await res.json()
    console.log("crearProductoAPI created:", created)
    return mapProductoFromAPI(created)
  } catch (error) {
    console.error("Error creating producto:", error)
    return null
  }
}

export const actualizarProductoAPI = async (token: string, id: string, p: Partial<Product>): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        nombre: p.name, descripcion: p.description, precio: p.price,
        imagen: p.image, categoria: p.category, destacado: p.featured, publicado: true
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return mapProductoFromAPI(await res.json())
  } catch (error) {
    console.error("Error updating producto:", error)
    return null
  }
}

export const eliminarProductoAPI = async (token: string, id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/productos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    return res.ok
  } catch {
    return false
  }
}

// ============= CHECKOUT / MERCADO PAGO =============

export interface CheckoutItem {
  id: string
  type: "course" | "product"
  title: string
  price: number
  image: string
  quantity: number
}

export interface CheckoutResult {
  preferenceId: string | null
  initPoint: string | null
  sandboxInitPoint: string | null
  externalReference: string
  demo: boolean
  message?: string
}

export const crearPreferenciaCheckout = async (token: string, items: CheckoutItem[]): Promise<CheckoutResult | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/checkout/preference`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        items: items.map(it => ({
          id: parseInt(it.id) || 0,
          tipo: it.type === "course" ? "CURSO" : "PRODUCTO",
          titulo: it.title,
          precio: it.price,
          imagen: it.image,
          cantidad: it.quantity,
        }))
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error("Error creating MP preference:", error)
    return null
  }
}

export const confirmarCheckoutDemo = async (token: string, externalReference: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/checkout/confirm-demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ externalReference })
    })
    return res.ok
  } catch {
    return false
  }
}

// ============= ÓRDENES =============

export interface Orden {
  id: number
  externalReference: string
  total: number
  estado: "PENDIENTE" | "PAGADA" | "FALLIDA" | "CANCELADA"
  items: Array<{
    id: number
    tipo: "CURSO" | "PRODUCTO"
    referenciaId: number
    titulo: string
    imagen: string
    precio: number
    cantidad: number
  }>
  createdAt: string
}

export const fetchMisOrdenes = async (token: string): Promise<Orden[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/mis-ordenes`, {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error("Error fetching ordenes:", error)
    return []
  }
}

// ============= INSCRIPCIONES =============

export interface Inscripcion {
  id: number
  cursoId: number
  cursoTitulo: string
  cursoImagen: string
  leccionesCompletadas: string[]
  fechaInscripcion: string
}

export const fetchMisCursos = async (token: string): Promise<Inscripcion[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/mis-cursos`, {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error("Error fetching mis-cursos:", error)
    return []
  }
}

export const estoyInscripto = async (token: string, cursoId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/cursos/${cursoId}/inscripcion`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!res.ok) return false
    const data = await res.json()
    return !!data.inscripto
  } catch {
    return false
  }
}

export const completarLeccion = async (token: string, cursoId: string, leccionId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/cursos/${cursoId}/lecciones/${leccionId}/completar`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    })
    return res.ok
  } catch {
    return false
  }
}

export const inscribirEnCursoAPI = async (token: string, cursoId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/cursos/${cursoId}/inscripcion`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    })
    return res.ok
  } catch {
    return false
  }
}

export const getProducts = (): Product[] => {
  return getStoredData("products", products)
}

export const cursos: Curso[] = [
  {
    id: "iniciacion-acuarela",
    title: "Iniciación a la Acuarela",
    subtitle: "Descubrí la magia de la mancha y el agua",
    category: "Watercolor",
    modalidad: "Online",
    duracion: "8 clases",
    nivel: "Inicial",
    precio: 45000,
    description:
      "Un primer encuentro con la acuarela: cómo soltar el control, dejar que el agua haga su parte, y construir desde la mancha.",
    image: "/galeria/naturaleza-1.jpeg",
    featured: true,
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Soltar el Control",
        lessons: [
          { id: "l1", title: "Bienvenida e introducción", duration: "10 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l2", title: "Materiales y preparación", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l3", title: "El agua como aliada", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: Construir desde la Mancha",
        lessons: [
          { id: "l4", title: "Técnicas de lavado", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l5", title: "Capas transparentes", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l6", title: "Ejercicio: primera obra", duration: "45 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      }
    ]
  },
  {
    id: "retrato-busqueda",
    title: "El Retrato como Búsqueda",
    subtitle: "Captar el interior más allá de lo visible",
    category: "Drawing",
    modalidad: "Híbrido",
    duracion: "10 clases",
    nivel: "Intermedio",
    precio: 65000,
    description:
      "Aprendé a dibujar rostros como una forma de explorar el mundo interior de las personas. Más allá de la técnica, una mirada.",
    image: "/galeria/retrato-1.jpeg",
    featured: true,
    modules: [
      {
        id: "m1",
        title: "Módulo 1: El Rostro como Mapa",
        lessons: [
          { id: "l1", title: "Anatomía y proporciones", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l2", title: "Luz y sombra en el retrato", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l3", title: "Ejercicio: primer retrato", duration: "40 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: Mirar más Allá",
        lessons: [
          { id: "l4", title: "Expresión y emoción", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l5", title: "Retrato desde la memoria", duration: "35 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      }
    ]
  },
  {
    id: "bordado-imagen",
    title: "Bordado e Imagen",
    subtitle: "Cruces entre hilos, telas y dibujo",
    category: "Mixed Media",
    modalidad: "Presencial",
    duracion: "6 clases",
    nivel: "Todos los niveles",
    precio: 55000,
    description:
      "Una exploración entre lo textil y lo visual. Donde los hilos completan lo que la línea no termina de decir.",
    image: "/galeria/naturaleza-5.jpeg",
    featured: true,
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Cruce de Lenguajes",
        lessons: [
          { id: "l1", title: "Materiales textiles", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l2", title: "Del dibujo al bordado", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l3", title: "Puntadas básicas", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: Composición Textil",
        lessons: [
          { id: "l4", title: "Textura y relieve", duration: "35 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l5", title: "Pieza final", duration: "50 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      }
    ]
  },
  {
    id: "mancha-color",
    title: "Pintura desde la Mancha",
    subtitle: "Abrazá la imprevisibilidad",
    category: "Watercolor",
    modalidad: "Online",
    duracion: "8 clases",
    nivel: "Todos los niveles",
    precio: 50000,
    description:
      "Pintar empezando por lo que aparece, no por lo que se planea. Un curso para soltar y descubrir.",
    image: "/galeria/naturaleza-3.jpeg",
    featured: true,
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Soltar la Planificación",
        lessons: [
          { id: "l1", title: "El lienzo en blanco", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l2", title: "Primera mancha", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l3", title: "Escuchar lo que emerge", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: Construcción Orgánica",
        lessons: [
          { id: "l4", title: "Capas que respiran", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l5", title: "Obra final", duration: "45 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ]
      }
    ]
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Print Despertar Carmesí",
    price: 85,
    description:
      "Impresión de alta calidad en papel fine art. Edición limitada de 50 unidades, numeradas y firmadas.",
    image: "/artwork-1.jpg",
    category: "Prints",
    featured: true,
  },
  {
    id: "2",
    name: "Print Susurros del Mediterráneo",
    price: 95,
    description:
      "Impresión giclée en papel algodón 310gsm. Incluye certificado de autenticidad.",
    image: "/artwork-2.jpg",
    category: "Prints",
    featured: true,
  },
  {
    id: "3",
    name: "Cuaderno Artístico",
    price: 25,
    description:
      "Cuaderno de 120 páginas con portada ilustrada. Papel premium 120gsm, perfecto para bocetos.",
    image: "/product-notebook.jpg",
    category: "Papelería",
    featured: true,
  },
  {
    id: "4",
    name: "Set de Postales",
    price: 18,
    description:
      "Colección de 8 postales con las obras más emblemáticas. Impresas en cartulina mate de alta calidad.",
    image: "/product-postcards.jpg",
    category: "Papelería",
  },
  {
    id: "5",
    name: "Tote Bag Nebulosa",
    price: 32,
    description:
      "Bolsa de algodón orgánico con diseño exclusivo. Perfecta para el día a día.",
    image: "/product-tote.jpg",
    category: "Accesorios",
  },
  {
    id: "6",
    name: "Print Digital Nebulosa Interior",
    price: 45,
    description:
      "Archivo digital de alta resolución para impresión personal. Incluye licencia de uso personal.",
    image: "/artwork-4.jpg",
    category: "Digital",
  },
]

export const getFeaturedCursos = () => {
  const featured = getCursos().filter((c) => c.featured)
  // Fallback to static data if localStorage has no featured courses
  return featured.length > 0 ? featured : cursos.filter((c) => c.featured)
}

export const getFeaturedProducts = () => {
  const featured = getProducts().filter((p) => p.featured)
  // Fallback to static data if localStorage has no featured products
  return featured.length > 0 ? featured : products.filter((p) => p.featured)
}
export const getCursoById = (id: string) => getCursos().find((c) => c.id === id)
export const getProductById = (id: string) => getProducts().find((p) => p.id === id)

// User enrollment (for courses purchased)
export const enrollUserInCurso = (userId: string, cursoId: string) => {
  if (typeof window === "undefined") return
  const enrollments = JSON.parse(localStorage.getItem("enrollments") || "{}")
  if (!enrollments[userId]) {
    enrollments[userId] = []
  }
  if (!enrollments[userId].includes(cursoId)) {
    enrollments[userId].push(cursoId)
    localStorage.setItem("enrollments", JSON.stringify(enrollments))
  }
}

export const getUserEnrollments = (userId: string): string[] => {
  if (typeof window === "undefined") return []
  const enrollments = JSON.parse(localStorage.getItem("enrollments") || "{}")
  return enrollments[userId] || []
}

export const isUserEnrolled = (userId: string, cursoId: string): boolean => {
  const enrollments = getUserEnrollments(userId)
  return enrollments.includes(cursoId)
}

// User purchases (for products)
export interface Purchase {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
  date: string
}

export const addUserPurchase = (userId: string, purchase: Omit<Purchase, "id" | "date">) => {
  if (typeof window === "undefined") return
  const purchases = JSON.parse(localStorage.getItem("purchases") || "{}")
  if (!purchases[userId]) {
    purchases[userId] = []
  }
  const newPurchase: Purchase = {
    ...purchase,
    id: `PUR-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    date: new Date().toISOString()
  }
  purchases[userId].push(newPurchase)
  localStorage.setItem("purchases", JSON.stringify(purchases))
}

export const getUserPurchases = (userId: string): Purchase[] => {
  if (typeof window === "undefined") return []
  const purchases = JSON.parse(localStorage.getItem("purchases") || "{}")
  return purchases[userId] || []
}

// Progress tracking
export const updateLessonProgress = (userId: string, cursoId: string, lessonId: string) => {
  if (typeof window === "undefined") return
  const progress = JSON.parse(localStorage.getItem("progress") || "{}")
  if (!progress[userId]) progress[userId] = {}
  if (!progress[userId][cursoId]) progress[userId][cursoId] = []
  if (!progress[userId][cursoId].includes(lessonId)) {
    progress[userId][cursoId].push(lessonId)
    localStorage.setItem("progress", JSON.stringify(progress))
  }
}

export const getLessonProgress = (userId: string, cursoId: string): string[] => {
  if (typeof window === "undefined") return []
  const progress = JSON.parse(localStorage.getItem("progress") || "{}")
  return (progress[userId] && progress[userId][cursoId]) || []
}

export const getCourseProgress = (userId: string, cursoId: string): number => {
  const curso = getCursoById(cursoId)
  if (!curso || !curso.modules) return 0
  const totalLessons = curso.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  if (totalLessons === 0) return 0
  const completed = getLessonProgress(userId, cursoId).length
  return Math.round((completed / totalLessons) * 100)
}

// Delete functions
export const deleteCurso = (id: string) => {
  if (typeof window === "undefined") return
  const cursos = getCursos().filter((c) => c.id !== id)
  localStorage.setItem("cursos", JSON.stringify(cursos))
}

export const deleteProduct = (id: string) => {
  if (typeof window === "undefined") return
  const products = getProducts().filter((p) => p.id !== id)
  localStorage.setItem("products", JSON.stringify(products))
}

// Update functions
export const updateCurso = (id: string, updatedData: Partial<Curso>) => {
  if (typeof window === "undefined") return
  const cursos = getCursos().map((c) => 
    c.id === id ? { ...c, ...updatedData } : c
  )
  localStorage.setItem("cursos", JSON.stringify(cursos))
}

export const updateProduct = (id: string, updatedData: Partial<Product>) => {
  if (typeof window === "undefined") return
  const products = getProducts().map((p) => 
    p.id === id ? { ...p, ...updatedData } : p
  )
  localStorage.setItem("products", JSON.stringify(products))
}
