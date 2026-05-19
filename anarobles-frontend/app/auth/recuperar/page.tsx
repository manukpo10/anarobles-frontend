"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function RecuperarPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Left side - Info */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5">
          <div className="flex flex-1 flex-col justify-between bg-primary p-12">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/logo_transparente.png"
                  alt="Ana Cecilia Robles"
                  width={200}
                  height={63}
                  className="h-16 w-auto object-contain brightness-0 invert"
                />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h2 className="font-serif text-4xl font-light text-primary-foreground">
                    Recuperá tu acceso
                  </h2>
                  <p className="mt-2 text-lg text-primary-foreground/70">
                    Te enviaremos un enlace para restablecer tu contraseña
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-primary-foreground/80">Verificación segura por email</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-primary-foreground/80">Enlace válido por 24 horas</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-primary-foreground/80">Soporte disponible</p>
                </div>
              </div>
            </motion.div>

            <p className="text-sm text-primary-foreground/50">
              &copy; {new Date().getFullYear()} Ana Cecilia Robles. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-1 items-center justify-center px-6 py-12 lg:w-1/2 xl:w-3/5"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/logo_transparente.png"
                  alt="Ana Cecilia Robles"
                  width={180}
                  height={57}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {!isSubmitted ? (
              <>
                <div className="text-center lg:text-left">
                  <h1 className="font-serif text-4xl font-light text-foreground md:text-5xl">
                    ¿Olvidaste tu <span className="italic">contraseña</span>?
                  </h1>
                  <p className="mt-4 text-muted-foreground">
                    Ingresá tu email y te enviaremos las instrucciones para restablecerla.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-background px-5 py-4 text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar instrucciones
                        <Mail className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-light text-foreground">
                    ¡Email enviado!
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Si el email <span className="font-medium text-foreground">{email}</span> está registrado, 
                    recibirás las instrucciones para restablecer tu contraseña en breve.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Revisá tu carpeta de spam si no ves el email en tu bandeja de entrada.
                </p>
              </motion.div>
            )}

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
