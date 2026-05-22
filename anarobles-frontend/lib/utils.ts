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
