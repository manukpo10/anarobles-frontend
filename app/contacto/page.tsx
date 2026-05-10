"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Mail, Phone, MapPin, Send, Check, Palette, MessageCircle, Clock, Heart, Facebook, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const consultationTypes = [
  { value: "", label: "Seleccioná el tipo de consulta" },
  { value: "compra", label: "Compra de obra o print" },
  { value: "encargo", label: "Encargo personalizado" },
  { value: "cursos", label: "Consultas sobre cursos" },
  { value: "colaboracion", label: "Propuesta de colaboración" },
  { value: "otro", label: "Otro" },
]

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/anacecilia.art", label: "Instagram", username: "@anacecilia.art" },
  { icon: Facebook, href: "https://facebook.com/anacecilia.art", label: "Facebook", username: "Ana Cecilia Robles" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
}

function ContactPageContent() {
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    consultationType: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const tipo = searchParams.get("tipo")
    const asunto = searchParams.get("asunto")
    
    if (tipo) {
      const tipoMap: Record<string, string> = {
        "inscripcion": "cursos",
        "compra": "compra",
        "encargo": "encargo",
        "colaboracion": "colaboracion"
      }
      setFormData(prev => ({
        ...prev,
        consultationType: tipoMap[tipo] || tipo,
        subject: asunto || ""
      }))
    } else if (asunto) {
      setFormData(prev => ({
        ...prev,
        subject: asunto
      }))
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresá un email válido"
    }

    if (!formData.consultationType) {
      newErrors.consultationType = "Seleccioná el tipo de consulta"
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio"
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "El mensaje debe tener al menos 20 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", consultationType: "", message: "" })
    setErrors({})

    setTimeout(() => setIsSubmitted(false), 6000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary pt-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H0Z" className="fill-background" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-secondary">
                Conectemos a través del arte
              </span>
              <Sparkles className="h-5 w-5 text-secondary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-5xl font-light text-primary-foreground md:text-6xl lg:text-7xl"
            >
              Contacto
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70"
            >
              ¿Tenés una consulta, querés encargar una obra o proponerme una colaboración? 
              <br className="hidden md:block" />
              <span className="text-secondary">Me encantaría escucharte.</span>
            </motion.p>

            {/* Quick contact badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {["Consultas", "Compras", "Encargos", "Colaboraciones"].map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-5 py-2 text-sm font-medium text-primary-foreground/80 backdrop-blur-sm"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-16 lg:grid-cols-5"
          >
            {/* Form */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="rounded-3xl bg-background p-8 shadow-xl shadow-foreground/5 ring-1 ring-border lg:p-10">
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
                    <span className="h-px w-8 bg-secondary/60" />
                    Formulario de contacto
                  </span>
                  <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
                    Escribime un <span className="italic">mensaje</span>
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Completá el formulario y te responderé dentro de las 24-48 horas hábiles.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={cn(
                          "w-full rounded-xl border bg-card px-5 py-4 text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/20",
                          errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-secondary"
                        )}
                        placeholder="Tu nombre"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(
                          "w-full rounded-xl border bg-card px-5 py-4 text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/20",
                          errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-secondary"
                        )}
                        placeholder="tu@email.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div className="space-y-2">
                    <label htmlFor="consultationType" className="text-sm font-medium text-foreground">
                      Tipo de consulta
                    </label>
                    <select
                      id="consultationType"
                      name="consultationType"
                      value={formData.consultationType}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-xl border bg-card px-5 py-4 text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer",
                        errors.consultationType ? "border-destructive focus:border-destructive" : "border-border focus:border-secondary"
                      )}
                    >
                      {consultationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.consultationType && (
                      <p className="text-xs text-destructive">{errors.consultationType}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Asunto <span className="text-muted-foreground">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border bg-card px-5 py-4 text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      placeholder="Sobre qué querés hablar..."
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={cn(
                        "block min-h-[160px] w-full resize-none rounded-xl border bg-card px-5 py-4 text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/20",
                        errors.message ? "border-destructive focus:border-destructive" : "border-border focus:border-secondary"
                      )}
                      placeholder="Contame sobre tu proyecto, consulta o idea..."
                    />
                    <div className="flex items-center justify-between">
                      {errors.message ? (
                        <p className="text-xs text-destructive">{errors.message}</p>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Mínimo 20 caracteres
                        </span>
                      )}
                      <span className={cn(
                        "text-xs",
                        formData.message.length < 20 ? "text-muted-foreground" : "text-green-600"
                      )}>
                        {formData.message.length} caracteres
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-secondary py-5 text-sm font-semibold uppercase tracking-wider text-secondary-foreground shadow-lg shadow-secondary/30 transition-all duration-300 hover:bg-accent hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Enviando mensaje...
                      </>
                    ) : (
                      <>
                        <span>Enviar mensaje</span>
                        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>

                  {/* Success Message */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="flex items-center gap-4 rounded-2xl bg-green-50 p-6 ring-1 ring-green-200"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">
                            ¡Mensaje enviado correctamente!
                          </p>
                          <p className="mt-1 text-sm text-green-600">
                            Te responderé dentro de las 24-48 horas hábiles.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>

            {/* Sidebar Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              {/* Direct Contact */}
              <div className="rounded-3xl bg-background p-8 shadow-xl shadow-foreground/5 ring-1 ring-border">
                <h3 className="font-serif text-xl font-medium text-foreground">
                  Contacto directo
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  También podés escribirme directamente
                </p>

                <div className="mt-6 space-y-4">
                  <a
                    href="mailto:contacto@anacecilia.art"
                    className="group flex items-center gap-4 rounded-xl bg-muted/50 p-4 transition-all duration-300 hover:bg-secondary/10"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Email
                      </p>
                      <p className="font-medium text-foreground group-hover:text-secondary">
                        contacto@anacecilia.art
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+5491161234567"
                    className="group flex items-center gap-4 rounded-xl bg-muted/50 p-4 transition-all duration-300 hover:bg-secondary/10"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        WhatsApp
                      </p>
                      <p className="font-medium text-foreground group-hover:text-secondary">
                        +54 9 11 6123-4567
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Ubicación
                      </p>
                      <p className="font-medium text-foreground">
                        Buenos Aires, Argentina
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="rounded-3xl bg-gradient-to-br from-secondary/10 to-accent/10 p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    Tiempo de respuesta
                  </h3>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Generalmente respondo dentro de las <span className="font-medium text-foreground">24-48 horas hábiles</span>. 
                  Para encargos personalizados, los tiempos pueden variar según la complejidad del proyecto.
                </p>
              </div>

              {/* Social Media */}
              <div className="rounded-3xl bg-background p-8 shadow-xl shadow-foreground/5 ring-1 ring-border">
                <h3 className="font-serif text-xl font-medium text-foreground">
                  Redes sociales
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Seguime para ver mi trabajo diario
                </p>

                <div className="mt-6 space-y-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-muted"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <social.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {social.label}
                        </p>
                        <p className="font-medium text-foreground group-hover:text-primary">
                          {social.username}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <motion.a
                href="https://wa.me/5491161234567?text=Hola%20Ana!%20Me%20gustaría%20consultar%20sobre..."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-4 rounded-full bg-green-500 py-5 px-8 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:bg-green-600 hover:shadow-xl"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Escríbi por WhatsApp</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Custom Work CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16"
          >
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-[250px] w-[250px] rounded-full bg-accent/20 blur-3xl" />

            <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary">
                  <Heart className="h-4 w-4" />
                  Encargos personalizados
                </div>
                <h2 className="mt-6 font-serif text-3xl font-light text-primary-foreground md:text-4xl">
                  ¿Buscás una obra <span className="italic">única</span>?
                </h2>
                <p className="mt-4 text-primary-foreground/70">
                  Acepto encargos personalizados para retratos, paisajes, arte abstracto 
                  y más. Cada pieza es creada especialmente para vos, pensando en tus 
                  gustos y el espacio donde será exhibida.
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
                  <p className="mt-4 font-serif text-xl text-primary-foreground">
                    Comenzá tu obra hoy
                  </p>
                  <p className="mt-2 text-sm text-primary-foreground/60">
                    Consultá disponibilidad y recibirás 
                    <br />un presupuesto sin compromiso
                  </p>
                  <motion.a
                    href="mailto:contacto@anacecilia.art?subject=Consulta%20de%20encargo%20personalizado"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-sm font-semibold text-secondary-foreground shadow-lg transition-all hover:bg-accent hover:shadow-xl"
                  >
                    <span>Solicitar presupuesto</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
              <span className="h-px w-8 bg-secondary/60" />
              Preguntas frecuentes
              <span className="h-px w-8 bg-secondary/60" />
            </span>
            <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
              ¿Tenés alguna <span className="italic">duda</span>?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 grid gap-6 md:grid-cols-2"
          >
            {[
              { q: "¿Cómo funciona un encargo personalizado?", a: "Primero contactame para discutir tu idea, tamaño y presupuesto. Luego te envío un boceto para aprobación antes de comenzar la obra final." },
              { q: "¿Cuáles son los tiempos de entrega?", a: "Dependen de la complejidad y el tamaño. Generalmente entre 2 y 6 semanas desde la aprobación del diseño." },
              { q: "¿Enviás obras a todo el país?", a: "Sí, trabajo con servicios de mensajería especializada en obras de arte para garantizar un transporte seguro." },
              { q: "¿Puedo visitar tu taller?", a: "¡Por supuesto! Coordinemos una visita para que veas mi espacio de trabajo y charlemos sobre tu proyecto." },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="rounded-2xl bg-background p-6 shadow-lg shadow-foreground/5 ring-1 ring-border"
              >
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {faq.q}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {faq.a}
                </p>
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
    <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
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