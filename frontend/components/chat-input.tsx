"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Paperclip, ArrowUp, AlertTriangle, Loader2, Mic, MicOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onUpload?: (file: File) => void
  isLoading?: boolean
}

export function ChatInput({ onSendMessage, onUpload, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode)
    if (!voiceMode) {
      setIsListening(true)
      // Simulate voice listening
      setTimeout(() => setIsListening(false), 3000)
    } else {
      setIsListening(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload?.(file)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.csv,.txt"
        />
        
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
            boxShadow: isFocused
              ? "0 0 0 1px var(--primary), 0 0 30px -5px var(--primary), 0 20px 40px -15px rgba(0,0,0,0.3)"
              : "0 0 0 1px var(--border), 0 10px 30px -10px rgba(0,0,0,0.2)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative glass-strong rounded-2xl overflow-hidden"
        >
          {/* Pulsing AI indicator when focused */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-3 left-3 flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <span className="text-xs text-primary font-medium">AI Ready</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voice Mode Overlay */}
          <AnimatePresence>
            {voiceMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-card/95 backdrop-blur-xl z-20"
              >
                <motion.div
                  animate={{
                    scale: isListening ? [1, 1.2, 1] : 1,
                    boxShadow: isListening 
                      ? ["0 0 0 0 var(--primary)", "0 0 0 20px transparent", "0 0 0 0 var(--primary)"]
                      : "none"
                  }}
                  transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
                  className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                >
                  <motion.div
                    animate={{ scale: isListening ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                  >
                    {isListening ? (
                      <Mic className="w-8 h-8 text-primary" />
                    ) : (
                      <MicOff className="w-8 h-8 text-muted-foreground" />
                    )}
                  </motion.div>
                </motion.div>
                <p className="text-sm text-muted-foreground mb-4">
                  {isListening ? "Listening..." : "Voice mode ready"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleVoiceMode}
                  className="glass"
                >
                  Exit Voice Mode
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2 p-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-secondary/60 shrink-0"
              >
                <Paperclip className="w-5 h-5" />
                <span className="sr-only">Attach document</span>
              </Button>
            </motion.div>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Ask about banking policies, guidelines, or calculations..."
                disabled={isLoading}
                rows={1}
                className="w-full min-h-[44px] max-h-[200px] py-3 px-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm disabled:opacity-50 resize-none leading-relaxed"
              />
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVoiceMode}
                className={cn(
                  "h-10 w-10 shrink-0 transition-colors",
                  voiceMode 
                    ? "text-primary bg-primary/10 hover:bg-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <Mic className="w-5 h-5" />
                <span className="sr-only">Toggle voice mode</span>
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLoading ? "loading" : "send"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 shrink-0"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <ArrowUp className="w-5 h-5" />
                    )}
                    <span className="sr-only">Send message</span>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mt-3"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-3 h-3 text-chart-3" />
            </motion.div>
            <span>Do not input sensitive PII or account numbers</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Powered by Edge AI</span>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}
