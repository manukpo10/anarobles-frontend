"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"

const sections = [
  {
    title: "1. Aceptación de los términos",
    content: "Al acceder y utilizar el sitio web de Ana Cecilia Robles (en adelante, 'el Sitio'), aceptás cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, por favor no utilices el Sitio."
  },
  {
    title: "2. Uso del sitio",
    content: "El Sitio proporciona información sobre cursos de arte, venta de obras y productos relacionados. El uso del Sitio es únicamente para fines personales y no comerciales. No podés utilizar el Sitio para fines ilegales o no autorizados."
  },
  {
    title: "3. Propiedad intelectual",
    content: "Todo el contenido del Sitio, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes, videos y software, es propiedad de Ana Cecilia Robles o sus proveedores de contenido y está protegido por las leyes de propiedad intelectual. No podés reproducir, distribuir, modificar o crear obras derivadas sin autorización expresa."
  },
  {
    title: "4. Compras y pagos",
    content: "Al realizar una compra a través del Sitio, garantizás que la información proporcionada es veraz y completa. Los precios están expresados en pesos argentinos (ARS) y pueden cambiar sin previo aviso. Los pagos son procesados de forma segura a través de Mercado Pago."
  },
  {
    title: "5. Envíos y devoluciones",
    content: "Los tiempos de envío son estimativos y pueden variar según la ubicación. Para productos físicos, aceptamos devoluciones dentro de los 30 días posteriores a la recepción si el producto está en su estado original. Las obras de arte originales no admiten devolución salvo defectos de fabricación."
  },
  {
    title: "6. Cursos y capacitación",
    content: "La inscripción a cursos otorga acceso al contenido digital por el período especificado. No está permitido compartir las credenciales de acceso o el contenido del curso con terceros. El incumplimiento resultará en la cancelación de la cuenta sin derecho a reembolso."
  },
  {
    title: "7. Limitación de responsabilidad",
    content: "Ana Cecilia Robles no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso o la imposibilidad de usar el Sitio. En ningún caso la responsabilidad total excederá el monto pagado por el usuario por los productos o servicios adquiridos."
  },
  {
    title: "8. Modificaciones",
    content: "Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor desde su publicación en el Sitio. Es tu responsabilidad revisar periódicamente los términos actualizados."
  },
  {
    title: "9. Ley aplicable",
    content: "Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales de la Ciudad Autónoma de Buenos Aires."
  },
]

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-3">
              <FileText className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="font-serif text-5xl font-light text-primary-foreground md:text-6xl lg:text-7xl">
              Términos y <span className="font-semibold">Condiciones</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Información importante sobre el uso de nuestros servicios y la relación con nuestros clientes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div className="rounded-3xl bg-background p-8 lg:p-12 shadow-xl ring-1 ring-border">
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`pb-8 ${index < sections.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-muted-foreground mb-6">
                ¿Tenés preguntas sobre estos términos?
              </p>
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Contactanos
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <p className="mt-12 text-center text-sm text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
