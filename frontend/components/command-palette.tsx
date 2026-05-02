"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  FileText,
  CreditCard,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  Phone,
  Settings,
  History,
  Sparkles,
  Command,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  icon: React.ElementType
  label: string
  description: string
  category: string
  shortcut?: string
  action?: () => void
}

const commands: CommandItem[] = [
  {
    id: "policy-search",
    icon: FileText,
    label: "Policy Search",
    description: "Search RBI guidelines and internal policies",
    category: "Search",
    shortcut: "P",
  },
  {
    id: "loan-calculator",
    icon: TrendingUp,
    label: "Loan Calculator",
    description: "Calculate EMI and repayment schedules",
    category: "Tools",
    shortcut: "L",
  },
  {
    id: "account-actions",
    icon: CreditCard,
    label: "Account Actions",
    description: "View balances, transactions, and statements",
    category: "Actions",
    shortcut: "A",
  },
  {
    id: "kyc-compliance",
    icon: Shield,
    label: "KYC Compliance",
    description: "Check customer verification status",
    category: "Compliance",
    shortcut: "K",
  },
  {
    id: "customer-support",
    icon: Phone,
    label: "Human Agent Handoff",
    description: "Connect to a live support agent",
    category: "Support",
    shortcut: "H",
  },
  {
    id: "risk-assessment",
    icon: AlertTriangle,
    label: "Risk Assessment",
    description: "Analyze customer risk profiles",
    category: "Analysis",
    shortcut: "R",
  },
  {
    id: "customer-360",
    icon: Users,
    label: "Customer 360",
    description: "Complete customer relationship view",
    category: "Analysis",
  },
  {
    id: "audit-trail",
    icon: History,
    label: "Audit Trail",
    description: "View conversation history and actions",
    category: "Compliance",
  },
  {
    id: "ai-settings",
    icon: Settings,
    label: "AI Settings",
    description: "Configure AI behavior and preferences",
    category: "Settings",
  },
]

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (command: CommandItem) => void
}

export function CommandPalette({ isOpen, onClose, onSelect }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = []
      acc[cmd.category].push(cmd)
      return acc
    },
    {} as Record<string, CommandItem[]>
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex])
            onClose()
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    },
    [isOpen, filteredCommands, selectedIndex, onSelect, onClose]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="glass-strong rounded-2xl border border-border/50 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands, policies, or actions..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                  autoFocus
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                      {category}
                    </p>
                    <div className="space-y-1">
                      {items.map((cmd) => {
                        const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id)
                        const isSelected = globalIndex === selectedIndex

                        return (
                          <motion.button
                            key={cmd.id}
                            onClick={() => {
                              onSelect(cmd)
                              onClose()
                            }}
                            whileHover={{ x: 4 }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                              isSelected
                                ? "bg-primary/10 text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                                isSelected ? "bg-primary/20" : "bg-secondary/50 group-hover:bg-secondary"
                              )}
                            >
                              <cmd.icon className={cn("w-4 h-4", isSelected && "text-primary")} />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium">{cmd.label}</p>
                              <p className="text-xs text-muted-foreground">{cmd.description}</p>
                            </div>
                            {cmd.shortcut && (
                              <div className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground font-mono">
                                {cmd.shortcut}
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No commands found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-secondary/20">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 font-mono">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 font-mono">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary/50 font-mono">Esc</kbd> Close
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {filteredCommands.length} commands
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
