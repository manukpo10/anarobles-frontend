import Link from "next/link"
import Image from "next/image"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-20 bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo watermark */}
        <div className="mb-8 opacity-10">
          <Image
            src="/logo_transparente.png"
            alt=""
            width={200}
            height={64}
            className="object-contain"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="font-serif text-9xl font-light tracking-tight text-primary md:text-[12rem]">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="mb-4 font-serif text-3xl font-light text-foreground md:text-4xl">
          Página no encontrada
        </h2>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          Lo que buscás no existe o fue movido a otro lugar.
          Volvé al inicio para encontrar lo que necesitás.
        </p>

        {/* CTA */}
        <Link href="/">
          <Button
            className="gap-2 rounded-full bg-primary px-8 py-5 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>

      {/* Artistic decoration */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-5"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 Q300,120 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
    </div>
  )
}