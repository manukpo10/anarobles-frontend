"use client"

import { motion } from "framer-motion"
import { ObraCard } from "./obra-card"
import type { Obra } from "@/lib/obras"

interface GaleriaGridRetratosProps {
  obras: Obra[]
  onObraClick: (obra: Obra) => void
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

/**
 * Curated asymmetric grid — always 3-column base, 2 rows.
 *
 * With 5 obras (current):
 *   Row 1: [A — col-span-2, 4/3] [B — col-span-1, 3/4]
 *   Row 2: [C — col-span-1, 3/4] [D — col-span-2, 4/3]
 *   Leftover [E] → full-width banner row
 *
 * Degrades gracefully with fewer obras (shows what's available).
 * Avoids orphan cells by making the last single obra full-width.
 */
export function GaleriaGridRetratos({ obras, onObraClick }: GaleriaGridRetratosProps) {
  if (obras.length === 0) return null

  // Pull destacadas first, then fill with the rest in order
  const ordered = [
    ...obras.filter((o) => o.destacada),
    ...obras.filter((o) => !o.destacada),
  ]

  const [a, b, c, d, ...rest] = ordered

  return (
    <div className="space-y-3">

      {/* ── Row 1: large left + small right ── */}
      {a && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <motion.div className="md:col-span-2" {...fadeUp(0)}>
            <ObraCard obra={a} onClick={onObraClick} aspectRatio="4/3" className="h-full rounded-xl" priority />
          </motion.div>

          {b && (
            <motion.div {...fadeUp(0.08)}>
              <ObraCard obra={b} onClick={onObraClick} aspectRatio="3/4" className="h-full rounded-xl" />
            </motion.div>
          )}
        </div>
      )}

      {/* ── Row 2: small left + large right ── */}
      {(c || d) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {c && (
            <motion.div {...fadeUp(0)}>
              <ObraCard obra={c} onClick={onObraClick} aspectRatio="3/4" className="h-full rounded-xl" />
            </motion.div>
          )}

          {d && (
            <motion.div className="md:col-span-2" {...fadeUp(0.08)}>
              <ObraCard obra={d} onClick={onObraClick} aspectRatio="4/3" className="h-full rounded-xl" />
            </motion.div>
          )}
        </div>
      )}

      {/* ── Leftover — full-width each, or 2-col pairs ── */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((obra, i) => (
            <motion.div key={obra.id} {...fadeUp(i * 0.07)}>
              <ObraCard obra={obra} onClick={onObraClick} aspectRatio="4/5" className="rounded-xl" />
            </motion.div>
          ))}
        </div>
      )}

    </div>
  )
}
