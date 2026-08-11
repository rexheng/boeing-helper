import { useMemo, useState } from "react"
import { companies, regions, type Company } from "../data/companies"
import { Check, ChevronDown } from "lucide-react"
import { CompanySearch } from "./CompanySearch"

interface Props {
  onSelect: (company: Company) => void
}

/** Regions that have at least one seeded company — honest IA for the demo. */
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

  const handleClick = (company: Company) => {
    setSelected(company.id)
    onSelect(company)
  }

  const handleLookupSelect = (company: Company) => {
    setSelected(company.id)
    onSelect(company)
  }

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-7">
        <p className="system-badge system-badge--dark mb-3">Step 01 &middot; Organization</p>
        <h2
          className="text-3xl md:text-[2.1rem] font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          Who are you meeting?
        </h2>
        <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
          Start with a Boeing region, open a country, then pick the ministry or airline.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-4 overflow-x-auto">
        <div className="flex gap-0 min-w-max" style={{ border: "1px solid var(--surface-border)" }} role="tablist">
          {visibleRegions.map((r, i) => {
            const active = r.id === activeRegion
            const count = companies.filter((c) => c.regionId === r.id).length
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveRegion(r.id)
                  const first = r.countries.find((c) =>
                    companies.some((co) => co.regionId === r.id && co.country === c.id),
                  )
                  setExpandedCountry(first?.id ?? null)
                }}
                className="px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap"
                style={{
                  background: active ? "var(--boeing-navy)" : "#fff",
                  color: active ? "#fff" : "var(--text-secondary)",
                  borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)",
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

      <div className="max-w-4xl mx-auto space-y-2 mb-6">
        {countriesWithPartners.map((country) => {
          const orgs = byCountry.get(country.id) ?? []
          const open = expandedCountry === country.id

          return (
            <div
              key={country.id}
              style={{ border: "1px solid var(--surface-border)", background: "var(--bg-card)" }}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpandedCountry(open ? null : country.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer"
                style={{ background: open ? "var(--boeing-ice)" : "transparent" }}
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
                <div className="px-3 pb-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {orgs.map((company) => {
                      const isSelected = selected === company.id
                      return (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => handleClick(company)}
                          className="relative flex items-center gap-3 px-3 py-3 text-left cursor-pointer"
                          style={{
                            border: `1px solid ${isSelected ? "var(--boeing-blue)" : "var(--surface-border)"}`,
                            background: isSelected ? "var(--boeing-ice)" : "#fff",
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
                                  target.parentElement!.innerHTML = `<span style="color:#0033A1" class="font-bold text-base">${company.name[0]}</span>`
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-5">
                            <h3 className="text-[14px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                              {company.name}
                            </h3>
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                              {company.industry}
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
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
          <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
            Or search another partner
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
        </div>
        <CompanySearch
          onSelect={handleLookupSelect}
          selectedId={selected}
          query={lookupQuery}
          onQueryChange={setLookupQuery}
        />
      </div>
    </div>
  )
}
