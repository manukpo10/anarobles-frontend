"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Quote, Calendar, Award, Palette, Sparkles } from "lucide-react"

const timeline = [
  {
    year: "2015",
    title: "Primeros pasos",
    description:
      "Inicio de estudios formales en Bellas Artes, descubriendo la pasión por la pintura al óleo.",
    icon: Palette,
  },
  {
    year: "2018",
    title: "Primera exposición",
    description:
      "Exposición individual en la Galería Contemporánea de Madrid, presentando la serie 'Fragmentos del Alma'.",
    icon: Award,
  },
  {
    year: "2020",
    title: "Expansión digital",
    description:
      "Exploración del arte digital y técnicas mixtas, fusionando lo tradicional con lo contemporáneo.",
    icon: Sparkles,
  },
  {
    year: "2022",
    title: "Reconocimiento internacional",
    description:
      "Participación en ferias de arte en Barcelona, París y Miami. Premio Artista Emergente.",
    icon: Award,
  },
  {
    year: "2024",
    title: "Presente",
    description:
      "Continúa creando desde su estudio, combinando pintura, ilustración y arte digital.",
    icon: Palette,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Hero Section */}
      <section className="bg-primary py-24 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-primary/30">
                <Image
                  src="/artista1.jpeg"
                  alt="Ana Cecilia Robles - Artista Plástica"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>
              
              {/* Decorative frame effect */}
              <div className="absolute -bottom-6 -right-6 h-full w-full rounded-3xl border-2 border-secondary/30 -z-10" />
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-4 -right-4 rounded-2xl bg-card p-6 shadow-2xl"
              >
                <p className="font-serif text-4xl font-bold text-secondary">10+</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">años creando</p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-secondary">
                <span className="h-px w-10 bg-secondary/60" />
                La Artista
              </span>
              <h1 className="mt-8 font-serif text-6xl font-light tracking-tight text-primary-foreground md:text-7xl lg:text-8xl">
                Ana Cecilia <span className="font-semibold">Robles</span>
              </h1>
               <p className="mt-10 text-xl leading-relaxed text-primary-foreground/80">
                 Dibujo, pinto y trabajo con materiales.
               </p>
               <p className="mt-6 text-xl leading-relaxed text-primary-foreground/80">
                 Soy artista visual, enfocada en la acuarela y la exploración de la mancha, el color y lo que surge en el proceso.
               </p>
               <p className="mt-6 text-xl leading-relaxed text-primary-foreground/80">
                 También investigo lo textil: hilos, bordados y cruces entre imagen y materia.
               </p>
               <p className="mt-6 text-xl leading-relaxed text-primary-foreground/80">
                 Mi trabajo se nutre de lo floral, la naturaleza y el entorno.
               </p>
               <p className="mt-6 text-xl leading-relaxed text-primary-foreground/80">
                 En dibujo, el retrato aparece como una forma de búsqueda: entender algo del interior de las personas más allá de lo visible.
               </p>
               <p className="mt-6 text-xl leading-relaxed text-primary-foreground/80">
                 Además, doy clases y acompaño procesos creativos.
               </p>
               <p className="mt-6 text-xl leading-relaxed text-primary-foreground/80 font-semibold">
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
                  className="group inline-flex items-center gap-4 rounded-full bg-secondary px-10 py-5 text-sm font-semibold uppercase tracking-wider text-secondary-foreground shadow-xl shadow-secondary/30 transition-all duration-400 hover:bg-accent hover:shadow-2xl"
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
      <section className="relative py-28 lg:py-40">
        {/* Background decoration */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl" />
        
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Quote className="mx-auto h-20 w-20 text-secondary/20" />
            <p className="mt-12 font-serif text-4xl font-light leading-relaxed tracking-tight text-foreground md:text-5xl lg:text-5xl">
              El arte no es lo que ves, sino lo que haces ver a los demás. Mi
              misión es transformar emociones invisibles en colores que cuentan
              historias.
            </p>
            <footer className="mt-12 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-12 bg-muted-foreground/30" />
              Ana Cecilia Robles
            </footer>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-muted/40 py-28 lg:py-40">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 text-center"
          >
            <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-secondary">
              <span className="h-px w-12 bg-secondary/60" />
              Recorrido
              <span className="h-px w-12 bg-secondary/60" />
            </span>
            <h2 className="mt-8 font-serif text-6xl font-light tracking-tight text-foreground md:text-7xl">
              Trayectoria <span className="font-semibold">Artística</span>
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
                  <span className="font-serif text-4xl font-bold text-secondary/60">
                    {item.year}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
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
              <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-secondary">
                <span className="h-px w-10 bg-secondary/60" />
                Proceso Creativo
              </span>
              <h2 className="mt-8 font-serif text-5xl font-light tracking-tight text-foreground md:text-6xl">
                Fuentes de <span className="font-semibold">Inspiración</span>
              </h2>
              <p className="mt-10 leading-relaxed text-muted-foreground">
                Mi inspiración surge de los momentos cotidianos que a menudo
                pasan desapercibidos: la luz del amanecer filtrándose por una
                ventana, las conversaciones silenciosas entre desconocidos, el
                ritmo de las ciudades y la calma de la naturaleza.
              </p>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Creo en el arte como un puente entre lo visible y lo invisible,
                entre lo que sentimos y lo que podemos expresar. Cada pincelada
                es una palabra en un idioma universal que trasciende fronteras y
                conecta almas.
              </p>
              
              <div className="mt-12">
                <Link
                  href="/productos"
                  className="group inline-flex items-center gap-4 rounded-full border-2 border-foreground/20 px-10 py-5 text-sm font-medium uppercase tracking-wider text-foreground transition-all duration-400 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-lg"
                >
                  Explorar obras
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
                  src="/artwork-1.jpg"
                  alt="Obra de Ana Cecilia Robles"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative mt-12 aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/artwork-2.jpg"
                  alt="Obra de Ana Cecilia Robles"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/artwork-5.jpg"
                  alt="Obra de Ana Cecilia Robles"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative mt-12 aspect-square overflow-hidden rounded-2xl shadow-xl"
              >
                <Image
                  src="/artwork-6.jpg"
                  alt="Obra de Ana Cecilia Robles"
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