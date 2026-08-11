export interface Company {
  id: string
  name: string
  domain: string
  tagline: string
  logoUrl: string
  fallbackLogoUrl?: string
  isCustom?: boolean
  overview?: string
  industry?: string
}

export const companies: Company[] = [
  {
    id: "mindef-sg",
    name: "Ministry of Defence Singapore",
    domain: "mindef.gov.sg",
    tagline: "RSAF fifth-generation transition — 20 F-35A/B on order, P-8A Poseidon inducting early 2030s, AH-64D life extension",
    logoUrl: "https://www.google.com/s2/favicons?domain=mindef.gov.sg&sz=128",
    industry: "Defence & National Security",
  },
  {
    id: "mod-id",
    name: "Ministry of Defense of Indonesia",
    domain: "kemhan.go.id",
    tagline: "Kemhan RI under Prabowo's defence build-up — Rafale inductions, Apache sustainment, offsets and local content non-negotiable",
    logoUrl: "https://www.google.com/s2/favicons?domain=kemhan.go.id&sz=128",
    industry: "Defence & National Security",
  },
  {
    id: "rtaf",
    name: "Royal Thai Air Force",
    domain: "rtaf.mi.th",
    tagline: "Gripen E/F squadron replacing 37-year-old F-16A/Bs — Peace Burapha phases, heavy offset expectations, ageing C-130H fleet",
    logoUrl: "https://www.google.com/s2/favicons?domain=rtaf.mi.th&sz=128",
    industry: "Defence & National Security",
  },
  {
    id: "rmaf",
    name: "Royal Malaysian Air Force",
    domain: "airforce.mil.my",
    tagline: "CAP55 fleet renewal — 18 FA-50M arriving from October, C-130H replacement study open, MRCA decision pushed past 2034",
    logoUrl: "https://www.google.com/s2/favicons?domain=airforce.mil.my&sz=128",
    industry: "Defence & National Security",
  },
  {
    id: "sia",
    name: "Singapore Airlines",
    domain: "singaporeair.com",
    tagline: "31 Boeing 777-9s on order with first delivery slipping past FY2026-27 — early talks for 50+ more widebodies",
    logoUrl: "https://www.google.com/s2/favicons?domain=singaporeair.com&sz=128",
    industry: "Commercial Aviation",
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    domain: "garuda-indonesia.com",
    tagline: "Recovery to 68 serviceable aircraft, 50-jet Boeing commitment under the US-Indonesia trade deal, Citilink-Pelita merger",
    logoUrl: "https://www.google.com/s2/favicons?domain=garuda-indonesia.com&sz=128",
    industry: "Commercial Aviation",
  },
  {
    id: "vietnam-caa",
    name: "Civil Aviation Authority of Vietnam",
    domain: "caa.gov.vn",
    tagline: "Regulator for Southeast Asia's fastest-growing market — 737 MAX ramp from 2030, Long Thanh opening, ICAO capacity build-out",
    logoUrl: "https://www.google.com/s2/favicons?domain=caa.gov.vn&sz=128",
    industry: "Civil Aviation Regulation",
  },
  {
    id: "paf",
    name: "Philippine Air Force",
    domain: "paf.mil.ph",
    tagline: "Flight Plan 2040 — 36 multirole fighters sought against a stalled budget, ScanEagle ISR, archipelagic defence pivot",
    logoUrl: "https://www.google.com/s2/favicons?domain=paf.mil.ph&sz=128",
    industry: "Defence & National Security",
  },
]
