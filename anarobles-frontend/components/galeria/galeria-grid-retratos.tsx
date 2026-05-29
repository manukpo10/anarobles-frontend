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
 * Asymmetric grid — alternates wide-left/narrow-right and narrow-left/wide-right
 * across ALL rows. Destacadas appear first.
 *
 * Even rows: [wide col-span-2 4/3] [narrow col-span-1 3/4]
 * Odd  rows: [narrow col-span-1 3/4] [wide col-span-2 4/3]
 * Leftover (single item): full-width banner
 */
export function GaleriaGridRetratos({ obras, onObraClick }: GaleriaGridRetratosProps) {
  if (obras.length === 0) return null

  const ordered = [
    ...obras.filter((o) => o.destacada),
    ...obras.filter((o) => !o.destacada),
  ]

  // Chunk into pairs
  const rows: Obra[][] = []
  for (let i = 0; i < ordered.length; i += 2) {
    rows.push(ordered.slice(i, i + 2))
  }

  return (
    <div className="space-y-3">
      {rows.map((pair, rowIndex) => {
        const [first, second] = pair
        const isEven = rowIndex % 2 === 0

        // Single leftover → full-width banner
        if (!second) {
          return (
            <motion.div key={first.id} {...fadeUp(0)}>
              <ObraCard obra={first} onClick={onObraClick} aspectRatio="16/7" className="rounded-xl" priority={rowIndex === 0} />
            </motion.div>
          )
        }

        const wide  = isEven ? first : second
        const narrow = isEven ? second : first

        return (
          <div key={first.id} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {isEven ? (
              <>
                <motion.div className="md:col-span-2" {...fadeUp(0)}>
                  <ObraCard obra={wide} onClick={onObraClick} aspectRatio="4/3" className="h-full rounded-xl" priority={rowIndex === 0} />
                </motion.div>
                <motion.div {...fadeUp(0.08)}>
                  <ObraCard obra={narrow} onClick={onObraClick} aspectRatio="3/4" className="h-full rounded-xl" />
                </motion.div>
              </>
            ) : (
              <>
                <motion.div {...fadeUp(0)}>
                  <ObraCard obra={narrow} onClick={onObraClick} aspectRatio="3/4" className="h-full rounded-xl" />
                </motion.div>
                <motion.div className="md:col-span-2" {...fadeUp(0.08)}>
                  <ObraCard obra={wide} onClick={onObraClick} aspectRatio="4/3" className="h-full rounded-xl" />
                </motion.div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
