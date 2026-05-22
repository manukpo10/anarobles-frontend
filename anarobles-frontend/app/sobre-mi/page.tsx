"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Palette, Sparkles, PenLine } from "lucide-react"

const timeline = [
  {
    year: "2010",
    title: "Los inicios",
    description:
      "Primeros pasos en el dibujo y la acuarela, explorando el color y la mancha como lenguaje propio.",
    icon: Palette,
  },
  {
    year: "2015",
    title: "La acuarela como centro",
    description:
      "La acuarela se convierte en la técnica principal. Inicio de una investigación sostenida sobre lo floral y la naturaleza.",
    icon: PenLine,
  },
  {
    year: "2018",
    title: "Retratos y búsqueda interior",
    description:
      "El retrato aparece como práctica constante: una forma de entender algo del interior de las personas más allá de lo visible.",
    icon: Sparkles,
  },
  {
    year: "2021",
    title: "Lo textil entra en escena",
    description:
      "Exploración de lo textil: hilos, bordados y el cruce entre imagen y materia. Una nueva dimensión en el trabajo.",
    icon: PenLine,
  },
  {
    year: "2024",
    title: "Presente",
    description:
      "Creando, investigando y acompañando procesos creativos. Este sitio es un registro de ese recorrido.",
    icon: Palette,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="bg-secondary noise-texture py-24 lg:py-40 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl shadow-secondary/50" style={{ borderRadius: 0 }}>
                <Image
                  src="/artista1.jpeg"
                  alt="Ana Cecilia Robles - Artista Plástica"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent" />
              </div>

              {/* Orange L-bracket accent */}
              <div
                className="absolute -bottom-3 -right-3 hidden lg:block"
                aria-hidden="true"
                style={{
                  width: "35%",
                  height: "40%",
                  borderBottom: "3px solid oklch(0.718 0.176 41)",
                  borderRight: "3px solid oklch(0.718 0.176 41)",
                }}
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-4 -left-4 bg-primary p-6 shadow-2xl"
              >
                <p className="font-serif text-4xl font-bold text-primary-foreground">10+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/70">años creando</p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">
                <span className="h-px w-10 bg-primary/60" />
                La Artista
              </span>
              <h1 className="mt-8 font-serif font-light tracking-tight text-secondary-foreground" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.9 }}>
                Ana Cecilia
                <span className="block font-bold"> Robles</span>
              </h1>
               <div className="mt-8 h-0.5 w-12 bg-primary" />
               <p className="mt-8 font-serif text-2xl italic leading-snug text-secondary-foreground/90 lg:text-3xl">
                 Dibujo, pinto y trabajo con materiales.
               </p>
               <p className="mt-8 text-lg leading-relaxed text-secondary-foreground/70">
                 Soy artista visual, enfocada en la acuarela y la exploración de la mancha, el color y lo que surge en el proceso. También investigo lo textil: hilos, bordados y cruces entre imagen y materia.
               </p>
               <p className="mt-5 text-lg leading-relaxed text-secondary-foreground/70">
                 Mi trabajo se nutre de lo floral, la naturaleza y el entorno. En dibujo, el retrato aparece como una forma de búsqueda: entender algo del interior de las personas más allá de lo visible.
               </p>
               <p className="mt-5 text-lg leading-relaxed text-secondary-foreground/70">
                 Doy clases y acompaño procesos creativos.
               </p>
               <p className="mt-8 font-serif text-lg font-semibold text-primary">
                 Este sitio es un registro de ese recorrido.
               </p>
              
              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-12"
              >
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-4 rounded-full bg-primary px-10 py-5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-accent hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <span>Contactar</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-28 lg:py-40 bg-background overflow-hidden">
        {/* Large background quote mark */}
        <span
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 font-serif font-bold text-secondary/5 select-none leading-none"
          style={{ fontSize: "30rem", lineHeight: 1 }}
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto h-0.5 w-16 bg-primary mb-12" />
            <p className="font-serif font-light leading-tight tracking-tight text-foreground" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
              El arte no es lo que ves, sino lo que haces ver a los demás. Mi
              misión es transformar emociones invisibles en colores que cuentan
              historias.
            </p>
            <footer className="mt-12 inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-12 bg-primary/40" />
              Ana Cecilia Robles
              <span className="h-px w-12 bg-primary/40" />
            </footer>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-muted/20 py-28 lg:py-40">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 text-center"
          >
            <span className="kicker">Recorrido</span>
            <h2 className="mt-8 font-serif font-light tracking-tight text-foreground" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
              Trayectoria <span className="font-bold">Artística</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 hidden h-full w-px bg-border lg:left-1/2 lg:block lg:-translate-x-1/2" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative mb-16 last:mb-0 lg:flex ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Year Marker */}
                <div className="absolute left-8 top-0 hidden h-5 w-5 -translate-x-1/2 rounded-full border-2 border-secondary bg-background lg:left-1/2 lg:block" />

                {/* Content */}
                <div className={`pl-24 lg:w-1/2 lg:px-12 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 shadow-lg">
                    <item.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="font-serif text-5xl font-bold text-primary/50">
                    {item.year}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-28 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-20 lg:grid-cols-2 lg:gap-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="kicker">El trabajo</span>
              <h2 className="mt-8 font-serif font-light tracking-tight text-foreground" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
                Lo floral, lo humano,<span className="font-bold"> lo textil</span>
              </h2>
              <p className="mt-10 text-lg leading-relaxed text-muted-foreground">
                El trabajo parte de la observación: una flor, una planta, la luz
                sobre una superficie. Lo floral y la naturaleza aparecen como
                punto de entrada al color y a la mancha.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                El retrato es otra búsqueda — más interior. Y lo textil, otra
                dimensión: el hilo como trazo, el bordado como imagen.
              </p>

              <div className="mt-12">
                <Link
                  href="/galeria"
                  className="group inline-flex items-center gap-4 rounded-full border-2 border-foreground/20 px-10 py-5 text-sm font-medium uppercase tracking-wider text-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg"
                >
                  Ver la galería
                  <ArrowRight className="h-5 w-5 transition-transform duration-400 group-hover:translate-x-2" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/galeria/flor-de-jacaranda.jpeg"
                  alt="Flor de Jacaranda — acuarela"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative mt-12 aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/galeria/retrato-1.jpeg"
                  alt="Retrato — dibujo en grafito"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/galeria/acuarela-bordada-floral.jpeg"
                  alt="Acuarela bordada floral — técnica mixta"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative mt-12 aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/galeria/lavandas.jpg"
                  alt="Lavandas — acuarela"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}