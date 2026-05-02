"use client"

import { motion } from "framer-motion"
import { Trash2, Maximize2, Minimize2, Command, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  title: string
  onClearChat: () => void
  focusMode: boolean
  onToggleFocusMode: () => void
  onOpenCommandPalette?: () => void
  onSignOut?: () => void
}

export function ChatHeader({ title, onClearChat, focusMode, onToggleFocusMode, onOpenCommandPalette, onSignOut }: ChatHeaderProps) {
  return (
    <motion.header
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 glass-subtle border-b border-border/30"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </motion.div>

      <div className="flex items-center gap-2">
        {/* Command Palette Button */}
        {onOpenCommandPalette && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCommandPalette}
              className="text-muted-foreground hover:text-foreground gap-2 glass border-border/50"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary/50 text-xs">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </Button>
          </motion.div>
        )}

        {/* Focus Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFocusMode}
            className="text-muted-foreground hover:text-foreground gap-1.5 glass"
          >
            {focusMode ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Exit Focus</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Focus Mode</span>
              </>
            )}
          </Button>
        </motion.div>

        {/* Clear Chat */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        </motion.div>

        {/* Sign Out */}
        {onSignOut && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
