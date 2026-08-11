import { useMemo, useState } from "react"
import { companies, regions, type Company } from "../data/companies"
import { Check, ChevronDown } from "lucide-react"
import { CompanySearch } from "./CompanySearch"

interface Props {
  onSelect: (company: Company) => void
}

export function CompanySelect({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [activeRegion, setActiveRegion] = useState(regions[0].id)
  const [expandedCountry, setExpandedCountry] = useState<string | null>("singapore")
  const [lookupSeed, setLookupSeed] = useState("")

  const region = regions.find((r) => r.id === activeRegion) ?? regions[0]

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
          Choose a region, open a country, then pick the ministry or airline you are meeting.
        </p>
      </div>

      {/* Region index */}
      <div className="max-w-4xl mx-auto mb-4 overflow-x-auto">
        <div className="flex gap-0 min-w-max" style={{ border: "1px solid var(--surface-border)" }}>
          {regions.map((r, i) => {
            const active = r.id === activeRegion
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setActiveRegion(r.id)
                  const firstWithPartners = r.countries.find((c) =>
                    companies.some((co) => co.regionId === r.id && co.country === c.id),
                  )
                  setExpandedCountry(firstWithPartners?.id ?? r.countries[0]?.id ?? null)
                  setLookupSeed("")
                }}
                className="px-3.5 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap"
                style={{
                  background: active ? "var(--boeing-navy)" : "#fff",
                  color: active ? "#fff" : "var(--text-secondary)",
                  borderLeft: i === 0 ? "none" : "1px solid var(--surface-border)",
                }}
              >
                {r.name}
              </button>
            )
          })}
        </div>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {region.blurb}
        </p>
      </div>

      {/* Lookup equal path near top */}
      <div className="max-w-4xl mx-auto mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "var(--text-muted)" }}>
          Or search any Boeing partner
        </p>
        <CompanySearch
          onSelect={handleLookupSelect}
          selectedId={selected}
          initialQuery={lookupSeed}
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-2">
        {region.countries.map((country) => {
          const orgs = byCountry.get(country.id) ?? []
          const open = expandedCountry === country.id
          const hasOrgs = orgs.length > 0

          return (
            <div
              key={country.id}
              style={{
                border: "1px solid var(--surface-border)",
                background: "var(--bg-card)",
              }}
            >
              <button
                type="button"
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
                    {hasOrgs ? `${orgs.length} partner${orgs.length === 1 ? "" : "s"}` : "Lookup"}
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
                  {hasOrgs ? (
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
                              <p className="text-[12px] mt-1 line-clamp-2 leading-snug" style={{ color: "var(--text-secondary)" }}>
                                {company.tagline}
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
                  ) : (
                    <div className="px-1 py-2 space-y-2">
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        No seeded partners for {country.name}. Search the partner directory for ministries and airlines.
                      </p>
                      <button
                        type="button"
                        className="text-xs font-semibold cursor-pointer"
                        style={{ color: "var(--boeing-blue)" }}
                        onClick={() => setLookupSeed(country.name)}
                      >
                        Search partners in {country.name} ↓
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
