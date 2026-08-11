import { useState } from "react"
import { companies, type Company } from "../data/companies"
import { Check } from "lucide-react"
import { CompanySearch } from "./CompanySearch"

interface Props {
  onSelect: (company: Company) => void
}

export function CompanySelect({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (company: Company) => {
    setSelected(company.id)
    onSelect(company)
  }

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="system-badge system-badge--dark mb-3">Step 01 &middot; Organization</p>
        <h2
          className="text-3xl md:text-[2.1rem] font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          Who are you meeting?
        </h2>
        <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
          Select the organization on your air-show schedule. Boeing Helper builds the delegation
          background, programme status, and talking points from there.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {companies.map((company) => {
          const isSelected = selected === company.id
          return (
            <button
              key={company.id}
              onClick={() => handleClick(company)}
              className="relative flex items-start gap-4 p-5 glass-card text-left cursor-pointer"
              style={isSelected ? { borderColor: "var(--boeing-blue)", background: "var(--boeing-ice)" } : undefined}
            >
              {/* Logo */}
              <div
                className="w-12 h-12 rounded flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ background: "#fff", border: "1px solid var(--surface-border)" }}
              >
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (company.fallbackLogoUrl && target.src !== company.fallbackLogoUrl) {
                      target.src = company.fallbackLogoUrl
                    } else {
                      target.style.display = "none"
                      target.parentElement!.innerHTML = `<span style="color:#0033A1" class="font-bold text-lg">${company.name[0]}</span>`
                    }
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 pr-5">
                <h3
                  className="text-[15px] font-semibold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {company.name}
                </h3>
                {company.industry && (
                  <p
                    className="text-[10px] uppercase tracking-[0.1em] mt-1"
                    style={{ color: "var(--boeing-cyan)" }}
                  >
                    {company.industry}
                  </p>
                )}
                <p className="text-xs leading-snug mt-1.5 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                  {company.tagline}
                </p>
              </div>

              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--boeing-blue)" }}
                >
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8 max-w-2xl mx-auto">
        <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
        <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
          or look up another organization
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
      </div>

      {/* Custom company search */}
      <div className="max-w-2xl mx-auto">
        <CompanySearch onSelect={onSelect} />
      </div>
    </div>
  )
}
