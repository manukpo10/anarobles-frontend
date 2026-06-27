"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? "success" : "error")
      if (res.ok) setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex justify-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={status === "loading" || status === "success"}
          className="w-full max-w-[240px] rounded-full bg-primary-foreground/10 px-5 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/40 transition-all focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-60"
        />
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center rounded-full bg-secondary px-6 text-secondary-foreground transition-all hover:bg-accent hover:shadow-lg hover:shadow-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Suscribirse"
        >
          <span className="text-sm font-medium">
            {status === "loading" ? "Enviando…" : "Suscribirse"}
          </span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-center justify-center gap-2 text-sm text-secondary"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            >
              <Check className="h-3 w-3" />
            </motion.div>
            <span>¡Listo, te avisamos cuando estén los cursos!</span>
          </motion.div>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 text-center text-sm text-red-400"
          >
            Algo salió mal. Intentá de nuevo.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
