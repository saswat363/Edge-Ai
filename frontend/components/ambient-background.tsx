"use client"

import { motion } from "framer-motion"

interface AmbientBackgroundProps {
  sentiment?: "neutral" | "positive" | "informative" | "warning"
}

const sentimentColors = {
  neutral: {
    gradient1: "from-primary/5 via-transparent to-transparent",
    gradient2: "from-transparent via-accent/3 to-transparent",
  },
  positive: {
    gradient1: "from-success/8 via-transparent to-transparent",
    gradient2: "from-transparent via-accent/5 to-transparent",
  },
  informative: {
    gradient1: "from-primary/10 via-transparent to-transparent",
    gradient2: "from-transparent via-primary/5 to-transparent",
  },
  warning: {
    gradient1: "from-chart-3/8 via-transparent to-transparent",
    gradient2: "from-transparent via-chart-3/3 to-transparent",
  },
}

export function AmbientBackground({ sentiment = "neutral" }: AmbientBackgroundProps) {
  const colors = sentimentColors[sentiment]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Top-left gradient orb */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-radial ${colors.gradient1} blur-3xl opacity-60`}
      />

      {/* Bottom-right gradient orb */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-radial ${colors.gradient2} blur-3xl opacity-50`}
      />

      {/* Center subtle accent */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/3 via-transparent to-transparent blur-3xl"
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--foreground) 1px, transparent 1px),
            linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
