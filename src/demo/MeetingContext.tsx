import { useState } from "react"
import { meetingTypes } from "../data/meetingTypes"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import { Button } from "../components/Button"
import { Search, Presentation, Handshake, Rocket, Users, BarChart3, MessageCircle, Plane, Repeat, ClipboardCheck } from "lucide-react"

const iconMap: Record<string, typeof Search> = {
  search: Search,
  presentation: Presentation,
  handshake: Handshake,
  rocket: Rocket,
  users: Users,
  plane: Plane,
  repeat: Repeat,
  "clipboard-check": ClipboardCheck,
  "bar-chart": BarChart3,
  "message-circle": MessageCircle,
}

interface Props {
  company: Company
  person: Person
  onSubmit: (meetingType: string) => void
}

export function MeetingContext({ company, person, onSubmit }: Props) {
  const [selected, setSelected] = useState<string>("")
  const [otherText, setOtherText] = useState("")

  const canSubmit = selected && (selected !== "other" || otherText.trim())
  const finalType = selected === "other" ? otherText.trim() : meetingTypes.find(m => m.id === selected)?.label || selected

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <p className="system-badge system-badge--dark mb-3">Step 03 &middot; Context</p>
        <h2
          className="text-2xl md:text-3xl font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          What kind of engagement is this?
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          Engagement type shapes the meeting paper — objectives, key messages, and whether agenda/logistics apply.
        </p>
      </div>

      {/* Summary card */}
      <div className="flex items-center gap-4 p-4 bh-card mb-8">
        <div
          className="w-10 h-10 rounded flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: "#fff", border: "1px solid var(--surface-border)" }}
        >
          <img src={company.logoUrl} alt={company.name} className="w-7 h-7 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (company.fallbackLogoUrl && target.src !== company.fallbackLogoUrl) {
                target.src = company.fallbackLogoUrl
              } else {
                target.style.display = "none"
                target.parentElement!.innerHTML = `<span style="color:#0033A1" class="font-bold">${company.name[0]}</span>`
              }
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{person.name}</p>
          <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
            {person.title.includes(company.name) ? person.title : `${person.title} · ${company.name}`}
          </p>
        </div>
      </div>

      {/* Meeting type options */}
      <div className="flex flex-col gap-2 mb-6">
        {meetingTypes.map((mt) => {
          const Icon = iconMap[mt.icon] || MessageCircle
          const isSelected = selected === mt.id
          return (
            <button
              key={mt.id}
              onClick={() => setSelected(mt.id)}
              className="text-left px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors"
              style={{
                background: isSelected ? "var(--boeing-ice)" : "var(--bg-card)",
                border: `1px solid ${isSelected ? "var(--boeing-blue)" : "var(--surface-border)"}`,
                borderRadius: "var(--radius)",
              }}
            >
              <div
                className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                style={{ background: isSelected ? "var(--boeing-blue)" : "var(--bg-muted)" }}
              >
                <Icon size={18} style={{ color: isSelected ? "#fff" : "var(--text-muted)" }} />
              </div>
              <div>
                <span
                  className="block font-semibold text-sm"
                  style={{ color: isSelected ? "var(--boeing-blue)" : "var(--text-primary)" }}
                >
                  {mt.label}
                </span>
                <span className="block text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{mt.subtitle}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Other text input */}
      {selected === "other" && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          placeholder="Describe the meeting..."
          className="w-full h-12 px-4 rounded mb-6 outline-none transition-colors text-sm"
          style={{ background: "var(--bg-input)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--boeing-blue)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 51, 161, 0.12)" }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none" }}
        />
      )}

      {/* Submit */}
      <Button
        variant="primary"
        className="w-full"
        disabled={!canSubmit}
        onClick={() => canSubmit && onSubmit(finalType)}
      >
        Prepare the briefing
      </Button>
    </div>
  )
}
