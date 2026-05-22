import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Deterministic es-AR price formatter (server and client produce identical output).
// Avoids hydration mismatches caused by Intl/ICU differences between Node and the browser.
export function formatPrice(value: number): string {
  const rounded = Math.round(value)
  const negative = rounded < 0 ? "-" : ""
  const digits = Math.abs(rounded).toString()
  return negative + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const MESES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

// Deterministic Spanish long date formatter ("15 de marzo de 2026").
// Avoids hydration mismatches from Intl.DateTimeFormat / toLocaleDateString.
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input
  if (isNaN(d.getTime())) return ""
  const day = d.getUTCDate()
  const month = MESES_ES[d.getUTCMonth()]
  const year = d.getUTCFullYear()
  return `${day} de ${month} de ${year}`
}
