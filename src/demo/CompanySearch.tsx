import { useMemo } from "react"
import { Search, Check } from "lucide-react"
import {
  searchPartnerDirectory,
  partnerToCompany,
  regions,
  type Company,
  type PartnerLookupEntry,
} from "../data/companies"

function regionsLabel(regionId: string) {
  return regions.find((r) => r.id === regionId)?.name ?? regionId
}

interface Props {
  onSelect: (company: Company) => void
  selectedId?: string | null
  query: string
  onQueryChange: (q: string) => void
}

export function CompanySearch({ onSelect, selectedId = null, query, onQueryChange }: Props) {
  const results = useMemo(() => {
    const q = query.trim()
    if (q.length < 2) return [] as PartnerLookupEntry[]
    return searchPartnerDirectory(q).slice(0, 8)
  }, [query])

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search airline, ministry, or country"
          className="w-full h-12 px-4 pl-10 outline-none transition-colors text-sm"
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

      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm py-2" style={{ color: "var(--text-secondary)" }}>
          No partners matched “{query.trim()}”.
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
                onClick={() => onSelect(company)}
                className="relative w-full flex items-center gap-3 px-3 py-3 text-left cursor-pointer"
                style={{
                  border: `1px solid ${isSelected ? "var(--boeing-blue)" : "var(--surface-border)"}`,
                  background: isSelected ? "var(--boeing-ice)" : "var(--bg-card)",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ background: "#fff", border: "1px solid var(--surface-border)" }}
                >
                  <img
                    src={company.logoUrl}
                    alt=""
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (company.fallbackLogoUrl && !target.dataset.fallback) {
                        target.dataset.fallback = "1"
                        target.src = company.fallbackLogoUrl
                      } else {
                        target.style.display = "none"
                        const sibling = target.nextElementSibling as HTMLElement | null
                        if (sibling) sibling.style.display = "flex"
                      }
                    }}
                  />
                  <span
                    className="w-7 h-7 items-center justify-center font-bold text-sm"
                    style={{ display: "none", color: "#0033A1" }}
                    aria-hidden
                  >
                    {company.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>
                      {entry.name}
                    </h3>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {entry.countryName}
                    </span>
                  </div>
                  <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                    {entry.industry}
                    {" · "}
                    {regionsLabel(entry.regionId)}
                  </p>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
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
