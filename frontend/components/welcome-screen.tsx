"use client"

import { motion } from "framer-motion"
import { Search, FileWarning, Mail, HelpCircle, Sparkles, TrendingUp, Calculator, Shield } from "lucide-react"

const quickActions = [
  {
    icon: Search,
    title: "Search RBI Guidelines",
    description: "Browse regulatory frameworks and compliance rules",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: FileWarning,
    title: "Explain Loan Default Policy",
    description: "Understand default procedures and recovery protocols",
    gradient: "from-chart-3/20 to-chart-3/5",
  },
  {
    icon: TrendingUp,
    title: "Interest Rate Analysis",
    description: "Compare current rates and market trends",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Calculator,
    title: "EMI Calculator",
    description: "Calculate loan payments and amortization",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
]

interface WelcomeScreenProps {
  onSelectAction: (action: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export function WelcomeScreen({ onSelectAction }: WelcomeScreenProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-primary to-primary/60 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Shield className="w-10 h-10 text-primary-foreground relative z-10" />
          </motion.div>
          
          {/* Orbiting sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Sparkles className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 text-accent" />
          </motion.div>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-foreground mb-3 text-balance bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text"
        >
          {getGreeting()}
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground mb-2"
        >
          How can I assist you with banking policies today?
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="text-sm text-muted-foreground/60"
        >
          Ask about RBI guidelines, internal policies, or compliance procedures
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl"
      >
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            onClick={() => onSelectAction(action.title)}
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group relative flex items-start gap-4 p-5 rounded-xl glass text-left overflow-hidden",
              "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            )}
          >
            {/* Gradient background on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient}`}
            />

            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/60 group-hover:bg-primary/20 transition-colors"
            >
              <action.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
            <div className="flex-1 relative z-10">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
            </div>

            {/* Arrow indicator */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <motion.span 
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-primary"
                >
                  &rarr;
                </motion.span>
              </div>
            </motion.div>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        variants={itemVariants}
        className="mt-12 flex items-center gap-2 text-xs text-muted-foreground/50"
      >
        <Sparkles className="w-3 h-3" />
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-secondary/60 font-mono text-muted-foreground">/</kbd>
        <span>to focus on input</span>
      </motion.div>
    </motion.div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}
