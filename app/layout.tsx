import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { CheckoutProvider } from "@/contexts/checkout-context"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Ana Cecilia Robles | Artista Plástica",
  description:
    "Explora el universo artístico de Ana Cecilia Robles. Pinturas, ilustraciones y obras digitales que capturan la esencia de la creatividad contemporánea.",
  generator: "v0.app",
  keywords: [
    "arte",
    "pintura",
    "ilustración",
    "artista",
    "galería",
    "arte contemporáneo",
  ],
  authors: [{ name: "Ana Cecilia Robles" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/logo_transparente.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#194052",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <CartProvider>
          <AuthProvider>
            <CheckoutProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
              <Toaster />
              {process.env.NODE_ENV === "production" && <Analytics />}
            </CheckoutProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}
