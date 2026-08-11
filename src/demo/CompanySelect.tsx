import { useMemo, useState } from "react"
import { companies, regions, type Company } from "../data/companies"
import { Check, ChevronDown, MapPin } from "lucide-react"
import { CompanySearch } from "./CompanySearch"

interface Props {
  onSelect: (company: Company) => void
}

export function CompanySelect({ onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [activeRegion, setActiveRegion] = useState(regions[0].id)
  const [expandedCountry, setExpandedCountry] = useState<string | null>("singapore")

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

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="system-badge system-badge--dark mb-3">Step 01 &middot; Organization</p>
        <h2
          className="text-3xl md:text-[2.1rem] font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
        >
          Who are you meeting?
        </h2>
        <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
          Organised by Boeing Global regions — Southeast Asia first — then country and ministry or airline.
        </p>
      </div>

      {/* Region tabs */}
      <div className="max-w-4xl mx-auto mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {regions.map((r) => {
            const active = r.id === activeRegion
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setActiveRegion(r.id)
                  setExpandedCountry(r.countries[0]?.id ?? null)
                }}
                className="px-4 py-2 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
                style={{
                  background: active ? "var(--boeing-navy)" : "var(--bg-card)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${active ? "var(--boeing-navy)" : "var(--surface-border)"}`,
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {r.name}
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="max-w-4xl mx-auto mb-8 px-4 py-3 flex items-start gap-3"
        style={{
          background: "linear-gradient(120deg, var(--boeing-ice) 0%, #fff 55%, rgba(227,239,250,0.5) 100%)",
          border: "1px solid var(--surface-border)",
          borderRadius: "var(--radius)",
        }}
      >
        <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--boeing-blue)" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--boeing-navy)" }}>
            {region.name}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {region.blurb}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {region.countries.map((country) => {
          const orgs = byCountry.get(country.id) ?? []
          const open = expandedCountry === country.id
          const hasOrgs = orgs.length > 0

          return (
            <div
              key={country.id}
              style={{
                border: "1px solid var(--surface-border)",
                borderRadius: "var(--radius)",
                background: "var(--bg-card)",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setExpandedCountry(open ? null : country.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                style={{ background: open ? "var(--boeing-ice)" : "transparent" }}
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {country.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.08em] mt-0.5" style={{ color: "var(--boeing-cyan)" }}>
                    {country.ministryHint}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {hasOrgs ? `${orgs.length} partner${orgs.length === 1 ? "" : "s"}` : "Use lookup"}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {orgs.map((company) => {
                        const isSelected = selected === company.id
                        return (
                          <button
                            key={company.id}
                            onClick={() => handleClick(company)}
                            className="relative flex items-start gap-3.5 p-4 text-left cursor-pointer transition-colors"
                            style={{
                              border: `1px solid ${isSelected ? "var(--boeing-blue)" : "var(--surface-border)"}`,
                              borderRadius: "var(--radius-sm)",
                              background: isSelected ? "var(--boeing-ice)" : "#fff",
                            }}
                          >
                            <div
                              className="w-11 h-11 rounded flex items-center justify-center overflow-hidden flex-shrink-0"
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
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="text-[14px] font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                                {company.name}
                              </h3>
                              {company.industry && (
                                <p className="text-[10px] uppercase tracking-[0.1em] mt-1" style={{ color: "var(--boeing-cyan)" }}>
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
                  ) : (
                    <p className="px-2 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      No seeded partners for {country.name} in this demo. Use partner lookup below for airlines and ministries across Boeing Global.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 my-8 max-w-4xl mx-auto">
        <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
        <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
          or look up a Boeing partner
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
      </div>

      <div className="max-w-4xl mx-auto">
        <CompanySearch onSelect={onSelect} />
      </div>
    </div>
  )
}
