"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Sidebar } from "@/components/sidebar"
import { ChatHeader } from "@/components/chat-header"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ChatMessages, type Message } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { ContextBar } from "@/components/context-bar"
import { AmbientBackground } from "@/components/ambient-background"
import { CommandPalette } from "@/components/command-palette"
import { InsightHub } from "@/components/insight-hub"
import { HITLHandoff, EscalationButton } from "@/components/hitl-handoff"
import { XAIExplainer } from "@/components/xai-explainer"
import { QuantumLogo } from "@/components/quantum-logo"
import { Button } from "@/components/ui/button"
import type { AdaptiveCardData } from "@/components/adaptive-data-card"

// Sample XAI data for explainability
const sampleSources = [
  {
    id: "1",
    title: "RBI_Master_Direction_2024.pdf",
    type: "rbi" as const,
    relevanceScore: 0.95,
    excerpt: "The classification of a standard asset to NPA should be done in accordance with the income recognition norms...",
    section: "Chapter 4, Section 4.2.1",
    pageNumber: 42,
  },
  {
    id: "2",
    title: "Internal_Loan_Policy.csv",
    type: "internal" as const,
    relevanceScore: 0.82,
    excerpt: "Recovery procedures must be initiated within 7 business days of NPA classification...",
    section: "Recovery Guidelines",
  },
  {
    id: "3",
    title: "Fair_Practices_Code_2023.pdf",
    type: "pdf" as const,
    relevanceScore: 0.78,
    excerpt: "Banks shall not resort to undue harassment, intimidation or coercion in the recovery process...",
    section: "Section 8",
    pageNumber: 15,
  },
]

const sampleThoughtSteps = [
  {
    id: "1",
    step: 1,
    action: "Query Analysis",
    reasoning: "Identified key terms: 'RBI guidelines', 'personal loan', 'defaults'. Classified as regulatory compliance query.",
    confidence: 0.95,
  },
  {
    id: "2",
    step: 2,
    action: "Document Retrieval",
    reasoning: "Retrieved 3 relevant documents from vector database using semantic search on policy terms.",
    confidence: 0.88,
  },
  {
    id: "3",
    step: 3,
    action: "Information Synthesis",
    reasoning: "Combined information from RBI Master Direction and internal policy to provide comprehensive answer.",
    confidence: 0.85,
  },
  {
    id: "4",
    step: 4,
    action: "Response Generation",
    reasoning: "Structured response with classification timeline, recovery process, and customer rights sections.",
    confidence: 0.92,
  },
]

// Sample NPA classification data card
const npaDataCard: AdaptiveCardData = {
  type: "timeline",
  title: "NPA Classification Timeline",
  items: [
    { label: "Standard Asset", days: "0 days", description: "Account with no overdue payments" },
    { label: "SMA-0", days: "1-30 days", description: "Special Mention Account - Early warning" },
    { label: "SMA-1", days: "31-60 days", description: "Principal/interest overdue" },
    { label: "SMA-2", days: "61-90 days", description: "High risk of default" },
    { label: "NPA", days: "90+ days", description: "Non-Performing Asset classification" },
  ],
}

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What are the latest RBI guidelines for personal loan defaults?",
  },
  {
    id: "2",
    role: "assistant",
    content: `<p>Based on the latest <strong>RBI Master Direction on Loan Default Management (2024)</strong>, here are the key guidelines for handling personal loan defaults:</p>
      
      <p><strong>Classification Timeline:</strong></p>
      <ul>
        <li><strong>Standard Asset:</strong> Account with no overdue payments</li>
        <li><strong>Special Mention Account (SMA-0):</strong> 1-30 days overdue</li>
        <li><strong>SMA-1:</strong> 31-60 days overdue</li>
        <li><strong>SMA-2:</strong> 61-90 days overdue</li>
        <li><strong>Non-Performing Asset (NPA):</strong> More than 90 days overdue</li>
      </ul>
      
      <p><strong>Recovery Process:</strong></p>
      <ul>
        <li>Banks must issue a written notice before initiating recovery proceedings</li>
        <li>A minimum 60-day notice period is mandatory before classifying as NPA</li>
        <li>Recovery agents must follow the RBI Fair Practices Code</li>
      </ul>
      
      <p><strong>Customer Rights:</strong></p>
      <ul>
        <li>Borrowers have the right to request restructuring before NPA classification</li>
        <li>All communication must be during reasonable hours (7 AM to 7 PM)</li>
      </ul>`,
    sources: [
      { id: 1, title: "RBI_Master_Direction_2024.pdf" },
      { id: 2, title: "Internal_Loan_Policy.csv" },
    ],
    dataCard: npaDataCard,
    xaiData: {
      sources: sampleSources,
      thoughtSteps: sampleThoughtSteps,
      overallConfidence: 0.89,
    },
  },
]

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [currentTopic, setCurrentTopic] = useState<string | undefined>("Loan Default Policy")
  const [sentiment, setSentiment] = useState<"neutral" | "positive" | "informative" | "warning">("informative")
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [hitlOpen, setHitlOpen] = useState(false)
  const [showEscalation, setShowEscalation] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)
    
    try {
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)
      
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.access_token)
        setIsLoggedIn(true)
      } else {
        setLoginError("Invalid username or password.")
      }
    } catch (err) {
      setLoginError("Failed to connect to authentication server.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      // Focus input: /
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !commandPaletteOpen) {
        const target = e.target as HTMLElement
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault()
          const input = document.querySelector("textarea")
          input?.focus()
        }
      }
      // Exit focus mode: Escape
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusMode, commandPaletteOpen])

  const handleSendMessage = async (content: string) => {
    // Check for high-risk queries that need human escalation
    const highRiskKeywords = ["fraud", "dispute", "complaint", "unauthorized", "stolen"]
    const isHighRisk = highRiskKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    )

    if (isHighRisk) {
      setShowEscalation(true)
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, newMessage])
    setShowWelcome(false)
    setIsLoading(true)
    setCurrentTopic(content.split(" ").slice(0, 3).join(" ") + "...")

    try {
      const formData = new FormData()
      formData.append("query", content)
      
      // Construct history for the API
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }))
      formData.append("history", JSON.stringify(history))

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response from Edge AI")
      }

      const data = await response.json()
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources.map((src: string, index: number) => ({
          id: index + 1,
          title: src.substring(0, 30) + "..."
        })),
        xaiData: {
          sources: data.sources.map((src: string, index: number) => ({
            id: String(index + 1),
            title: "Retrieved Source " + (index + 1),
            type: "pdf",
            relevanceScore: 0.9,
            excerpt: src,
            section: "Relevant Section",
          })),
          thoughtSteps: [
            {
              id: "1",
              step: 1,
              action: "Retrieval",
              reasoning: "Searching local vector database for banking policy context.",
              confidence: 0.95,
            },
            {
              id: "2",
              step: 2,
              action: "Generation",
              reasoning: "Synthesizing answer using local Mistral/Gemma model.",
              confidence: 0.88,
            }
          ],
          overallConfidence: 0.9,
        },
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error calling Edge AI:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "<p>I apologize, but I encountered an error connecting to the local Edge AI service. Please ensure the backend is running.</p>",
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    const toastId = toast.loading(`Uploading ${file.name}...`)
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      toast.success(`Success: ${file.name} is being ingested into Edge AI.`, { id: toastId })
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Failed to upload ${file.name}. Ensure the backend is running.`, { id: toastId })
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setShowWelcome(true)
    setCurrentTopic(undefined)
    setSentiment("neutral")
    setShowEscalation(false)
  }

  const handleSelectAction = (action: string) => {
    handleSendMessage(action)
  }

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
    if (!focusMode) {
      setSidebarCollapsed(true)
    }
  }

  const handleCommandSelect = (command: { id: string; label: string }) => {
    if (command.id === "customer-support") {
      setHitlOpen(true)
    } else {
      handleSendMessage(`Show me ${command.label.toLowerCase()}`)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="relative flex h-screen items-center justify-center overflow-hidden bg-background">
        <AmbientBackground sentiment="informative" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-8 glass rounded-2xl border border-border/50 shadow-2xl space-y-8 text-center"
        >
          <div className="flex justify-center">
            <QuantumLogo size="md" showText={true} collapsed={false} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access the Enterprise Banking Assistant</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 text-sm text-center text-destructive bg-destructive/10 rounded-lg">
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 mt-2 text-md font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 transition-all border-0"
            >
              {isLoggingIn ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Ambient Background */}
      <AmbientBackground sentiment={sentiment} />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        focusMode={focusMode}
      />

      <motion.main
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex-1 flex flex-col overflow-hidden"
      >
        {/* Context Bar */}
        <ContextBar currentTopic={currentTopic} isProcessing={isLoading} />

        {/* Chat Header */}
        <ChatHeader
          title={messages.length > 0 ? "Banking Policy Assistant" : "New Conversation"}
          onClearChat={handleClearChat}
          focusMode={focusMode}
          onToggleFocusMode={toggleFocusMode}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onSignOut={() => setIsLoggedIn(false)}
        />

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {showWelcome || messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Insight Hub - Proactive Dashboard */}
                <InsightHub onInsightClick={(insight) => handleSendMessage(`Tell me about ${insight.title}`)} />
                <WelcomeScreen onSelectAction={handleSelectAction} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChatMessages messages={messages} />
                
                {/* XAI Explainer for last assistant message */}
                {messages.length > 0 && messages[messages.length - 1].role === "assistant" && 
                 messages[messages.length - 1].xaiData && (
                  <div className="px-6 pb-4">
                    <XAIExplainer
                      sources={messages[messages.length - 1].xaiData!.sources}
                      thoughtSteps={messages[messages.length - 1].xaiData!.thoughtSteps}
                      overallConfidence={messages[messages.length - 1].xaiData!.overallConfidence}
                    />
                  </div>
                )}
                
                {/* Typing indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="px-6 pb-6"
                    >
                      <div className="flex gap-4 items-start">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center relative overflow-hidden"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent"
                          />
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 px-5 py-4 glass rounded-2xl rounded-bl-md"
                        >
                          <span className="text-sm text-muted-foreground">Searching knowledge base</span>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  y: [0, -6, 0],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                }}
                                className="w-2 h-2 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Escalation Button for high-risk queries */}
        <AnimatePresence>
          {showEscalation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-24 right-6"
            >
              <EscalationButton onClick={() => setHitlOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        <ChatInput onSendMessage={handleSendMessage} onUpload={handleUpload} isLoading={isLoading} />
      </motion.main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelect={handleCommandSelect}
      />

      {/* HITL Handoff Modal */}
      <HITLHandoff
        isOpen={hitlOpen}
        onClose={() => setHitlOpen(false)}
        reason={showEscalation ? "This query involves sensitive account actions that require human verification." : undefined}
      />
    </div>
  )
}
