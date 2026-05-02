"use client"

import { motion } from "framer-motion"
import { Shield, Wifi, Lock, Cpu, Zap } from "lucide-react"

interface ContextBarProps {
  currentTopic?: string
  isProcessing?: boolean
}

export function ContextBar({ currentTopic, isProcessing }: ContextBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-2 glass-subtle border-b border-border/30"
    >
      <div className="flex items-center gap-4">
        {/* Secure Session Indicator */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(var(--success), 0)",
                "0 0 0 4px rgba(var(--success), 0.1)",
                "0 0 0 0 rgba(var(--success), 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-success" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute w-2 h-2 rounded-full bg-success"
            />
          </motion.div>
          <span className="text-xs font-medium text-success">Secure Session</span>
        </motion.div>

        <div className="w-px h-4 bg-border/50" />

        {/* Encrypted Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Lock className="w-3 h-3" />
          <span>E2E Encrypted</span>
        </motion.div>

        <div className="w-px h-4 bg-border/50" />

        {/* Local Network */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Wifi className="w-3 h-3" />
          <span>Local Network</span>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        {/* Current Topic */}
        {currentTopic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
          >
            <span className="text-xs font-medium text-primary">{currentTopic}</span>
          </motion.div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-3.5 h-3.5 text-primary" />
            </motion.div>
            <span className="text-xs text-primary font-medium">Processing...</span>
          </motion.div>
        )}

        {/* Edge AI Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Zap className="w-3 h-3 text-accent" />
          <span>Edge AI Active</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
