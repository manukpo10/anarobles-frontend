"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

const retratos = [
  { id: 1, src: "/galeria/retrato-1.jpeg", title: "Retrato 1", año: "2024" },
  { id: 2, src: "/galeria/retrato-2.jpeg", title: "Retrato 2", año: "2024" },
  { id: 3, src: "/galeria/retrato-3.jpeg", title: "Retrato 3", año: "2024" },
  { id: 4, src: "/galeria/retrato-4.jpeg", title: "Retrato 4", año: "2024" },
  { id: 5, src: "/galeria/retrato-5.jpeg", title: "Retrato 5", año: "2024" },
  { id: 17, src: "/galeria/retrato-6.jpeg", title: "Retrato 6", año: "2024" },
]

const naturaleza = [
  { id: 6, src: "/galeria/naturaleza-1.jpeg", title: "Naturaleza 1", año: "2024" },
  { id: 7, src: "/galeria/naturaleza-2.jpeg", title: "Naturaleza 2", año: "2024" },
  { id: 8, src: "/galeria/naturaleza-3.jpeg", title: "Naturaleza 3", año: "2024" },
  { id: 9, src: "/galeria/naturaleza-4.jpeg", title: "Naturaleza 4", año: "2024" },
  { id: 10, src: "/galeria/naturaleza-5.jpeg", title: "Naturaleza 5", año: "2024" },
  { id: 11, src: "/galeria/naturaleza-6.jpeg", title: "Naturaleza 6", año: "2024" },
  { id: 12, src: "/galeria/naturaleza-7.jpeg", title: "Naturaleza 7", año: "2024" },
  { id: 13, src: "/galeria/naturaleza-8.jpeg", title: "Naturaleza 8", año: "2024" },
  { id: 14, src: "/galeria/naturaleza-9.jpeg", title: "Naturaleza 9", año: "2024" },
  { id: 15, src: "/galeria/naturaleza-10.jpeg", title: "Naturaleza 10", año: "2024" },
  { id: 16, src: "/galeria/naturaleza-11.jpeg", title: "Naturaleza 11", año: "2024" },
]

const todasLasObras = [...retratos, ...naturaleza]

const secciones = [
  { titulo: "Retratos", obras: retratos },
  { titulo: "Naturaleza", obras: naturaleza },
]

export default function GaleriaPage() {
  const [obraSeleccionada, setObraSeleccionada] = useState<null | typeof todasLasObras[0]>(null)
  const [imagenCargada, setImagenCargada] = useState<Record<number, boolean>>({})

  const abrirModal = useCallback((obra: typeof todasLasObras[0]) => setObraSeleccionada(obra), [])
  const cerrarModal = useCallback(() => setObraSeleccionada(null), [])

  const navegarObra = useCallback((direccion: "anterior" | "siguiente") => {
    if (!obraSeleccionada) return
    const idx = todasLasObras.findIndex(o => o.id === obraSeleccionada.id)
    const nuevoIdx = direccion === "anterior" ? (idx - 1 + todasLasObras.length) % todasLasObras.length : (idx + 1) % todasLasObras.length
    setObraSeleccionada(todasLasObras[nuevoIdx])
  }, [obraSeleccionada])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden bg-primary">
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-6xl font-light text-white md:text-8xl">
            Galería
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 text-lg font-light tracking-wider text-white/70">
            Explorando formas, colores y emociones
          </motion.p>
        </div>
      </section>

      {/* Secciones */}
      {secciones.map(seccion => (
        <section key={seccion.titulo} className="mx-auto max-w-7xl px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 font-serif text-4xl font-light text-secondary md:text-5xl"
          >
            {seccion.titulo}
          </motion.h2>
          <motion.div layout className="columns-1 gap-6 md:columns-2 lg:columns-3">
            <AnimatePresence mode="popLayout">
              {seccion.obras.map((obra, index) => (
                <motion.div
                  key={obra.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10"
                  onClick={() => abrirModal(obra)}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={obra.src}
                      alt={obra.title}
                      width={600}
                      height={800}
                      className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${imagenCargada[obra.id] ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setImagenCargada(prev => ({ ...prev, [obra.id]: true }))}
                    />
                    {!imagenCargada[obra.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-6 text-white transition-transform duration-500 group-hover:translate-y-0">
                      <h3 className="font-serif text-2xl font-light">{obra.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{obra.año}</p>
                    </div>
                    <div className="absolute right-4 top-4 rounded-full bg-white/20 p-3 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <ZoomIn className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      ))}

      {/* Modal */}
      <AnimatePresence>
        {obraSeleccionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/95 backdrop-blur-sm"
            onClick={cerrarModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative mx-4 max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={cerrarModal} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white">
                <X className="h-6 w-6 text-secondary" />
              </button>

              <div className="flex flex-col md:flex-row max-h-[85vh]">
                <div className="flex items-center justify-center overflow-auto bg-gray-100 p-4">
                  <img
                    src={obraSeleccionada.src}
                    alt={obraSeleccionada.title}
                    className="h-auto w-auto"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12 md:min-w-[300px]">
                  <h2 className="font-serif text-4xl font-light text-secondary">{obraSeleccionada.title}</h2>
                  <p className="mt-4 text-sm text-gray-600">{obraSeleccionada.año}</p>
                </div>
              </div>

              <button onClick={() => navegarObra("anterior")} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 backdrop-blur-sm transition-colors hover:bg-white">
                <ChevronLeft className="h-6 w-6 text-secondary" />
              </button>
              <button onClick={() => navegarObra("siguiente")} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 backdrop-blur-sm transition-colors hover:bg-white">
                <ChevronRight className="h-6 w-6 text-secondary" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
