import { Search, TrendingUp, Presentation, ShieldCheck, Radio } from "lucide-react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

import type { LucideIcon } from "lucide-react"

interface Tool {
  key: string
  name: string
  desc: string
  icon: LucideIcon
}

const tools: Tool[] = [
  {
    key: "Ctrl+1",
    name: "Intel",
    desc: "Instant research on any company, person, or topic mentioned in conversation",
    icon: Search,
  },
  {
    key: "Ctrl+2",
    name: "Deal Status",
    desc: "Live pipeline snapshot — stage, risk, and next steps for any client",
    icon: TrendingUp,
  },
  {
    key: "Ctrl+3",
    name: "Prep",
    desc: "AI-generated meeting slides from a single screenshot",
    icon: Presentation,
  },
  {
    key: "Ctrl+4",
    name: "Fact Check",
    desc: "Real-time claim verification with confidence scoring",
    icon: ShieldCheck,
  },
]

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="system-badge">{tool.key}</span>
      </div>
      <Icon className="text-[var(--text-secondary)] mb-3" size={24} />
      <h3 className="text-white font-semibold text-lg mb-2">{tool.name}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{tool.desc}</p>
    </div>
  )
}

export function Features() {
  const { ref, visible } = useInView()

  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} py-24`}>
      <SectionHeader
        title="Five Tools. One Overlay."
        subtitle="Four keyboard shortcuts plus an always-on passive listener."
      />

      <div className={`stagger ${visible ? "visible" : ""} grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4`}>
        {tools.map((tool) => (
          <ToolCard key={tool.key} tool={tool} />
        ))}
      </div>

      {/* Passive Listener — full width */}
      <div className={`glass-card p-6 glow transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: visible ? "0.4s" : "0s" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="pulse-slow bg-brand-primary rounded-full w-3 h-3" />
          <span className="system-badge">Always-on</span>
        </div>
        <Radio className="text-[var(--text-secondary)] mb-3" size={24} />
        <h3 className="text-white font-semibold text-lg mb-2">Passive Listener</h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Auto-detects entities in conversation and triggers intel cards without any keypress
        </p>
      </div>
    </div>
  )
}
