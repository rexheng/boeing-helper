import { useMemo, useState } from "react"
import {
  companies,
  getPartnerById,
  partnerToCompany,
  regions,
  type Company,
} from "../data/companies"
import { Check, ChevronDown } from "lucide-react"
import { CompanySearch } from "./CompanySearch"

interface Props {
  onSelect: (company: Company) => void
}

const visibleRegions = regions.filter((r) => companies.some((c) => c.regionId === r.id))

export function CompanySelect({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [activeRegion, setActiveRegion] = useState(visibleRegions[0]?.id ?? regions[0].id)
  const [expandedCountry, setExpandedCountry] = useState<string | null>("singapore")
  const [lookupQuery, setLookupQuery] = useState("")

  const region = visibleRegions.find((r) => r.id === activeRegion) ?? visibleRegions[0]

  const countriesWithPartners = useMemo(
    () =>
      region.countries.filter((country) =>
        companies.some((c) => c.regionId === region.id && c.country === country.id),
      ),
    [region],
  )

  const byCountry = useMemo(() => {
    const map = new Map<string, Company[]>()
    for (const c of companies.filter((co) => co.regionId === activeRegion)) {
      const list = map.get(c.country) ?? []
      list.push(c)
      map.set(c.country, list)
    }
    return map
  }, [activeRegion])

  const selectedCompany = useMemo(() => {
    if (!selected) return null
    const known = companies.find((c) => c.id === selected)
    if (known) return known
    const partner = getPartnerById(selected)
    return partner ? partnerToCompany(partner) : null
  }, [selected])

  const commit = (company: Company) => {
    setSelected(company.id)
    setActiveRegion(company.regionId)
    setExpandedCountry(company.country)
    onSelect(company)
  }

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-6">
        <p className="system-badge system-badge--dark mb-3">Step 01 &middot; Organization</p>
        <h2
          className="text-3xl md:text-[2.1rem] font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          Who are you meeting?
        </h2>
        <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
          Start in Southeast Asia, or open another Boeing region — then pick the ministry or airline.
        </p>
      </div>

      {selectedCompany && (
        <div
          className="max-w-4xl mx-auto mb-4 px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: "var(--boeing-ice)", border: "1px solid var(--boeing-blue)" }}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--boeing-blue)" }}>
              Selected organization
            </p>
            <p className="text-[15px] font-semibold truncate" style={{ color: "var(--boeing-navy)" }}>
              {selectedCompany.name}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {selectedCompany.countryName} · {selectedCompany.industry}
            </p>
          </div>
          <Check size={18} style={{ color: "var(--boeing-blue)" }} />
        </div>
      )}

      {/* SEA-emphasized region rail */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex flex-wrap gap-2">
          {visibleRegions.map((r) => {
            const active = r.id === activeRegion
            const isSea = r.id === "southeast-asia"
            const count = companies.filter((c) => c.regionId === r.id).length
            return (
              <button
                key={r.id}
                type="button"
                aria-selected={active}
                onClick={() => {
                  setActiveRegion(r.id)
                  const first = r.countries.find((c) =>
                    companies.some((co) => co.regionId === r.id && co.country === c.id),
                  )
                  setExpandedCountry(first?.id ?? null)
                }}
                className="cursor-pointer px-3.5 py-2 text-[13px] font-semibold"
                style={{
                  background: active ? "var(--boeing-navy)" : "#fff",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${active ? "var(--boeing-navy)" : "var(--surface-border)"}`,
                  fontSize: isSea ? 14 : 13,
                  paddingInline: isSea ? 18 : 14,
                }}
              >
                {r.name}
                <span
                  className="ml-1.5 text-[11px] font-medium tabular-nums"
                  style={{ color: active ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {region.blurb}
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        {countriesWithPartners.map((country) => {
          const orgs = byCountry.get(country.id) ?? []
          const open = expandedCountry === country.id

          return (
            <div key={country.id} style={{ borderBottom: "1px solid var(--surface-border)" }}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpandedCountry(open ? null : country.id)}
                className="w-full flex items-center justify-between gap-3 px-1 py-3 text-left cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {country.name}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {country.ministryHint}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {orgs.length} partner{orgs.length === 1 ? "" : "s"}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: "var(--text-muted)",
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </div>
              </button>

              {open && (
                <div className="pb-3 space-y-1">
                  {orgs.map((company) => {
                    const isSelected = selected === company.id
                    return (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => commit(company)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 text-left cursor-pointer"
                        style={{
                          background: isSelected ? "var(--boeing-ice)" : "transparent",
                          borderLeft: `3px solid ${isSelected ? "var(--boeing-blue)" : "transparent"}`,
                        }}
                      >
                        <div
                          className="w-9 h-9 flex items-center justify-center overflow-hidden flex-shrink-0"
                          style={{ background: "#fff", border: "1px solid var(--surface-border)" }}
                        >
                          <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="w-6 h-6 object-contain"
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
                            className="w-6 h-6 items-center justify-center font-bold text-sm"
                            style={{ display: "none", color: "#0033A1" }}
                            aria-hidden
                          >
                            {company.name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[14px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                              {company.name}
                            </h3>
                            {isSelected && <Check size={14} style={{ color: "var(--boeing-blue)" }} />}
                          </div>
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {company.industry}
                          </p>
                          <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                            {company.tagline}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="max-w-4xl mx-auto">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--text-muted)" }}>
          Search another partner
        </p>
        <CompanySearch
          onSelect={commit}
          selectedId={selected}
          query={lookupQuery}
          onQueryChange={setLookupQuery}
        />
      </div>
    </div>
  )
}
