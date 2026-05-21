"use client"

import { motion } from "framer-motion"
import { ObraCard } from "./obra-card"
import type { Obra } from "@/lib/obras"

interface GaleriaGridMasonryProps {
  obras: Obra[]
  onObraClick: (obra: Obra) => void
}

/**
 * Pure CSS columns masonry — no JS library.
 * ObraCard uses real imgW/imgH to set the correct aspect-ratio per image,
 * so each photo renders at its natural proportions with no gaps.
 */
export function GaleriaGridMasonry({ obras, onObraClick }: GaleriaGridMasonryProps) {
  if (obras.length === 0) return null

  return (
    <div className="columns-2 gap-2 lg:columns-3" style={{ columnFill: "balance" }}>
      {obras.map((obra, i) => (
        <motion.div
          key={obra.id}
          className="mb-2 break-inside-avoid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            delay: (i % 3) * 0.06,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* No aspectRatio prop → ObraCard uses natural imgW/imgH */}
          <ObraCard
            obra={obra}
            onClick={onObraClick}
            priority={i < 4}
          />
        </motion.div>
      ))}
    </div>
  )
}
