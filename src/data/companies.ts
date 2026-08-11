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
  /** ISO-ish country key for regional grouping */
  country: string
  countryName: string
  /** Boeing Global region (SEA first in UI) */
  regionId: string
}

export interface RegionGroup {
  id: string
  name: string
  blurb: string
  /** Country sections in display order */
  countries: { id: string; name: string; ministryHint: string }[]
}

/**
 * Demo regional index — Asia-Pacific + Middle East partners with curated data.
 * Southeast Asia is first. Only regions/countries with seeded partners are listed.
 */
export const regions: RegionGroup[] = [
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    blurb: "Boeing SEA hub in Singapore — commercial growth and defence partnerships across ASEAN.",
    countries: [
      { id: "singapore", name: "Singapore", ministryHint: "MINDEF · Singapore Airlines" },
      { id: "indonesia", name: "Indonesia", ministryHint: "Kemhan RI · Garuda Indonesia" },
      { id: "malaysia", name: "Malaysia", ministryHint: "Royal Malaysian Air Force" },
      { id: "thailand", name: "Thailand", ministryHint: "Royal Thai Air Force" },
      { id: "vietnam", name: "Vietnam", ministryHint: "Civil Aviation Authority of Vietnam" },
      { id: "philippines", name: "Philippines", ministryHint: "Philippine Air Force" },
    ],
  },
  {
    id: "northeast-asia",
    name: "Northeast Asia",
    blurb: "Japan and Republic of Korea — mature fleets, industrial partnerships, and alliance sustainment.",
    countries: [
      { id: "japan", name: "Japan", ministryHint: "Japan Airlines" },
      { id: "korea", name: "Republic of Korea", ministryHint: "Korean Air" },
    ],
  },
  {
    id: "india",
    name: "India",
    blurb: "New Delhi HQ with Bengaluru engineering depth — Make-in-India defence and commercial fleet rebuild.",
    countries: [
      { id: "india", name: "India", ministryHint: "Air India" },
    ],
  },
  {
    id: "anz",
    name: "Australia & New Zealand",
    blurb: "Australia–NZ–South Pacific hub — defence cooperation and airline fleet renewals.",
    countries: [
      { id: "australia", name: "Australia", ministryHint: "Department of Defence · Qantas" },
    ],
  },
  {
    id: "middle-east",
    name: "Middle East",
    blurb: "Dubai and Doha presence — airline hubs, defence readiness, and distribution centres.",
    countries: [
      { id: "uae", name: "United Arab Emirates", ministryHint: "Emirates" },
      { id: "qatar", name: "Qatar", ministryHint: "Qatar Airways" },
    ],
  },
]

const LOGO = (id: string) => `/logos/${id}.png`
const LOGO_DEV = (domain: string) =>
  `https://img.logo.dev/${domain}?token=pk_QufBYgm5Q2u3paTKjIOIdw&size=128&format=png`

export const companies: Company[] = [
  // —— Southeast Asia ——
  {
    id: "mindef-sg",
    name: "Ministry of Defence Singapore",
    domain: "mindef.gov.sg",
    tagline: "RSAF fifth-generation transition — 20 F-35A/B on order, P-8A Poseidon inducting early 2030s, AH-64D life extension",
    logoUrl: LOGO("mindef-sg"),
    fallbackLogoUrl: LOGO_DEV("mindef.gov.sg"),
    industry: "Defence & National Security",
    country: "singapore",
    countryName: "Singapore",
    regionId: "southeast-asia",
  },
  {
    id: "sia",
    name: "Singapore Airlines",
    domain: "singaporeair.com",
    tagline: "31 Boeing 777-9s on order with first delivery slipping past FY2026-27 — early talks for 50+ more widebodies",
    logoUrl: LOGO("sia"),
    fallbackLogoUrl: LOGO_DEV("singaporeair.com"),
    industry: "Commercial Aviation",
    country: "singapore",
    countryName: "Singapore",
    regionId: "southeast-asia",
  },
  {
    id: "mod-id",
    name: "Ministry of Defense of Indonesia",
    domain: "kemhan.go.id",
    tagline: "Kemhan RI under Prabowo's defence build-up — Rafale inductions, Apache sustainment, offsets and local content non-negotiable",
    logoUrl: LOGO("mod-id"),
    fallbackLogoUrl: LOGO_DEV("kemhan.go.id"),
    industry: "Defence & National Security",
    country: "indonesia",
    countryName: "Indonesia",
    regionId: "southeast-asia",
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    domain: "garuda-indonesia.com",
    tagline: "Recovery to 68 serviceable aircraft, 50-jet Boeing commitment under the US-Indonesia trade deal, Citilink-Pelita merger",
    logoUrl: LOGO("garuda"),
    fallbackLogoUrl: LOGO_DEV("garuda-indonesia.com"),
    industry: "Commercial Aviation",
    country: "indonesia",
    countryName: "Indonesia",
    regionId: "southeast-asia",
  },
  {
    id: "rmaf",
    name: "Royal Malaysian Air Force",
    domain: "airforce.mil.my",
    tagline: "CAP55 fleet renewal — 18 FA-50M arriving from October, C-130H replacement study open, MRCA decision pushed past 2034",
    logoUrl: LOGO("rmaf"),
    fallbackLogoUrl: LOGO_DEV("airforce.mil.my"),
    industry: "Defence & National Security",
    country: "malaysia",
    countryName: "Malaysia",
    regionId: "southeast-asia",
  },
  {
    id: "rtaf",
    name: "Royal Thai Air Force",
    domain: "rtaf.mi.th",
    tagline: "Gripen E/F squadron replacing 37-year-old F-16A/Bs — Peace Burapha phases, heavy offset expectations, ageing C-130H fleet",
    logoUrl: LOGO("rtaf"),
    fallbackLogoUrl: LOGO_DEV("rtaf.mi.th"),
    industry: "Defence & National Security",
    country: "thailand",
    countryName: "Thailand",
    regionId: "southeast-asia",
  },
  {
    id: "vietnam-caa",
    name: "Civil Aviation Authority of Vietnam",
    domain: "caa.gov.vn",
    tagline: "Regulator for Southeast Asia's fastest-growing market — 737 MAX ramp from 2030, Long Thanh opening, ICAO capacity build-out",
    logoUrl: LOGO("vietnam-caa"),
    fallbackLogoUrl: LOGO_DEV("caa.gov.vn"),
    industry: "Civil Aviation Regulation",
    country: "vietnam",
    countryName: "Vietnam",
    regionId: "southeast-asia",
  },
  {
    id: "paf",
    name: "Philippine Air Force",
    domain: "paf.mil.ph",
    tagline: "Flight Plan 2040 — 36 multirole fighters sought against a stalled budget, ScanEagle ISR, archipelagic defence pivot",
    logoUrl: LOGO("paf"),
    fallbackLogoUrl: LOGO_DEV("paf.mil.ph"),
    industry: "Defence & National Security",
    country: "philippines",
    countryName: "Philippines",
    regionId: "southeast-asia",
  },

  // —— Northeast Asia ——
  {
    id: "jal",
    name: "Japan Airlines",
    domain: "jal.co.jp",
    tagline: "JAL — 787 backbone and next-decade twin-aisle planning",
    logoUrl: LOGO("jal"),
    fallbackLogoUrl: LOGO_DEV("jal.co.jp"),
    industry: "Commercial Aviation",
    country: "japan",
    countryName: "Japan",
    regionId: "northeast-asia",
  },
  {
    id: "korean-air",
    name: "Korean Air",
    domain: "koreanair.com",
    tagline: "KE — 777-9 and 787 orders; Asiana integration underway",
    logoUrl: LOGO("korean-air"),
    fallbackLogoUrl: LOGO_DEV("koreanair.com"),
    industry: "Commercial Aviation",
    country: "korea",
    countryName: "Republic of Korea",
    regionId: "northeast-asia",
  },

  // —— India ——
  {
    id: "air-india",
    name: "Air India",
    domain: "airindia.com",
    tagline: "AI — historic Boeing order and network rebuild under Tata",
    logoUrl: LOGO("air-india"),
    fallbackLogoUrl: LOGO_DEV("airindia.com"),
    industry: "Commercial Aviation",
    country: "india",
    countryName: "India",
    regionId: "india",
  },

  // —— ANZ ——
  {
    id: "qantas",
    name: "Qantas",
    domain: "qantas.com",
    tagline: "QF — Project Sunrise and 787 ultra-long-haul operations",
    logoUrl: LOGO("qantas"),
    fallbackLogoUrl: LOGO_DEV("qantas.com"),
    industry: "Commercial Aviation",
    country: "australia",
    countryName: "Australia",
    regionId: "anz",
  },
  {
    id: "mod-australia",
    name: "Australian Department of Defence",
    domain: "defence.gov.au",
    tagline: "Defence Australia — P-8A, E-7, and Growler enterprise",
    logoUrl: LOGO("mod-australia"),
    fallbackLogoUrl: LOGO_DEV("defence.gov.au"),
    industry: "Defence & National Security",
    country: "australia",
    countryName: "Australia",
    regionId: "anz",
  },

  // —— Middle East ——
  {
    id: "emirates",
    name: "Emirates",
    domain: "emirates.com",
    tagline: "Dubai mega-hub — 777X launch customer and widebody backbone",
    logoUrl: LOGO("emirates"),
    fallbackLogoUrl: LOGO_DEV("emirates.com"),
    industry: "Commercial Aviation",
    country: "uae",
    countryName: "United Arab Emirates",
    regionId: "middle-east",
  },
  {
    id: "qatar-airways",
    name: "Qatar Airways",
    domain: "qatarairways.com",
    tagline: "Doha hub — 777-9 and 787 fleet growth",
    logoUrl: LOGO("qatar-airways"),
    fallbackLogoUrl: LOGO_DEV("qatarairways.com"),
    industry: "Commercial Aviation",
    country: "qatar",
    countryName: "Qatar",
    regionId: "middle-east",
  },
]

/** Hardcoded Boeing partner directory for lookup (no live Manus fetch). */
export interface PartnerContact {
  id: string
  name: string
  title: string
  headline: string
  seniority?: string
  photoUrl?: string
  linkedinUrl?: string
}

export interface PartnerLookupEntry {
  id: string
  name: string
  domain: string
  tagline: string
  overview: string
  industry: string
  country: string
  countryName: string
  regionId: string
  aliases: string[]
  contacts: PartnerContact[]
}

export const partnerDirectory: PartnerLookupEntry[] = [
  {
    id: "mindef-sg",
    name: "Ministry of Defence Singapore",
    domain: "mindef.gov.sg",
    tagline: "RSAF fifth-generation transition — F-35, P-8A, Apache and Chinook programmes",
    overview:
      "MINDEF directs the Singapore Armed Forces and RSAF. Acquisition runs through DSTA. Core Boeing touchpoints: AH-64D, CH-47, and the P-8A maritime patrol pathway.",
    industry: "Defence & National Security",
    country: "singapore",
    countryName: "Singapore",
    regionId: "southeast-asia",
    aliases: ["mindef", "singapore defence", "rsaf", "dsta", "ministry of defence singapore"],
    contacts: [],
  },
  {
    id: "sia",
    name: "Singapore Airlines",
    domain: "singaporeair.com",
    tagline: "Flag carrier — 777-9 order book and widebody renewal",
    overview:
      "SIA Group operates Singapore Airlines and Scoot. Boeing relationship centres on 777-9 deliveries, 787 operations, and SIA Engineering MRO capacity at Changi.",
    industry: "Commercial Aviation",
    country: "singapore",
    countryName: "Singapore",
    regionId: "southeast-asia",
    aliases: ["sia", "singapore airlines", "scoot"],
    contacts: [],
  },
  {
    id: "mod-id",
    name: "Ministry of Defense of Indonesia",
    domain: "kemhan.go.id",
    tagline: "Kemhan RI — procurement discipline, offsets, Apache sustainment",
    overview:
      "Indonesia's defence ministry under Prabowo is centralising procurement. Boeing engagement focuses on Apache sustainment, industrial offsets, and long-cycle platform discussions.",
    industry: "Defence & National Security",
    country: "indonesia",
    countryName: "Indonesia",
    regionId: "southeast-asia",
    aliases: ["kemhan", "indonesia defence", "mod indonesia", "tni au"],
    contacts: [],
  },
  {
    id: "garuda",
    name: "Garuda Indonesia",
    domain: "garuda-indonesia.com",
    tagline: "National carrier turnaround — 50-jet Boeing commitment",
    overview:
      "Garuda is rebuilding utilisation while Danantara holds the sovereign stake behind a 50-aircraft Boeing commitment tied to US–Indonesia trade terms.",
    industry: "Commercial Aviation",
    country: "indonesia",
    countryName: "Indonesia",
    regionId: "southeast-asia",
    aliases: ["garuda", "garuda indonesia", "citilink", "danantara"],
    contacts: [],
  },
  {
    id: "rmaf",
    name: "Royal Malaysian Air Force",
    domain: "airforce.mil.my",
    tagline: "CAP55 — FA-50M induction and C-130 replacement study",
    overview:
      "RMAF is sequencing CAP55 in tranches. Near-term Boeing relevance sits in airlift replacement, sustainment, and maritime awareness support.",
    industry: "Defence & National Security",
    country: "malaysia",
    countryName: "Malaysia",
    regionId: "southeast-asia",
    aliases: ["rmaf", "malaysia air force", "mindef malaysia", "tentera udara"],
    contacts: [],
  },
  {
    id: "rtaf",
    name: "Royal Thai Air Force",
    domain: "rtaf.mi.th",
    tagline: "Gripen E/F path — transport recapitalisation still open",
    overview:
      "RTAF is executing Gripen E/F while ageing C-130H lift remains a pressure point. Offset and industrial return expectations shape every Boeing conversation.",
    industry: "Defence & National Security",
    country: "thailand",
    countryName: "Thailand",
    regionId: "southeast-asia",
    aliases: ["rtaf", "thai air force", "thailand mod", "mod thailand"],
    contacts: [],
  },
  {
    id: "vietnam-caa",
    name: "Civil Aviation Authority of Vietnam",
    domain: "caa.gov.vn",
    tagline: "CAAV — regulatory scale-up ahead of 737 MAX and Long Thanh",
    overview:
      "CAAV oversees Vietnam's fastest-growing aviation market. Boeing touchpoints include certification capacity, training standards, and airline fleet growth.",
    industry: "Civil Aviation Regulation",
    country: "vietnam",
    countryName: "Vietnam",
    regionId: "southeast-asia",
    aliases: ["caav", "vietnam caa", "civil aviation vietnam", "vietnam airlines"],
    contacts: [],
  },
  {
    id: "paf",
    name: "Philippine Air Force",
    domain: "paf.mil.ph",
    tagline: "Flight Plan 2040 — multirole fighter and archipelagic defence",
    overview:
      "PAF is shifting from counter-insurgency to territorial defence. Financing structure, not platform preference, is the gating issue for US-origin fighters.",
    industry: "Defence & National Security",
    country: "philippines",
    countryName: "Philippines",
    regionId: "southeast-asia",
    aliases: ["paf", "philippine air force", "dnd philippines", "afp"],
    contacts: [],
  },
  {
    id: "emirates",
    name: "Emirates",
    domain: "emirates.com",
    tagline: "Dubai mega-hub — 777X launch customer and widebody backbone",
    overview:
      "Emirates remains one of Boeing's largest widebody operators. Conversations centre on 777X timing, cabin conversion, and MRO partnerships in Dubai.",
    industry: "Commercial Aviation",
    country: "uae",
    countryName: "United Arab Emirates",
    regionId: "middle-east",
    aliases: ["emirates", "emirates airline", "dk"],
    contacts: [
      {
        id: "ahmed-bin-saeed",
        name: "HH Sheikh Ahmed bin Saeed Al Maktoum",
        title: "Chairman & Chief Executive, Emirates Airline",
        headline: "Chairs Emirates Group — owns fleet strategy including 777X induction",
        seniority: "Chairman",
      },
    ],
  },
  {
    id: "qatar-airways",
    name: "Qatar Airways",
    domain: "qatarairways.com",
    tagline: "Doha hub — 777-9 and 787 fleet growth",
    overview:
      "Qatar Airways is a core 777-9 and 787 operator. Engagement focuses on delivery slots, cabin product, and cargo freighter options.",
    industry: "Commercial Aviation",
    country: "qatar",
    countryName: "Qatar",
    regionId: "middle-east",
    aliases: ["qatar", "qatar airways", "qr"],
    contacts: [
      {
        id: "akbar-al-baker",
        name: "Akbar Al Baker",
        title: "Group Chief Executive, Qatar Airways",
        headline: "Long-serving GCE shaping Qatar's Boeing widebody commitments",
        seniority: "C-Suite",
      },
    ],
  },
  {
    id: "jal",
    name: "Japan Airlines",
    domain: "jal.co.jp",
    tagline: "JAL — 787 backbone and next-decade twin-aisle planning",
    overview:
      "Japan Airlines operates a large 787 fleet with ongoing cabin and sustainment programmes. Boeing discussions cover reliability, retrofits, and future twin-aisle mix.",
    industry: "Commercial Aviation",
    country: "japan",
    countryName: "Japan",
    regionId: "northeast-asia",
    aliases: ["jal", "japan airlines", "japan air lines"],
    contacts: [
      {
        id: "mitsuko-tsuchiya",
        name: "Mitsuko Tsuchiya",
        title: "Senior Vice President, Fleet Strategy (illustrative)",
        headline: "Fleet planning counterpart for widebody utilisation and cabin programmes",
        seniority: "VP",
      },
    ],
  },
  {
    id: "korean-air",
    name: "Korean Air",
    domain: "koreanair.com",
    tagline: "KE — 777-9 and 787 orders; Asiana integration underway",
    overview:
      "Korean Air is consolidating with Asiana while inducting new Boeing widebodies. Integration and slot timing dominate commercial engagement.",
    industry: "Commercial Aviation",
    country: "korea",
    countryName: "Republic of Korea",
    regionId: "northeast-asia",
    aliases: ["korean air", "koreanair", "ke", "asiana"],
    contacts: [
      {
        id: "walter-cho",
        name: "Walter Cho",
        title: "Chairman & CEO, Korean Air",
        headline: "Leads Korean Air Group through Asiana integration and fleet renewal",
        seniority: "C-Suite",
      },
    ],
  },
  {
    id: "qantas",
    name: "Qantas",
    domain: "qantas.com",
    tagline: "QF — Project Sunrise and 787 ultra-long-haul operations",
    overview:
      "Qantas Group runs Project Sunrise and a substantial 787 operation. Boeing talks cover ultra-long-haul readiness, freighter options, and sustainment.",
    industry: "Commercial Aviation",
    country: "australia",
    countryName: "Australia",
    regionId: "anz",
    aliases: ["qantas", "qf", "jetstar"],
    contacts: [
      {
        id: "vanessa-hudson",
        name: "Vanessa Hudson",
        title: "Chief Executive Officer, Qantas Group",
        headline: "CEO owning Project Sunrise timing and group fleet strategy",
        seniority: "C-Suite",
      },
    ],
  },
  {
    id: "air-india",
    name: "Air India",
    domain: "airindia.com",
    tagline: "AI — historic Boeing order and network rebuild under Tata",
    overview:
      "Air India's transformation order includes a large Boeing tranche. Engagement spans delivery sequencing, training, and MRO build-out in India.",
    industry: "Commercial Aviation",
    country: "india",
    countryName: "India",
    regionId: "india",
    aliases: ["air india", "airindia", "tata airline"],
    contacts: [
      {
        id: "campbell-wilson",
        name: "Campbell Wilson",
        title: "Chief Executive Officer, Air India",
        headline: "CEO driving Air India transformation and Boeing delivery ramp",
        seniority: "C-Suite",
      },
    ],
  },
  {
    id: "mod-australia",
    name: "Australian Department of Defence",
    domain: "defence.gov.au",
    tagline: "Defence Australia — P-8A, E-7, and Growler enterprise",
    overview:
      "Australia operates Boeing P-8A, E-7 Wedgetail, and EA-18G Growler fleets. Conversations emphasise availability, sovereign industry, and alliance interoperability.",
    industry: "Defence & National Security",
    country: "australia",
    countryName: "Australia",
    regionId: "anz",
    aliases: ["australia defence", "defence australia", "raaf", "department of defence australia"],
    contacts: [
      {
        id: "robert-chipman",
        name: "AIRMSHL Robert Chipman",
        title: "Chief of Air Force, RAAF",
        headline: "RAAF chief owning airborne ISR and strike readiness including P-8A and Growler",
        seniority: "Service Chief",
      },
    ],
  },
]

export function searchPartnerDirectory(query: string): PartnerLookupEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)
  const matched = partnerDirectory.filter((p) => {
    const hay = [p.name, p.domain, p.tagline, p.industry, p.countryName, p.overview, ...p.aliases]
      .join(" ")
      .toLowerCase()
    return hay.includes(q) || tokens.every((token) => hay.includes(token))
  })
  // SEA-first ranking for the demo’s primary theatre
  const rank = (regionId: string) =>
    regionId === "southeast-asia" ? 0
      : regionId === "northeast-asia" ? 1
        : regionId === "india" ? 2
          : regionId === "anz" ? 3
            : 4
  return matched.sort((a, b) => rank(a.regionId) - rank(b.regionId) || a.name.localeCompare(b.name))
}

export function getPartnerById(id: string): PartnerLookupEntry | undefined {
  return partnerDirectory.find((p) => p.id === id)
}

export function partnerToCompany(entry: PartnerLookupEntry): Company {
  const known = companies.find((c) => c.id === entry.id)
  if (known) {
    return {
      ...known,
      overview: entry.overview || known.overview,
      industry: entry.industry || known.industry,
    }
  }
  return {
    id: entry.id,
    name: entry.name,
    domain: entry.domain,
    tagline: entry.tagline,
    overview: entry.overview,
    industry: entry.industry,
    logoUrl: LOGO(entry.id),
    fallbackLogoUrl: LOGO_DEV(entry.domain),
    country: entry.country,
    countryName: entry.countryName,
    regionId: entry.regionId,
    isCustom: true,
  }
}
