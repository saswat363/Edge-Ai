"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, User, Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { AdaptiveDataCard, type AdaptiveCardData } from "./adaptive-data-card"

interface SourceDocument {
  id: string
  title: string
  type: "pdf" | "csv" | "internal" | "rbi"
  relevanceScore: number
  excerpt: string
  pageNumber?: number
  section?: string
}

interface ThoughtStep {
  id: string
  step: number
  action: string
  reasoning: string
  confidence: number
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: { id: number; title: string }[]
  dataCard?: AdaptiveCardData
  xaiData?: {
    sources: SourceDocument[]
    thoughtSteps: ThoughtStep[]
    overallConfidence: number
  }
}

interface ChatMessagesProps {
  messages: Message[]
}

const messageVariants = {
  hidden: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 30 : -30,
    y: 10,
    scale: 0.95,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

const sourceVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
}

// Typing effect component
function TypewriterText({ content }: { content: string }) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedContent("")
    setIsComplete(false)
    
    let index = 0
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 5) // Fast typing speed

    return () => clearInterval(interval)
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      dangerouslySetInnerHTML={{ __html: displayedContent }}
      className="text-foreground [&_strong]:font-semibold [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:text-foreground [&_p]:mb-3 [&_p:last-child]:mb-0"
    />
  )
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            custom={message.role === "user"}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className={cn(
              "flex gap-4",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center relative overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent"
                />
                <Bot className="w-5 h-5 text-primary-foreground relative z-10" />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={cn(
                "max-w-2xl rounded-2xl overflow-hidden",
                message.role === "user"
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-md px-5 py-4 shadow-lg shadow-primary/20"
                  : "glass rounded-bl-md"
              )}
            >
              {message.role === "assistant" ? (
                <div className="p-5">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <TypewriterText content={message.content} />
                  </div>

                  {/* Adaptive Data Card */}
                  {message.dataCard && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4"
                    >
                      <AdaptiveDataCard data={message.dataCard} />
                    </motion.div>
                  )}

                  {message.sources && message.sources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 pt-4 border-t border-border/30"
                    >
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, i) => (
                          <motion.button
                            key={source.id}
                            custom={i}
                            variants={sourceVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground glass rounded-lg transition-colors group"
                          >
                            <FileText className="w-3 h-3" />
                            <span className="group-hover:text-foreground transition-colors">
                              [{source.id}] {source.title}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </motion.div>

            {message.role === "user" && (
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/60 border border-border/50 flex items-center justify-center"
              >
                <User className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}
