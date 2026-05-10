"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, ArrowRight, AlertCircle, Check, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { register } = useAuth()
  const router = useRouter()

  const passwordRequirements = [
    { met: password.length >= 6, label: "Al menos 6 caracteres" },
    { met: /[A-Z]/.test(password), label: "Una letra mayúscula" },
    { met: /[0-9]/.test(password), label: "Un número" },
  ]

  const allRequirementsMet = passwordRequirements.every(req => req.met) && password === confirmPassword && name.length > 0 && email.includes("@")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!allRequirementsMet) {
      setError("Por favor completá todos los campos correctamente")
      return
    }

    setIsLoading(true)

    const result = await register(name, email, password)
    
    setIsLoading(false)
    
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Error al registrar")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Left side - Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 items-center justify-center px-6 py-12 lg:w-1/2"
        >
          <motion.div variants={itemVariants} className="w-full max-w-md space-y-8">
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

            <div className="text-center lg:text-left">
              <h1 className="font-serif text-4xl font-light text-foreground md:text-5xl">
                Crear <span className="italic">cuenta</span>
              </h1>
              <p className="mt-4 text-muted-foreground">
                Unite a la comunidad de artistas y empezá a aprender
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-5 py-4 text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu nombre"
                />
              </div>

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

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background px-5 py-4 pr-12 text-foreground transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password requirements */}
                {password && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={`flex h-4 w-4 items-center justify-center rounded-full ${req.met ? "bg-green-500" : "bg-muted"}`}>
                          {req.met ? (
                            <Check className="h-2.5 w-2.5 text-white" />
                          ) : (
                            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full rounded-xl border bg-background px-5 py-4 text-foreground transition-all placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="••••••••"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !allRequirementsMet}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-muted-foreground">
                Al crear una cuenta aceptás nuestros{" "}
                <Link href="/terminos" className="text-primary hover:underline">
                  Términos y Condiciones
                </Link>{" "}
                y{" "}
                <Link href="/privacidad" className="text-primary hover:underline">
                  Política de Privacidad
                </Link>
              </p>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Right side - Branding */}
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
                <Sparkles className="h-12 w-12 text-secondary" />
                <div>
                  <h2 className="font-serif text-4xl font-light text-primary-foreground">
                    Tu viaje artístico comienza aquí
                  </h2>
                  <p className="mt-2 text-lg text-primary-foreground/70">
                    Aprendé técnicas profesionales a tu propio ritmo
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  "Acceso ilimitado a cursos en video",
                  "Comunidad privada de artistas",
                  "Feedback personalizado del instructor",
                  "Certificados de finalización"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
                      <Check className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-primary-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <p className="text-sm text-primary-foreground/50">
              &copy; {new Date().getFullYear()} Ana Cecilia Robles. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}