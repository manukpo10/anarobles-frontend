"use client"

import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Facebook, MessageCircle, Mail, Heart, Check, Palette, ArrowRight, Loader2 } from "lucide-react"

const WA_NUMBER = "5492215591366"
const EMAIL     = "aroblessanguina@gmail.com"

function buildWaHref(message?: string) {
  const text = message?.trim() || "Hola Ana! Me gustaría consultar sobre..."
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

function buildMailHref(message?: string) {
  const body = message?.trim() || ""
  return `mailto:${EMAIL}?subject=${encodeURIComponent("Consulta desde anaceciliarobles.com")}&body=${encodeURIComponent(body)}`
}

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/anaroblesartedibujo/",
    label: "Instagram",
    username: "@anaroblesartedibujo",
    color: "from-purple-500 to-pink-500",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

function ContactPageContent() {
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "¿Cómo funciona un encargo personalizado?", acceptedAnswer: { "@type": "Answer", text: "Primero contactame para discutir tu idea, tamaño y presupuesto. Luego te envío un boceto para aprobación antes de comenzar la obra final." } },
              { "@type": "Question", name: "¿Cuáles son los tiempos de entrega?", acceptedAnswer: { "@type": "Answer", text: "Dependen de la complejidad y el tamaño. Generalmente entre 2 y 6 semanas desde la aprobación del diseño." } },
              { "@type": "Question", name: "¿Enviás obras a todo el país?", acceptedAnswer: { "@type": "Answer", text: "Sí, trabajo con servicios de mensajería especializada en obras de arte para garantizar un transporte seguro." } },
              { "@type": "Question", name: "¿Puedo visitar tu taller?", acceptedAnswer: { "@type": "Answer", text: "¡Por supuesto! Coordinemos una visita para que veas mi espacio de trabajo y charlemos sobre tu proyecto." } },
            ],
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-secondary noise-texture pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" fill="none">
            <path d="M0 100L60 87.5C120 75 240 50 360 37.5C480 25 600 25 720 31.25C840 37.5 960 50 1080 56.25C1200 62.5 1320 62.5 1380 62.5L1440 62.5V100H0Z" fill="#FAF6F0" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center lg:py-32 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="mb-8 inline-flex items-center gap-4">
            <span className="h-px w-12 bg-primary/60" />
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Conectemos a través del arte</span>
            <span className="h-px w-12 bg-primary/60" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="font-serif font-light text-secondary-foreground" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.9 }}>
            Contacto
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mx-auto mt-8 max-w-2xl text-xl text-secondary-foreground/65">
            ¿Tenés una consulta, querés encargar una obra o proponerme una colaboración?{" "}
            <span className="font-semibold text-primary">Me encantaría escucharte.</span>
          </motion.p>
        </div>
      </section>

      {/* ── Main contact ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

            {/* WhatsApp message card */}
            <motion.div variants={itemVariants} className="rounded-3xl bg-background p-8 shadow-xl shadow-foreground/5 ring-1 ring-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground">Escribime un mensaje</h3>
                  <p className="text-sm text-muted-foreground">Te respondo por WhatsApp</p>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Contame tu consulta, encargo o idea..."
                className="block w-full resize-none rounded-xl border border-border bg-muted/30 px-5 py-4 text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={buildWaHref(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-green-500 py-4 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-600 hover:shadow-xl"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </motion.a>

                <motion.a
                  href={buildMailHref(message)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-full border border-border bg-background py-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md"
                >
                  <Mail className="h-4 w-4" />
                  Correo electrónico
                </motion.a>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemVariants} className="rounded-3xl bg-background p-8 shadow-xl shadow-foreground/5 ring-1 ring-border">
              <h3 className="font-serif text-xl font-medium text-foreground">Redes sociales</h3>
              <p className="mt-2 text-sm text-muted-foreground">Seguime para ver mi trabajo diario</p>

              <div className="mt-6 space-y-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-muted"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${social.color} text-white shadow-sm`}>
                      <social.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{social.label}</p>
                      <p className="font-medium text-foreground group-hover:text-primary">{social.username}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Encargos CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-[250px] w-[250px] rounded-full bg-accent/20 blur-3xl" />

            <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary">
                  <Heart className="h-4 w-4" />
                  Encargos personalizados
                </div>
                <h2 className="mt-6 font-serif font-light text-primary-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                  ¿Buscás una obra <span className="italic font-bold">única</span>?
                </h2>
                <p className="mt-4 text-primary-foreground/70">
                  Acepto encargos personalizados para retratos, paisajes, arte abstracto y más.
                  Cada pieza es creada especialmente para vos, pensando en tus gustos y el espacio donde será exhibida.
                </p>
                <ul className="mt-6 space-y-3">
                  {["Retratos personalizados", "Paisajes y naturalezas", "Arte abstracto", "Copias de obras existentes"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-primary-foreground/80">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center md:text-right">
                <div className="inline-block rounded-2xl bg-primary-foreground/10 p-8 backdrop-blur-sm">
                  <Palette className="mx-auto h-16 w-16 text-secondary" />
                  <p className="mt-4 font-serif text-xl text-primary-foreground">Comenzá tu obra hoy</p>
                  <p className="mt-2 text-sm text-primary-foreground/60">
                    Consultá disponibilidad y recibirás
                    <br />un presupuesto sin compromiso
                  </p>
                  <motion.a
                    href={buildWaHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Consultar por WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center">
            <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
              <span className="h-px w-8 bg-secondary/60" />
              Preguntas frecuentes
              <span className="h-px w-8 bg-secondary/60" />
            </span>
            <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
              ¿Tenés alguna <span className="italic">duda</span>?
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { q: "¿Cómo funciona un encargo personalizado?", a: "Primero contactame por WhatsApp para discutir tu idea, tamaño y presupuesto. Luego te envío un boceto para aprobación antes de comenzar la obra final." },
              { q: "¿Cuáles son los tiempos de entrega?", a: "Dependen de la complejidad y el tamaño. Generalmente entre 2 y 6 semanas desde la aprobación del diseño." },
              { q: "¿Enviás obras a todo el país?", a: "Sí, trabajo con servicios de mensajería especializada en obras de arte para garantizar un transporte seguro." },
              { q: "¿Puedo visitar tu taller?", a: "¡Por supuesto! Coordinemos una visita por WhatsApp para que veas mi espacio de trabajo y charlemos sobre tu proyecto." },
            ].map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + index * 0.1 }} className="rounded-2xl bg-background p-6 shadow-lg shadow-foreground/5 ring-1 ring-border">
                <h3 className="font-serif text-lg font-medium text-foreground">{faq.q}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function ContactLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-24">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactLoading />}>
      <ContactPageContent />
    </Suspense>
  )
}
