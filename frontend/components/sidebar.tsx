"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  MessageSquare,
  ChevronLeft,
  Database,
  Cpu,
  Sparkles,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuantumLogo } from "@/components/quantum-logo"
import { cn } from "@/lib/utils"

const recentQueries = [
  { id: 1, title: "RBI Loan Policy 2024", time: "2m ago" },
  { id: 2, title: "Mortgage Rate Analysis", time: "1h ago" },
  { id: 3, title: "KYC Compliance Guidelines", time: "3h ago" },
  { id: 4, title: "Credit Card Interest Rates", time: "Yesterday" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  focusMode?: boolean
}

export function Sidebar({ collapsed, onToggle, focusMode }: SidebarProps) {
  const [hoveredQuery, setHoveredQuery] = useState<number | null>(null)

  return (
    <AnimatePresence>
      {!focusMode && (
        <motion.aside
          initial={{ width: 288, opacity: 1 }}
          animate={{ 
            width: collapsed ? 72 : 288,
            opacity: 1 
          }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col h-screen border-r border-border/50 bg-sidebar/60 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Ambient glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-accent/5 to-transparent" />
          </div>

          {/* Logo Section */}
          <div className="relative flex items-center justify-between p-4 border-b border-border/30">
            <QuantumLogo size="md" showText={!collapsed} collapsed={collapsed} />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className={cn(
                  "h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  collapsed && "absolute -right-4 top-1/2 -translate-y-1/2 z-50 bg-card shadow-lg border border-border/50 rounded-full"
                )}
              >
                <motion.div
                  animate={{ rotate: collapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* New Chat Button */}
          <div className="relative p-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={cn(
                  "w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 transition-all border-0",
                  collapsed ? "px-0" : "justify-start gap-2"
                )}
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      New Chat
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>

          {/* Recent Queries */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto px-3 py-2"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  Recent Queries
                </p>
                <div className="space-y-1">
                  {recentQueries.map((query, index) => (
                    <motion.button
                      key={query.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredQuery(query.id)}
                      onHoverEnd={() => setHoveredQuery(null)}
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-all group relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ 
                          opacity: hoveredQuery === query.id ? 1 : 0,
                          scale: hoveredQuery === query.id ? 1 : 0.8,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg"
                      />
                      <MessageSquare className="w-4 h-4 shrink-0 relative z-10" />
                      <div className="flex-1 text-left relative z-10 min-w-0">
                        <p className="truncate font-medium">{query.title}</p>
                        <p className="text-xs text-muted-foreground/60">{query.time}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* System Status Card */}
          <div className="relative mt-auto p-3 border-t border-border/30">
            <motion.div
              layout
              className={cn(
                "rounded-xl glass overflow-hidden",
                collapsed ? "p-2" : "p-4"
              )}
            >
              <AnimatePresence mode="wait">
                {!collapsed ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 rounded-full bg-success blur-sm"
                        />
                        <div className="relative w-2.5 h-2.5 rounded-full bg-success" />
                      </div>
                      <span className="text-xs font-semibold text-success">System Online</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: Cpu, label: "Edge AI", value: "Active", color: "text-accent" },
                        { icon: Sparkles, label: "Model", value: "Mistral-7B", color: "text-primary" },
                        { icon: Database, label: "Vector DB", value: "4,021 Docs", color: "text-muted-foreground" },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60">
                            <item.icon className={cn("w-4 h-4", item.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-3 h-3 rounded-full bg-success"
                    />
                    <Cpu className="w-4 h-4 text-accent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
