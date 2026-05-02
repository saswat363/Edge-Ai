"use client"

import { motion } from "framer-motion"

interface QuantumLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  collapsed?: boolean
}

export function QuantumLogo({ size = "md", showText = true, collapsed = false }: QuantumLogoProps) {
  const sizes = {
    sm: { container: 32, core: 6, orbit: 14, arc: 28 },
    md: { container: 40, core: 8, orbit: 16, arc: 36 },
    lg: { container: 56, core: 10, orbit: 22, arc: 48 },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer"
        style={{ width: s.container, height: s.container }}
      >
        {/* Outer glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-accent/30 blur-md"
        />

        {/* Shield-like container */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        >
          {/* Inner gradient shimmer */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
            style={{ backgroundSize: "200% 200%" }}
          />
        </div>

        {/* Primary orbital ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg
            width={s.arc}
            height={s.arc}
            viewBox="0 0 48 48"
            className="absolute"
            style={{ top: (s.container - s.arc) / 2, left: (s.container - s.arc) / 2 }}
          >
            <defs>
              <linearGradient id="orbitGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 211, 238)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="rgb(99, 102, 241)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse
              cx="24"
              cy="24"
              rx="20"
              ry="8"
              fill="none"
              stroke="url(#orbitGradient1)"
              strokeWidth="1.5"
              transform="rotate(-30 24 24)"
            />
          </svg>
        </motion.div>

        {/* Secondary orbital ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg
            width={s.arc}
            height={s.arc}
            viewBox="0 0 48 48"
            className="absolute"
            style={{ top: (s.container - s.arc) / 2, left: (s.container - s.arc) / 2 }}
          >
            <defs>
              <linearGradient id="orbitGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(251, 191, 36)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse
              cx="24"
              cy="24"
              rx="18"
              ry="6"
              fill="none"
              stroke="url(#orbitGradient2)"
              strokeWidth="1"
              transform="rotate(60 24 24)"
            />
          </svg>
        </motion.div>

        {/* Intersection point / Intelligence node */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-gradient-to-br from-amber-400 to-amber-500"
          style={{
            width: s.core * 0.6,
            height: s.core * 0.6,
            top: s.container * 0.25,
            right: s.container * 0.2,
            boxShadow: "0 0 8px rgba(251, 191, 36, 0.6)",
          }}
        />

        {/* Central core - glowing data point */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: (s.container - s.core * 2) / 2,
            left: (s.container - s.core * 2) / 2,
            width: s.core * 2,
            height: s.core * 2,
          }}
        >
          {/* Core glow */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-cyan-400/50 blur-sm"
            style={{ width: s.core * 1.5, height: s.core * 1.5 }}
          />
          
          {/* Core solid */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(34, 211, 238, 0.3)",
                "0 0 15px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.5)",
                "0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(34, 211, 238, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative rounded-full bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-500"
            style={{ width: s.core, height: s.core }}
          />
        </div>

        {/* Data particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute w-1 h-1 rounded-full bg-cyan-400"
              style={{
                top: s.container * 0.15 + i * 3,
                left: s.container * 0.5,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Text */}
      {showText && !collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col"
        >
          <span className="font-semibold text-foreground tracking-tight">edgeAI</span>
          <span className="text-xs text-muted-foreground">Quantum Banking</span>
        </motion.div>
      )}
    </div>
  )
}
