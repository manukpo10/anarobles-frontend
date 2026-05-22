"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Instagram, Mail, Phone, ArrowRight } from "lucide-react"

const socialLinks = [
  {
    href: "https://www.instagram.com/anaroblesartedibujo/",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "mailto:contacto@anacecilia.art",
    icon: Mail,
    label: "Email",
  },
  // TODO: reemplazar con número real de Ana
  {
    href: "tel:+541100000000",
    icon: Phone,
    label: "Teléfono",
  },
]

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre Mí" },
  { href: "/galeria", label: "Galería" },
  { href: "/cursos", label: "Cursos" },
  { href: "/blog", label: "Blog" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-secondary">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />

      {/* Artistic brush stroke decoration */}
      <svg className="absolute right-10 top-10 w-32 h-32 opacity-8" viewBox="0 0 100 100">
        <path d="M10 50 Q30 20 50 50 T90 50" stroke="currentColor" strokeWidth="2" fill="none" className="text-secondary-foreground"/>
        <path d="M10 60 Q40 30 60 60 T100 60" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" className="text-secondary-foreground"/>
      </svg>
      <svg className="absolute bottom-10 left-10 w-24 h-24 opacity-10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" className="text-primary"/>
      </svg>
      
      <div className="relative mx-auto max-w-7xl px-6 py-20 pb-24 lg:px-8 lg:py-24 lg:pb-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand with Quote */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
              <div className="relative h-20 w-64 shrink-0">
                <Image
                  src="/logo_transparente.png"
                  alt="Ana Cecilia Robles - Logo"
                  fill
                  className="object-contain object-left brightness-0 invert"
                  priority
                />
              </div>
            </Link>
            <p className="mt-8 max-w-md font-serif text-2xl italic leading-relaxed text-secondary-foreground/75 lg:text-3xl">
              "El arte es el diálogo silencioso entre el alma y el lienzo"
            </p>
            <div className="mt-4 h-px w-12 bg-primary/60" />
            <p className="mt-5 text-base leading-relaxed text-secondary-foreground/60">
              Arte que transforma emociones en colores, y colores en historias
              que perduran.
            </p>
            
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Navegación
            </h3>
            <ul className="mt-6 space-y-4">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-secondary-foreground/70 transition-colors hover:text-primary"
                    >
                      <span className="h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Conecta
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 flex gap-3"
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-foreground/10 text-secondary-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>
            <p className="mt-6 text-sm text-secondary-foreground/70">
              contacto@anacecilia.art
            </p>

            {/* Quick link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                <span>¿Tienes un proyecto?</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-secondary-foreground/20 to-transparent"
        />

        <div className="mt-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-secondary-foreground/50">
            &copy; {new Date().getFullYear()} Ana Cecilia Robles. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary-foreground/40">
            <span>Hecho con</span>
            <span className="text-accent animate-pulse">&#10084;</span>
            <span>y muchos colores</span>
          </div>
        </div>
      </div>
    </footer>
  )
}