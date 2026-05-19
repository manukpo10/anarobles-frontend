"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Shield, Lock } from "lucide-react"

const sections = [
  {
    title: "1. Información que recopilamos",
    content: "Recopilamos información personal que vos nos proporcionás voluntariamente al registrarte, realizar compras o contactarnos. Esto puede incluir: nombre, dirección de email, dirección postal, número de teléfono e información de pago. También recopilamos información sobre tu uso del sitio a través de cookies."
  },
  {
    title: "2. Uso de la información",
    content: "Utilizamos tu información para: procesar tus pedidos y pagos, comunicarnos con vos sobre tu cuenta o pedidos, enviarte actualizaciones sobre cursos y productos (si has dado tu consentimiento), mejorar nuestros servicios y personalizar tu experiencia en el sitio."
  },
  {
    title: "3. Compartir información",
    content: "No vendemos ni alquilamos tu información personal a terceros. Podemos compartir información con proveedores de servicios que nos ayudan a operar el sitio (como procesadores de pago y servicios de envío), siempre bajo estrictos acuerdos de confidencialidad."
  },
  {
    title: "4. Seguridad de datos",
    content: "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos encriptación SSL para proteger la transmisión de datos sensibles."
  },
  {
    title: "5. Cookies",
    content: "Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar contenido. Podés controlar el uso de cookies a través de la configuración de tu navegador. Tené en cuenta que deshabilitar las cookies puede afectar la funcionalidad del sitio."
  },
  {
    title: "6. Tus derechos",
    content: "Bajo la legislación argentina (Ley 25.326 de Protección de los Datos Personales), tenés derecho a: acceder a tus datos personales, rectificar información inexacta, solicitar la supresión de tus datos y revocar tu consentimiento para el uso de datos en cualquier momento."
  },
  {
    title: "7. Retención de datos",
    content: "Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley exija o permita un período de retención más largo."
  },
  {
    title: "8. Menores de edad",
    content: "Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos intencionalmente información personal de menores. Si descubrimos que hemos recopilado información de un menor, eliminaremos esa información de inmediato."
  },
  {
    title: "9. Cambios en esta política",
    content: "Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cualquier cambio publicando la nueva política en el sitio. Te recomendamos revisar esta página periódicamente."
  },
]

export default function PrivacidadPage() {
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
              <Shield className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="font-serif text-5xl font-light text-primary-foreground md:text-6xl lg:text-7xl">
              Política de <span className="font-semibold">Privacidad</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Cómo protegemos y gestionamos tu información personal.
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
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Esta política cumple con la Ley 25.326 de Protección de los Datos Personales de Argentina.
                </p>
              </div>

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
                ¿Tenés preguntas sobre tu privacidad?
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
