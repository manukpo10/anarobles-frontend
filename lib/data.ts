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
    id: "1",
    title: "Pintura al Óleo: Iniciación",
    category: "Oil Painting",
    modalidad: "Presencial",
    duracion: "8 semanas · 2 hs por clase",
    nivel: "Inicial",
    precio: 12000,
    description:
      "Un recorrido por los fundamentos de la pintura al óleo: preparación de la paleta, mezcla de colores, capas y veladuras. Trabajaremos sobre tres obras propias durante el cursado.",
    image: "/artwork-1.jpg",
    featured: true,
    modules: [
      {
        id: "m1",
        title: "Módulo 1: Fundamentos del Óleo",
        lessons: [
          { id: "l1", title: "Bienvenida e introducción al curso", duration: "5 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", resources: [{ name: "Guía de inicio PDF", url: "/guia-inicio.pdf" }] },
          { id: "l2", title: "Materiales necesarios", duration: "12 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l3", title: "Preparación de la paleta", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l4", title: "Guía de colores y mezclas", duration: "PDF", type: "pdf", pdfUrl: "/guia-colores.pdf", resources: [{ name: "Guía de colores PDF", url: "/guia-colores.pdf" }] },
          { id: "l5", title: "Quiz: Fundamentos", duration: "5 min", type: "quiz", quizQuestions: [
            { question: "¿Cuál es el orden correcto de las capas en óleo?", options: ["Graso sobre magro", "Magro sobre grasa", "Todas a la vez", "No importa"], correctAnswer: 0 },
            { question: "¿Qué pigmento se obtiene del óxido de hierro?", options: ["Azul ultramar", "Tierra siena", "Blanco de titanio", "Carmín"], correctAnswer: 1 }
          ] },
        ]
      },
      {
        id: "m2",
        title: "Módulo 2: Técnicas Básicas",
        lessons: [
          { id: "l6", title: "Pinceladas y trazos", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l7", title: "Capas y veladuras", duration: "18 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l8", title: "Práctica: primer ejercicio", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l9", title: "Quiz: Técnicas básicas", duration: "5 min", type: "quiz", quizQuestions: [
            { question: "¿Qué es una veladura?", options: ["Capa transparente", "Capa sólida", "Textura rugosa", "Fondo blanco"], correctAnswer: 0 }
          ] },
        ]
      },
      {
        id: "m3",
        title: "Módulo 3: Composición",
        lessons: [
          { id: "l10", title: "Reglas de composición", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l11", title: "Ejercicio: bodegón simple", duration: "45 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          { id: "l12", title: "Apuntes de composición", duration: "PDF", type: "pdf", pdfUrl: "/apuntes-composicion.pdf" },
        ]
      }
    ]
  },
    {
      id: "2",
      title: "Acrílico y Color",
      category: "Oil Painting",
      modalidad: "Presencial",
      duracion: "6 semanas · 2 hs por clase",
      nivel: "Intermedio",
      precio: 10000,
      description:
        "Profundizaremos en la teoría del color y la composición a través del acrílico, con foco en paisajes contemporáneos y abstracciones inspiradas en el Mediterráneo.",
      image: "/artwork-2.jpg",
      featured: true,
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Teoría del Color",
          lessons: [
            { id: "l1", title: "Introducción al color", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Rueda de colores", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l3", title: "Ejercicio práctico", duration: "40 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        },
        {
          id: "m2",
          title: "Módulo 2: Acrílico Avanzado",
          lessons: [
            { id: "l4", title: "Técnicas de veladura", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l5", title: "Paisajes contemporáneos", duration: "35 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "3",
      title: "Ilustración con Acuarela",
      category: "Watercolor",
      modalidad: "Híbrido",
      duracion: "5 semanas · 1.5 hs por clase",
      nivel: "Todos los niveles",
      precio: 8500,
      description:
        "Aprenderás a ilustrar con tinta y acuarela, explorando la composición, el trazo expresivo y la creación de pequeñas series narrativas.",
      image: "/artwork-3.jpg",
      featured: true,
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Introducción a la Acuarela",
          lessons: [
            { id: "l1", title: "Materiales y preparación", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Técnicas básicas", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l3", title: "Ejercicio: primera acuarela", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "4",
      title: "Arte Digital desde Cero",
      category: "Digital Art",
      modalidad: "Online",
      duracion: "10 clases en vivo + material",
      nivel: "Inicial",
      precio: 9500,
      description:
        "Una introducción a las herramientas digitales (Procreate / Photoshop) para llevar tu arte al mundo digital sin perder identidad personal.",
      image: "/artwork-4.jpg",
      featured: true,
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Herramientas Digitales",
          lessons: [
            { id: "l1", title: "Configuración inicial", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Interfaz y atajos", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l3", title: "Primer dibujo digital", duration: "40 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "5",
      title: "Técnicas Mixtas",
      category: "Mixed Media",
      modalidad: "Presencial",
      duracion: "8 semanas · 2 hs por clase",
      nivel: "Avanzado",
      precio: 14000,
      description:
        "Combinaremos óleo, acrílico, tinta y collage para construir obras de gran impacto. Pensado para quienes ya tienen una práctica regular.",
      image: "/artwork-5.jpg",
      featured: true,
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Introducción a Técnicas Mixtas",
          lessons: [
            { id: "l1", title: "¿Qué son las técnicas mixtas?", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Materiales combinados", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "6",
      title: "Dibujo y Sombras",
      category: "Drawing",
      modalidad: "Presencial",
      duracion: "4 semanas · 2 hs por clase",
      nivel: "Inicial",
      precio: 7000,
      description:
        "Un curso intensivo de dibujo a grafito centrado en el estudio de la luz, la sombra y el volumen sobre papel.",
      image: "/artwork-6.jpg",
      featured: true,
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Luz y Sombra",
          lessons: [
            { id: "l1", title: "Teoría del claroscuro", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Ejercicio práctico", duration: "45 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "7",
      title: "Paisajes al Óleo",
      category: "Oil Painting",
      modalidad: "Presencial",
      duracion: "6 semanas · 2 hs por clase",
      nivel: "Intermedio",
      precio: 11500,
      description:
        "Llevaremos al lienzo paisajes desde el boceto hasta la obra terminada, trabajando atmósferas, profundidad y luz natural.",
      image: "/artwork-7.jpg",
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Bocetos de Paisaje",
          lessons: [
            { id: "l1", title: "Teoría del paisaje", duration: "20 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Bocetaje rápido", duration: "30 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "8",
      title: "Arte Generativo",
      category: "Digital Art",
      modalidad: "Online",
      duracion: "6 clases en vivo",
      nivel: "Avanzado",
      precio: 13000,
      description:
        "Introducción al arte generativo con código creativo. Pensado para artistas con curiosidad técnica que quieran explorar nuevos lenguajes.",
      image: "/artwork-8.jpg",
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Conceptos Básicos",
          lessons: [
            { id: "l1", title: "¿Qué es el arte generativo?", duration: "25 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Primer algoritmo", duration: "40 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "9",
      title: "Taller de Niños y Niñas",
      category: "Mixed Media",
      modalidad: "Presencial",
      duracion: "Clases sueltas · 1.5 hs",
      nivel: "Todos los niveles",
      precio: 4500,
      description:
        "Un espacio creativo para chicos y chicas de 6 a 12 años donde experimentar con materiales, color y juego. Inscripción mensual.",
      image: "/artwork-9.jpg",
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Exploración",
          lessons: [
            { id: "l1", title: "Bienvenidos al taller", duration: "10 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Jugando con colores", duration: "45 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
          ]
        }
      ]
    },
    {
      id: "10",
      title: "Bocetaje Urbano",
      category: "Drawing",
      modalidad: "Presencial",
      duracion: "Workshop intensivo de fin de semana",
      nivel: "Todos los niveles",
      precio: 6000,
      description:
        "Salidas de campo para retratar la ciudad con técnicas mixtas sobre cuaderno. Incluye materiales básicos.",
      image: "/artwork-10.jpg",
      modules: [
        {
          id: "m1",
          title: "Módulo 1: Bocetaje en Exterior",
          lessons: [
            { id: "l1", title: "Materiales para exteriores", duration: "15 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
            { id: "l2", title: "Técnicas rápidas", duration: "35 min", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
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

export const getFeaturedCursos = () => getCursos().filter((c) => c.featured)
export const getFeaturedProducts = () => getProducts().filter((p) => p.featured)
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
