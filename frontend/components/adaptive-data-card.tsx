"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Info, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Interest Rate Table
interface InterestRateData {
  type: "interest-rates"
  title: string
  rates: { name: string; rate: string; change?: number }[]
}

// Loan Status Progress
interface LoanStatusData {
  type: "loan-status"
  title: string
  stages: { name: string; status: "completed" | "current" | "pending" }[]
  currentStage: number
  totalStages: number
}

// Policy Bento Grid
interface PolicySummaryData {
  type: "policy-summary"
  title: string
  items: { label: string; value: string; icon?: "info" | "check" | "alert" }[]
}

// NPA Classification Timeline
interface TimelineData {
  type: "timeline"
  title: string
  items: { label: string; days: string; description: string }[]
}

export type AdaptiveCardData = InterestRateData | LoanStatusData | PolicySummaryData | TimelineData

interface AdaptiveDataCardProps {
  data: AdaptiveCardData
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

function InterestRatesCard({ data }: { data: InterestRateData }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-xl p-5 overflow-hidden"
    >
      <h4 className="text-sm font-semibold text-foreground mb-4">{data.title}</h4>
      <div className="space-y-3">
        {data.rates.map((rate, index) => (
          <motion.div
            key={rate.name}
            variants={itemVariants}
            className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
          >
            <span className="text-sm text-muted-foreground">{rate.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground font-mono">{rate.rate}</span>
              {rate.change !== undefined && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                    rate.change > 0 ? "text-destructive bg-destructive/10" : "text-success bg-success/10"
                  )}
                >
                  {rate.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(rate.change)}%</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function LoanStatusCard({ data }: { data: LoanStatusData }) {
  const progress = (data.currentStage / data.totalStages) * 100

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-xl p-5 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground">{data.title}</h4>
        <span className="text-xs text-muted-foreground">
          Stage {data.currentStage} of {data.totalStages}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
        />
        <motion.div
          animate={{ x: ["0%", "100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {data.stages.map((stage, index) => (
          <motion.div
            key={stage.name}
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                stage.status === "completed" && "bg-success text-success-foreground",
                stage.status === "current" && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                stage.status === "pending" && "bg-muted text-muted-foreground"
              )}
            >
              {stage.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </motion.div>
            <span
              className={cn(
                "text-sm",
                stage.status === "current" ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {stage.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function PolicySummaryCard({ data }: { data: PolicySummaryData }) {
  const iconMap = {
    info: Info,
    check: CheckCircle2,
    alert: AlertCircle,
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-xl p-5 overflow-hidden"
    >
      <h4 className="text-sm font-semibold text-foreground mb-4">{data.title}</h4>
      <div className="grid grid-cols-2 gap-3">
        {data.items.map((item, index) => {
          const Icon = item.icon ? iconMap[item.icon] : Info
          return (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-3 rounded-lg bg-secondary/50 border border-border/30"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function TimelineCard({ data }: { data: TimelineData }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-xl p-5 overflow-hidden"
    >
      <h4 className="text-sm font-semibold text-foreground mb-4">{data.title}</h4>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-muted" />
        
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="relative pl-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background"
              />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {item.days}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function AdaptiveDataCard({ data }: AdaptiveDataCardProps) {
  switch (data.type) {
    case "interest-rates":
      return <InterestRatesCard data={data} />
    case "loan-status":
      return <LoanStatusCard data={data} />
    case "policy-summary":
      return <PolicySummaryCard data={data} />
    case "timeline":
      return <TimelineCard data={data} />
    default:
      return null
  }
}
