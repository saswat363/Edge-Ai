"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Info,
  Lightbulb,
  Database,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

interface XAIExplainerProps {
  sources: SourceDocument[]
  thoughtSteps?: ThoughtStep[]
  overallConfidence: number
}

export function XAIExplainer({ sources, thoughtSteps, overallConfidence }: XAIExplainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"sources" | "reasoning">("sources")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 rounded-xl border border-border/30 bg-secondary/20 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Why did the AI say this?</p>
            <p className="text-xs text-muted-foreground">
              {sources.length} sources referenced | {Math.round(overallConfidence * 100)}% confidence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceMeter confidence={overallConfidence} />
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/30"
          >
            {/* Tabs */}
            <div className="flex border-b border-border/30">
              <button
                onClick={() => setActiveTab("sources")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === "sources"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Database className="w-4 h-4" />
                Source Documents
              </button>
              <button
                onClick={() => setActiveTab("reasoning")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === "reasoning"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Lightbulb className="w-4 h-4" />
                Thought Process
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-80 overflow-y-auto">
              {activeTab === "sources" ? (
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <motion.div
                      key={source.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-secondary/30 border border-border/20 hover:border-border/40 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg shrink-0",
                              source.type === "rbi" && "bg-amber-500/10",
                              source.type === "pdf" && "bg-cyan-500/10",
                              source.type === "csv" && "bg-emerald-500/10",
                              source.type === "internal" && "bg-indigo-500/10"
                            )}
                          >
                            <FileText
                              className={cn(
                                "w-4 h-4",
                                source.type === "rbi" && "text-amber-400",
                                source.type === "pdf" && "text-cyan-400",
                                source.type === "csv" && "text-emerald-400",
                                source.type === "internal" && "text-indigo-400"
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">{source.title}</p>
                              {source.type === "rbi" && (
                                <span className="px-1.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 font-medium">
                                  RBI Official
                                </span>
                              )}
                            </div>
                            {source.section && (
                              <p className="text-xs text-muted-foreground">
                                {source.section}
                                {source.pageNumber && ` | Page ${source.pageNumber}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RelevanceScore score={source.relevanceScore} />
                          <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        &quot;{source.excerpt}&quot;
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {thoughtSteps?.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0",
                            step.confidence > 0.8
                              ? "bg-emerald-500/20 text-emerald-400"
                              : step.confidence > 0.6
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                          )}
                        >
                          {step.step}
                        </div>
                        {index < (thoughtSteps?.length || 0) - 1 && (
                          <div className="w-px h-full bg-border/30 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-foreground">{step.action}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{step.reasoning}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(step.confidence * 100)}% confidence in this step
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100)

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            confidence > 0.8 && "bg-emerald-500",
            confidence > 0.6 && confidence <= 0.8 && "bg-amber-500",
            confidence <= 0.6 && "bg-red-500"
          )}
        />
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          confidence > 0.8 && "text-emerald-400",
          confidence > 0.6 && confidence <= 0.8 && "text-amber-400",
          confidence <= 0.6 && "text-red-400"
        )}
      >
        {percentage}%
      </span>
    </div>
  )
}

function RelevanceScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 h-3 rounded-full transition-colors",
            i <= Math.round(score * 5) ? "bg-primary" : "bg-secondary/50"
          )}
        />
      ))}
    </div>
  )
}

// Audit Trail Component
export function AuditTrail() {
  const auditEntries = [
    {
      id: 1,
      action: "Query Submitted",
      query: "What are the RBI guidelines for personal loan defaults?",
      timestamp: "2024-01-15 14:32:05",
      status: "completed",
    },
    {
      id: 2,
      action: "Documents Retrieved",
      query: "3 documents from vector database",
      timestamp: "2024-01-15 14:32:06",
      status: "completed",
    },
    {
      id: 3,
      action: "Response Generated",
      query: "Mistral-7B inference completed",
      timestamp: "2024-01-15 14:32:08",
      status: "completed",
    },
    {
      id: 4,
      action: "User Feedback",
      query: "Response marked as helpful",
      timestamp: "2024-01-15 14:32:45",
      status: "completed",
    },
  ]

  return (
    <div className="p-4 rounded-xl border border-border/30 bg-secondary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Audit Trail</h3>
        </div>
        <button className="text-xs text-primary hover:underline">Export CSV</button>
      </div>

      <div className="space-y-2">
        {auditEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{entry.action}</p>
              <p className="text-xs text-muted-foreground truncate">{entry.query}</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono shrink-0">
              {entry.timestamp.split(" ")[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
