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

const baseUrl = "https://anaceciliarobles.com"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ana Cecilia Robles | Artista Plástica",
    template: "%s | Ana Cecilia Robles",
  },
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
  creator: "Ana Cecilia Robles",
  publisher: "Ana Cecilia Robles",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: baseUrl,
    siteName: "Ana Cecilia Robles",
    title: "Ana Cecilia Robles | Artista Plástica",
    description:
      "Explora el universo artístico de Ana Cecilia Robles. Pinturas, ilustraciones y obras digitales que capturan la esencia de la creatividad contemporánea.",
    images: [
      {
        url: `${baseUrl}/logo_transparente.png`,
        width: 1200,
        height: 630,
        alt: "Ana Cecilia Robles - Artista Plástica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ana Cecilia Robles | Artista Plástica",
    description:
      "Explora el universo artístico de Ana Cecilia Robles. Pinturas, ilustraciones y obras digitales.",
    images: [`${baseUrl}/logo_transparente.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
      <head>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ana Cecilia Robles",
              url: baseUrl,
              logo: `${baseUrl}/logo_transparente.png`,
              sameAs: [
                "https://www.instagram.com/anaroblesartedibujo/",
                "https://www.facebook.com/anaroblesartedibujo/",
              ],
            }),
          }}
        />
        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Ana Cecilia Robles",
              description:
                "Artista plástica especializada en pinturas, ilustraciones y obras digitales.",
              url: baseUrl,
              image: `${baseUrl}/logo_transparente.png`,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Buenos Aires",
                addressCountry: "AR",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "contacto@anacecilia.art",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <AuthProvider>
            <CheckoutProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
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
