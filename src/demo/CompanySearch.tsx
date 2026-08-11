import { useState, useCallback, useMemo } from "react"
import { Search, Check } from "lucide-react"
import {
  searchPartnerDirectory,
  partnerToCompany,
  type Company,
  type PartnerLookupEntry,
} from "../data/companies"

interface Props {
  onSelect: (company: Company) => void
}

export function CompanySearch({ onSelect }: Props) {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const results = useMemo(() => {
    if (!searched || !query.trim()) return [] as PartnerLookupEntry[]
    return searchPartnerDirectory(query).slice(0, 8)
  }, [query, searched])

  const runSearch = useCallback(() => {
    if (!query.trim()) return
    setSearched(true)
    setSelectedId(null)
  }, [query])

  const handlePick = (entry: PartnerLookupEntry) => {
    setSelectedId(entry.id)
    onSelect(partnerToCompany(entry))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearched(false)
            }}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search partners — Emirates, Qantas, Korean Air, MINDEF…"
            className="w-full h-12 px-4 pl-10 rounded outline-none transition-colors text-sm"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--surface-border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--boeing-blue)"
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 51, 161, 0.12)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--surface-border)"
              e.currentTarget.style.boxShadow = "none"
            }}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>
        <button
          type="button"
          onClick={runSearch}
          disabled={!query.trim()}
          className="h-12 px-6 rounded-full text-sm font-medium uppercase tracking-[0.08em] text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          style={{ background: "var(--boeing-blue)", opacity: !query.trim() ? 0.4 : 1 }}
        >
          Search
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Looks up a curated Boeing partner directory (airlines, ministries, air forces) — no live web scrape.
      </p>

      {searched && results.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: "var(--text-secondary)" }}>
          No partners matched “{query.trim()}”. Try an airline, ministry, or country name.
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((entry) => {
            const company = partnerToCompany(entry)
            const isSelected = selectedId === entry.id
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => handlePick(entry)}
                className="relative w-full flex items-start gap-4 p-4 text-left cursor-pointer transition-colors"
                style={{
                  border: `1px solid ${isSelected ? "var(--boeing-blue)" : "var(--surface-border)"}`,
                  borderRadius: "var(--radius)",
                  background: isSelected ? "var(--boeing-ice)" : "var(--bg-card)",
                  animation: "fadeInUp 0.3s ease-out",
                }}
              >
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
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>
                      {entry.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--boeing-cyan)" }}>
                      {entry.countryName}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {entry.tagline}
                  </p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {entry.overview}
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
      )}
    </div>
  )
}
