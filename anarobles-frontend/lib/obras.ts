export type Disponibilidad = "disponible" | "vendida" | "consultar"
export type Categoria = "retratos" | "naturaleza" | string

export type Obra = {
  id:             string
  slug:           string
  titulo:         string
  categoria:      Categoria
  año:            number
  tecnica:        string
  dimensiones?:   string
  disponibilidad: Disponibilidad
  destacada?:     boolean
  imagen:         string
  imgW:           number   // real pixel width  — for correct aspect ratio in masonry
  imgH:           number   // real pixel height
  descripcion?:   string
  precio?:        number
}

export const obras: Obra[] = [

  // ── RETRATOS ──────────────────────────────────────────────────────────
  {
    id: "ella", slug: "ella", titulo: "Ella",
    categoria: "retratos", año: 2022,
    tecnica: "Dibujo en grafito", dimensiones: "24 × 30 cm",
    disponibilidad: "consultar", destacada: true,
    imagen: "/galeria/ella.jpeg", imgW: 825, imgH: 1123,
  },
  {
    id: "etnia", slug: "etnia", titulo: "Etnia",
    categoria: "retratos", año: 2025,
    tecnica: "Dibujo sobre papel — pastel y grafito", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/etnia.jpeg", imgW: 535, imgH: 753,
  },
  {
    id: "nina", slug: "nina", titulo: "Niña",
    categoria: "retratos", año: 2022,
    tecnica: "Acuarela", dimensiones: "19 × 28 cm",
    disponibilidad: "consultar", destacada: true,
    imagen: "/galeria/nina.jpeg", imgW: 2339, imgH: 3399,
  },
  {
    id: "titana", slug: "titana", titulo: "Titana",
    categoria: "retratos", año: 2021,
    tecnica: "Dibujo en grafito sobre papel", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/titana.jpg", imgW: 1440, imgH: 2196,
  },
  {
    id: "melpomene", slug: "melpomene", titulo: "Melpómene",
    categoria: "retratos", año: 2025,
    tecnica: "Dibujo sobre papel — técnica mixta", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/melpomene.jpg", imgW: 583, imgH: 768,
  },

  // ── NATURALEZA ────────────────────────────────────────────────────────
  {
    id: "abrazo", slug: "abrazo", titulo: "Abrazo",
    categoria: "naturaleza", año: 2024,
    tecnica: "Acuarela sobre papel", dimensiones: "25 × 35 cm",
    disponibilidad: "disponible", destacada: true,
    imagen: "/galeria/abrazo.jpeg", imgW: 720, imgH: 1009,
  },
  {
    id: "acuarela-bordada-floral", slug: "acuarela-bordada-floral",
    titulo: "Acuarela bordada floral abstracta",
    categoria: "naturaleza", año: 2022,
    tecnica: "Acuarela bordada", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/acuarela-bordada-floral.jpeg", imgW: 775, imgH: 1022,
  },
  {
    id: "amistad", slug: "amistad", titulo: "Amistad",
    categoria: "naturaleza", año: 2023,
    tecnica: "Técnica mixta — acuarela bordada", dimensiones: "15 × 21 cm",
    disponibilidad: "consultar",
    imagen: "/galeria/amistad.jpg", imgW: 563, imgH: 846,
  },
  {
    id: "amistad-2", slug: "amistad-2", titulo: "Amistad 2",
    categoria: "naturaleza", año: 2023,
    tecnica: "Acuarela bordada", dimensiones: "15 × 21 cm",
    disponibilidad: "consultar",
    imagen: "/galeria/amistad-2.jpg", imgW: 578, imgH: 876,
  },
  {
    id: "flor-de-jacaranda", slug: "flor-de-jacaranda", titulo: "Flor de Jacarandá",
    categoria: "naturaleza", año: 2024,
    tecnica: "Acuarela bordada", dimensiones: "14 × 21 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/flor-de-jacaranda.jpeg", imgW: 654, imgH: 959,
  },
  {
    id: "flores-azules", slug: "flores-azules", titulo: "Flores azules",
    categoria: "naturaleza", año: 2021,
    tecnica: "Acuarela", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/flores-azules.jpeg", imgW: 616, imgH: 912,
  },
  {
    id: "flores-naranja", slug: "flores-naranja", titulo: "Flores naranja",
    categoria: "naturaleza", año: 2022,
    tecnica: "Acuarela", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/flores-naranja.jpeg", imgW: 512, imgH: 716,
  },
  {
    id: "geranios-en-flor", slug: "geranios-en-flor", titulo: "Geranios en flor",
    categoria: "naturaleza", año: 2023,
    tecnica: "Acuarela", dimensiones: "21 × 28 cm",
    disponibilidad: "consultar",
    imagen: "/galeria/geranios-en-flor.jpg", imgW: 774, imgH: 1105,
  },
  {
    id: "lavandas", slug: "lavandas", titulo: "Lavandas",
    categoria: "naturaleza", año: 2025,
    tecnica: "Acuarela bordada sobre papel", dimensiones: "25 × 35 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/lavandas.jpg", imgW: 906, imgH: 1226,
  },
  {
    id: "mi-jacaranda", slug: "mi-jacaranda", titulo: "Mi Jacarandá",
    categoria: "naturaleza", año: 2024,
    tecnica: "Acuarela", dimensiones: "14 × 21 cm",
    disponibilidad: "vendida",
    imagen: "/galeria/mi-jacaranda.jpeg", imgW: 747, imgH: 1133,
  },
  {
    id: "nido", slug: "nido", titulo: "Nido",
    categoria: "naturaleza", año: 2024,
    tecnica: "Acuarela", dimensiones: "30 × 40 cm",
    disponibilidad: "vendida", destacada: true,
    imagen: "/galeria/nido.jpg", imgW: 1536, imgH: 2048,
  },
  {
    id: "olivo", slug: "olivo", titulo: "Olivo",
    categoria: "naturaleza", año: 2025,
    tecnica: "Acuarela bordada sobre papel", dimensiones: "24 × 30 cm",
    disponibilidad: "consultar",
    imagen: "/galeria/olivo.jpeg", imgW: 882, imgH: 1106,
  },
  {
    id: "otono", slug: "otono", titulo: "Otoño",
    categoria: "naturaleza", año: 2025,
    tecnica: "Acuarela bordada", dimensiones: "15 × 21 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/otono.jpeg", imgW: 706, imgH: 1057,
  },
  {
    id: "petalos-de-rosa", slug: "petalos-de-rosa", titulo: "Pétalos de rosa",
    categoria: "naturaleza", año: 2024,
    tecnica: "Acuarela", dimensiones: "14 × 14 cm",
    disponibilidad: "vendida",
    imagen: "/galeria/petalos-de-rosa.jpeg", imgW: 1254, imgH: 1280,
  },
  {
    id: "santa-rita", slug: "santa-rita", titulo: "Santa Rita",
    categoria: "naturaleza", año: 2020,
    tecnica: "Acuarela sobre papel", dimensiones: "21 × 28 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/santa-rita.jpeg", imgW: 764, imgH: 1116,
  },
  {
    id: "sin-detalle-en-las-hojas", slug: "sin-detalle-en-las-hojas",
    titulo: "Sin detalle en las hojas",
    categoria: "naturaleza", año: 2025,
    tecnica: "Acuarela y pastel", dimensiones: "14 × 21 cm",
    disponibilidad: "disponible",
    imagen: "/galeria/sin-detalle-en-las-hojas.jpg", imgW: 686, imgH: 1066,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────
export const getCategorias = (): Categoria[] =>
  Array.from(new Set(obras.map((o) => o.categoria)))

export const getAños = (): number[] =>
  Array.from(new Set(obras.map((o) => o.año))).sort((a, b) => b - a)

export const getTecnicas = (): string[] =>
  Array.from(new Set(obras.map((o) => o.tecnica))).sort()

export const getObras = (
  filtros: { categoria?: Categoria; año?: number; tecnica?: string } = {}
): Obra[] =>
  obras.filter((o) => {
    if (filtros.categoria && o.categoria !== filtros.categoria) return false
    if (filtros.año && o.año !== filtros.año) return false
    if (filtros.tecnica && o.tecnica !== filtros.tecnica) return false
    return true
  })

// ── API (backend) ─────────────────────────────────────────────────────
// The static `obras` array above stays as the offline/error fallback —
// same role `products`/`getProducts` plays in lib/data.ts. Callers decide
// whether/how to fall back to it; these functions just talk to the API.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapObraFromAPI = (r: any): Obra => ({
  id: String(r.id),
  slug: r.slug,
  titulo: r.titulo,
  categoria: r.categoria,
  año: r.anio,
  tecnica: r.tecnica,
  dimensiones: r.dimensiones,
  disponibilidad: r.disponibilidad as Disponibilidad,
  destacada: r.destacada,
  imagen: r.imagen,
  imgW: r.imgW,
  imgH: r.imgH,
  descripcion: r.descripcion,
  precio: r.precio ?? undefined,
})

export const fetchObrasFromAPI = async (): Promise<Obra[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/obras`, { cache: "no-store" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()).map(mapObraFromAPI)
  } catch (error) {
    console.warn("Backend no disponible para obras:", error)
    return []
  }
}

export const fetchAdminObras = async (token: string): Promise<Obra[]> => {
  if (!token) {
    console.error("No token provided for admin fetch")
    return []
  }
  try {
    const res = await fetch(`${API_BASE}/api/admin/obras`, {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!res.ok) {
      console.error(`Error fetching admin obras: ${res.status}`)
      return []
    }
    return (await res.json()).map(mapObraFromAPI)
  } catch (error) {
    console.error("Error fetching admin obras:", error)
    return []
  }
}

export const fetchAdminObraByIdAPI = async (token: string, id: string): Promise<Obra | null> => {
  if (!token) {
    console.error("No token provided for admin fetch")
    return null
  }
  try {
    const res = await fetch(`${API_BASE}/api/admin/obras/${id}`, {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return mapObraFromAPI(await res.json())
  } catch (error) {
    console.error("Error fetching admin obra por id:", error)
    return null
  }
}

export const crearObraAPI = async (token: string, obra: Partial<Obra>): Promise<Obra | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/obras`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        titulo: obra.titulo,
        categoria: obra.categoria,
        anio: obra.año,
        tecnica: obra.tecnica,
        dimensiones: obra.dimensiones,
        disponibilidad: obra.disponibilidad,
        destacada: obra.destacada,
        imagen: obra.imagen,
        imgW: obra.imgW,
        imgH: obra.imgH,
        descripcion: obra.descripcion,
        precio: obra.precio,
        publicado: true,
      })
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error("crearObraAPI error:", errText)
      throw new Error(`HTTP ${res.status}`)
    }
    return mapObraFromAPI(await res.json())
  } catch (error) {
    console.error("Error creating obra:", error)
    return null
  }
}

export const actualizarObraAPI = async (token: string, id: string, obra: Partial<Obra>): Promise<Obra | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/obras/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({
        titulo: obra.titulo,
        categoria: obra.categoria,
        anio: obra.año,
        tecnica: obra.tecnica,
        dimensiones: obra.dimensiones,
        disponibilidad: obra.disponibilidad,
        destacada: obra.destacada,
        imagen: obra.imagen,
        imgW: obra.imgW,
        imgH: obra.imgH,
        descripcion: obra.descripcion,
        precio: obra.precio,
        publicado: true,
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return mapObraFromAPI(await res.json())
  } catch (error) {
    console.error("Error updating obra:", error)
    return null
  }
}

export const eliminarObraAPI = async (token: string, id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/obras/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    return res.ok
  } catch (error) {
    console.error("Error deleting obra:", error)
    return false
  }
}

export const subirImagenObraAPI = async (
  token: string,
  file: File
): Promise<{ url: string; width: number; height: number } | null> => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    // No Content-Type header — the browser sets the multipart boundary itself.
    const res = await fetch(`${API_BASE}/api/admin/obras/upload-imagen`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error("Error uploading imagen de obra:", error)
    return null
  }
}
