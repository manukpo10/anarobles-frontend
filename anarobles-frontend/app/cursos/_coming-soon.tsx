"use client"

import { useState } from "react"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { CursosHeader } from "@/components/cursos/cursos-header"

const TOTAL_SPOTS = 20

export default function CursosComingSoon() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <CursosHeader />

      <section className="bg-background py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">

          {/* Kicker */}
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Lanzamiento próximo
          </span>

          <h1 className="mt-6 font-serif font-light tracking-tight text-foreground" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.1 }}>
            Aprendé acuarela con
            <span className="block font-semibold italic text-primary"> Ana Cecilia</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Los primeros <strong className="text-foreground">{TOTAL_SPOTS} en anotarse</strong> reciben un{" "}
            <strong className="text-primary">15% de descuento</strong> en su primer curso.
            Anotate ahora y te avisamos antes que nadie cuando abran las inscripciones.
          </p>

          {/* Form */}
          <div className="mt-10">
            {status === "success" ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                <BookOpen className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-4 text-lg font-semibold text-foreground">
                  ¡Listo, te anotaste!
                </p>
                <p className="mt-2 text-muted-foreground">
                  Cuando abran las inscripciones, sos de los primeros en enterarte — y tu 15% de descuento está reservado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="flex-1 rounded-full border border-border bg-card px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-accent hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Enviando…" : (
                    <>
                      Anotarme
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-sm text-destructive">
                Algo salió mal. Escribinos directamente a{" "}
                <a href="mailto:aroblessanguina@gmail.com" className="underline">
                  aroblessanguina@gmail.com
                </a>
              </p>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              Sin spam. Solo te avisamos cuando los cursos estén listos.
            </p>
          </div>

          {/* Secondary links */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/galeria"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
            >
              Ver la galería
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/contacto"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
            >
              Contactar a Ana
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}
