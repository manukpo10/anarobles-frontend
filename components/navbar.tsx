"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre Mí" },
  { href: "/galeria", label: "Galería" },
  { href: "/cursos", label: "Cursos" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { itemCount, toggleCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="relative flex h-20 w-auto items-center transition-all duration-300 hover:opacity-80"
          >
            <Image
              src="/logo_transparente.png"
              alt="Ana Cecilia Robles - Logo"
              width={300}
              height={94}
              className="h-full w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-8 lg:gap-10 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group relative text-sm font-medium uppercase tracking-widest transition-all duration-300",
                    mounted && pathname === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span 
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-400",
                      mounted && pathname === link.href 
                        ? "w-full" 
                        : "w-0 group-hover:w-full"
                    )} 
                  />
                  {mounted && pathname === link.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Cart & User Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated && (
              <Link
                href={user?.role === "admin" ? "/admin" : "/mi-cuenta"}
                className="flex h-10 items-center gap-2 rounded-full bg-secondary/10 px-4 text-sm font-medium text-secondary transition-all hover:bg-secondary/20"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden lg:inline">{user?.role === "admin" ? "Panel" : "Mi cuenta"}</span>
              </Link>
            )}
            <button
              onClick={toggleCart}
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-foreground transition-all duration-300 hover:bg-muted"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary transition-all hover:bg-secondary/20"
                  aria-label="Menú de usuario"
                >
                  <User className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-background p-2 shadow-xl ring-1 ring-border"
                    >
                      <div className="border-b border-border px-4 py-3">
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <span className="mt-1 inline-block rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                          {user?.role === "admin" ? "Administrador" : "Usuario"}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <Link
                          href="/mi-cuenta"
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Mi cuenta
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Panel de administración
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            logout()
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-all hover:bg-primary/90"
                aria-label="Iniciar sesión"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-foreground transition-all duration-300 hover:bg-muted active:scale-95 md:hidden"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center gap-5 pt-20 sm:gap-6 sm:pt-24"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.9 }}
                  transition={{ 
                    delay: 0.15 + index * 0.08, 
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-serif text-3xl transition-all duration-300 sm:text-4xl",
                      mounted && pathname === link.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary hover:scale-105"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile User & Cart */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{ 
                  delay: 0.15 + navLinks.length * 0.08, 
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="flex flex-col items-center gap-6"
              >
                {/* User Section */}
                {isAuthenticated ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 sm:h-14 sm:w-14">
                        <User className="h-6 w-6 text-secondary sm:h-7 sm:w-7" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground sm:text-base">{user?.name}</p>
                    <span className="mt-1 inline-block rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-medium text-secondary sm:text-xs">
                      {user?.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                    <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:gap-3">
                      <Link
                        href="/mi-cuenta"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary sm:text-sm"
                      >
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Mi cuenta
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary sm:text-sm"
                        >
                          <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Panel de administración
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          logout()
                        }}
                        className="flex items-center justify-center gap-2 text-xs text-destructive hover:text-destructive/80 sm:text-sm"
                      >
                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 font-serif text-xl text-primary transition-colors hover:text-primary/80 sm:gap-3 sm:text-2xl"
                  >
                    <User className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span>Iniciar sesión</span>
                  </Link>
                )}

                {/* Cart Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    toggleCart()
                  }}
                  className="relative flex items-center gap-2 font-serif text-xl text-foreground transition-colors hover:text-primary sm:gap-3 sm:text-2xl"
                >
                  <div className="relative">
                    <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8" />
                    {itemCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-secondary-foreground sm:-right-2 sm:-top-2 sm:h-5 sm:w-5 sm:text-[10px]">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </div>
                  <span>Carrito</span>
                </button>
              </motion.div>
            </motion.nav>

            {/* Decorative elements */}
            <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
            
            {/* Artistic brush stroke decoration */}
            <svg className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-4 opacity-20" viewBox="0 0 200 16">
              <path d="M0 8 Q50 4 100 8 T200 8" stroke="#D9622C" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}