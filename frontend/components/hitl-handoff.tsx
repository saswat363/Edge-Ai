"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserCircle,
  Phone,
  MessageSquare,
  Video,
  Clock,
  CheckCircle2,
  Shield,
  X,
  Headphones,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HITLHandoffProps {
  isOpen: boolean
  onClose: () => void
  reason?: string
}

export function HITLHandoff({ isOpen, onClose, reason }: HITLHandoffProps) {
  const [selectedChannel, setSelectedChannel] = useState<"chat" | "call" | "video" | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  const channels = [
    {
      id: "chat" as const,
      icon: MessageSquare,
      label: "Live Chat",
      description: "Text-based support",
      waitTime: "~2 min",
      available: true,
    },
    {
      id: "call" as const,
      icon: Phone,
      label: "Voice Call",
      description: "Speak with an agent",
      waitTime: "~5 min",
      available: true,
    },
    {
      id: "video" as const,
      icon: Video,
      label: "Video Call",
      description: "Face-to-face support",
      waitTime: "~10 min",
      available: false,
    },
  ]

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="glass-strong rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(34, 211, 238, 0)",
                        "0 0 0 10px rgba(34, 211, 238, 0.1)",
                        "0 0 0 0 rgba(34, 211, 238, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent"
                  >
                    <Headphones className="w-7 h-7 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {isConnected ? "Connected to Agent" : "Human Agent Support"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isConnected
                        ? "Your session is being handled by a specialist"
                        : "Connect with a banking specialist"}
                    </p>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">
                    End-to-end encrypted | Compliant with banking regulations
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isConnected ? (
                  <ConnectedView />
                ) : isConnecting ? (
                  <ConnectingView />
                ) : (
                  <>
                    {/* Reason for handoff */}
                    {reason && (
                      <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-400">
                            High-risk query detected
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{reason}</p>
                        </div>
                      </div>
                    )}

                    {/* Channel Selection */}
                    <p className="text-sm font-medium text-foreground mb-4">
                      Select your preferred channel
                    </p>
                    <div className="space-y-3">
                      {channels.map((channel) => (
                        <motion.button
                          key={channel.id}
                          onClick={() => channel.available && setSelectedChannel(channel.id)}
                          whileHover={channel.available ? { scale: 1.01 } : {}}
                          whileTap={channel.available ? { scale: 0.99 } : {}}
                          disabled={!channel.available}
                          className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-xl border transition-all",
                            selectedChannel === channel.id
                              ? "border-primary bg-primary/10"
                              : "border-border/30 hover:border-border/50 bg-secondary/20",
                            !channel.available && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center w-12 h-12 rounded-xl",
                              selectedChannel === channel.id
                                ? "bg-primary/20"
                                : "bg-secondary/50"
                            )}
                          >
                            <channel.icon
                              className={cn(
                                "w-5 h-5",
                                selectedChannel === channel.id
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <p
                              className={cn(
                                "font-medium",
                                selectedChannel === channel.id
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {channel.label}
                            </p>
                            <p className="text-xs text-muted-foreground">{channel.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {channel.waitTime}
                            </div>
                            {!channel.available && (
                              <span className="text-xs text-amber-400">Unavailable</span>
                            )}
                          </div>
                          {selectedChannel === channel.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Connect Button */}
                    <Button
                      onClick={handleConnect}
                      disabled={!selectedChannel}
                      className="w-full mt-6 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                      <Headphones className="w-4 h-4 mr-2" />
                      Connect to Agent
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ConnectingView() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full"
        />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Connecting you to an agent</h3>
      <p className="text-sm text-muted-foreground text-center">
        Please wait while we find the best available specialist for your query...
      </p>
      <div className="flex items-center gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  )
}

function ConnectedView() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <UserCircle className="w-12 h-12 text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      <h3 className="text-lg font-semibold text-foreground mb-1">Priya Sharma</h3>
      <p className="text-sm text-muted-foreground mb-4">Senior Banking Specialist</p>

      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-emerald-400 font-medium">Connected | Session Active</span>
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Your conversation has been transferred. The agent has full context of your previous queries.
      </p>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" size="sm">
          <Phone className="w-4 h-4 mr-2" />
          Switch to Voice
        </Button>
        <Button variant="outline" size="sm">
          <Video className="w-4 h-4 mr-2" />
          Switch to Video
        </Button>
      </div>
    </div>
  )
}

// Floating escalation button for high-risk queries
export function EscalationButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
    >
      <Headphones className="w-4 h-4" />
      <span>Secure Connect</span>
    </motion.button>
  )
}
