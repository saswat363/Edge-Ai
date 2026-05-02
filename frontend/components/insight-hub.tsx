"use client"

import { motion } from "framer-motion"
import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InsightCard {
  id: string
  type: "alert" | "metric" | "reminder" | "trend"
  title: string
  value: string
  subtitle?: string
  change?: number
  icon: React.ElementType
  color: "red" | "amber" | "green" | "blue" | "purple"
  priority?: "high" | "medium" | "low"
}

const insights: InsightCard[] = [
  {
    id: "1",
    type: "alert",
    title: "Payments Overdue",
    value: "3",
    subtitle: "Requires immediate attention",
    icon: AlertTriangle,
    color: "red",
    priority: "high",
  },
  {
    id: "2",
    type: "reminder",
    title: "Next EMI Due",
    value: "$2,450",
    subtitle: "In 2 days",
    icon: Calendar,
    color: "amber",
  },
  {
    id: "3",
    type: "metric",
    title: "Credit Score",
    value: "782",
    change: 12,
    subtitle: "Excellent",
    icon: TrendingUp,
    color: "green",
  },
  {
    id: "4",
    type: "trend",
    title: "Monthly Spend",
    value: "$4,230",
    change: -8.5,
    subtitle: "vs last month",
    icon: CreditCard,
    color: "blue",
  },
]

const colorMap = {
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    glow: "shadow-red-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  blue: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  purple: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/20",
  },
}

interface InsightHubProps {
  onInsightClick?: (insight: InsightCard) => void
}

export function InsightHub({ onInsightClick }: InsightHubProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4"
    >
      {insights.map((insight, index) => {
        const colors = colorMap[insight.color]

        return (
          <motion.button
            key={insight.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onInsightClick?.(insight)}
            className={cn(
              "relative p-4 rounded-xl border text-left transition-all group overflow-hidden",
              colors.bg,
              colors.border,
              "hover:shadow-lg",
              colors.glow
            )}
          >
            {/* Priority indicator */}
            {insight.priority === "high" && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"
              />
            )}

            {/* Sparkline background effect */}
            <div className="absolute bottom-0 left-0 right-0 h-8 opacity-20 overflow-hidden">
              <svg viewBox="0 0 100 20" className={cn("w-full h-full", colors.text)}>
                <path
                  d="M0,15 Q10,10 20,12 T40,8 T60,14 T80,6 T100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", colors.bg)}>
                  <insight.icon className={cn("w-4 h-4", colors.text)} />
                </div>
                {insight.change !== undefined && (
                  <div
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      insight.change > 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {insight.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(insight.change)}%
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-1">{insight.title}</p>
              <p className={cn("text-xl font-bold", colors.text)}>{insight.value}</p>
              {insight.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{insight.subtitle}</p>
              )}
            </div>

            {/* Hover effect */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"
            />
          </motion.button>
        )
      })}
    </motion.div>
  )
}

// Notification panel for real-time updates
export function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      type: "success",
      message: "Payment of $1,200 received",
      time: "2 min ago",
      icon: CheckCircle2,
    },
    {
      id: 2,
      type: "alert",
      message: "Unusual activity detected on Account #4521",
      time: "15 min ago",
      icon: AlertTriangle,
    },
    {
      id: 3,
      type: "info",
      message: "New RBI circular published",
      time: "1 hour ago",
      icon: Bell,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 glass-strong rounded-2xl border border-border/50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Notifications</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-xs text-primary font-medium">
          3 new
        </span>
      </div>

      <div className="p-2 space-y-1">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                "p-2 rounded-lg shrink-0",
                notif.type === "success" && "bg-emerald-500/10",
                notif.type === "alert" && "bg-red-500/10",
                notif.type === "info" && "bg-cyan-500/10"
              )}
            >
              <notif.icon
                className={cn(
                  "w-4 h-4",
                  notif.type === "success" && "text-emerald-400",
                  notif.type === "alert" && "text-red-400",
                  notif.type === "info" && "text-cyan-400"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground group-hover:text-foreground/90 line-clamp-2">
                {notif.message}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {notif.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-border/30">
        <button className="w-full py-2 text-center text-xs text-primary hover:text-primary/80 transition-colors">
          View all notifications
        </button>
      </div>
    </motion.div>
  )
}
