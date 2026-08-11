import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "The Civil Aviation Authority of Vietnam (CAAV) is the national regulator for Southeast Asia's fastest-growing aviation market, operating under the Ministry of Construction following the 2025 administrative reforms that absorbed the former Ministry of Transport. Director General Uong Viet Dung leads with Deputy Directors General Do Hong Cam and Ho Minh Tan. The authority is implementing the revised Law on Civil Aviation passed by the National Assembly, writing the guiding documents that align Vietnamese regulation with ICAO standards, while supervising a national fleet approaching 300 aircraft across Vietnam Airlines, VietJet, Bamboo, Pacific and Vietravel. Its stated 2026 agenda is safety oversight capability, ICAO-standard workforce development, air transport capacity expansion and fleet growth matched to infrastructure.",
  recent_news: [
    { headline: "Vietnam Airlines finalises order for 50 Boeing 737-8s valued at $8.1 billion at list prices, with deliveries from 2030 to 2032, announced during General Secretary To Lam's US visit", source: "Boeing / FlightGlobal", date: "Feb 2026" },
    { headline: "Vietnam Airlines secures $2.9 billion in financing for the 737 MAX order and discusses a further 30 widebodies worth around $12 billion", source: "ch-aviation", date: "2026" },
    { headline: "CAAV holds its 2025 aviation safety review, with Director General Uong Viet Dung calling for guiding documents under the revised Civil Aviation Law and ICAO-standard human resources", source: "Ministry of Construction", date: "Dec 2025" },
    { headline: "Authority prioritises expanding fleet size in line with capacity, infrastructure and safety supervision capability rather than demand alone", source: "CAAV", date: "Dec 2025" },
  ],
  key_metrics: [
    { label: "737-8 Order", value: "50 firm (+19 leased)" },
    { label: "Delivery Window", value: "2030-2032" },
    { label: "VN Airlines Fleet", value: "93 today → ~151 by 2030" },
    { label: "Widebody Campaign", value: "30 aircraft, ~$12B" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Vietnam is the region's growth outlier, with domestic and short-haul international demand outrunning airport capacity — which is why the regulator now explicitly ties fleet approval to infrastructure and safety supervision capability",
    "Narrowbody renewal across Southeast Asia is concentrated in the 737 MAX and A320neo families, and Vietnamese carriers have committed to both, giving the country one of the largest single-aisle backlogs in the region",
    "Engine availability rather than airframe supply has constrained Vietnamese capacity in recent years, with geared turbofan inspections grounding A321neos and pushing carriers toward fleet and powerplant diversification",
    "Regulatory capacity building is becoming a competitive factor: ICAO-standard inspector and engineer pipelines determine how fast a national fleet can legally grow, and Vietnam has made this an explicit policy priority",
  ],
  competitive_context: "Airbus dominates the current Vietnamese fleet — Vietnam Airlines alone operates roughly 39 A321s, 20 A321neos, three A320neos and 14 A350-900s — while Boeing holds the widebody position with 11 787-9s and six 787-10s and has now won the narrowbody breakthrough with 50 737-8s. VietJet has separately committed to large 737 MAX volumes. The next contest is Vietnam Airlines' 30-aircraft widebody campaign, a direct A350-900 versus 787-9 comparison for deliveries between 2028 and 2032. Embraer has pursued regional aircraft opportunities for thin domestic routes. COMAC has courted Vietnamese carriers, so far without conversion.",
}

const countryData: ResearchResult["country"] = {
  name: "Vietnam",
  overview: "Vietnam is a one-party state where major aviation decisions carry political weight and are frequently announced alongside state visits — the 50-aircraft Boeing order was finalised during General Secretary To Lam's visit to the United States and witnessed by both governments. Since the 2025 administrative reforms, civil aviation sits under the Ministry of Construction, with the CAAV as regulator. The country holds FAA Category 1 status, allowing direct services to the United States, and aviation is treated as strategic infrastructure supporting export manufacturing, tourism and inbound investment. Aircraft purchases are also an instrument of trade balance management with Washington.",
  priorities: [
    "Implement the revised Law on Civil Aviation with a complete set of guiding documents aligned to ICAO standards and Vietnamese practical conditions",
    "Build high-quality technical human resources — inspectors, engineers and pilots — to ICAO standards as the fleet grows",
    "Expand air transport capacity and cargo scale while keeping fleet growth matched to airport infrastructure and supervision capability",
    "Support Vietnam Airlines' path to a 151-aircraft fleet by 2030 and its stated ambition to be a five-star international airline",
    "Maintain safety performance indicators without complacency, a point the Director General has repeatedly emphasised in public",
  ],
  bilateral_context: "The US-Vietnam relationship was upgraded to a comprehensive strategic partnership in 2023 and aviation has become one of its most visible deliverables. The 737 MAX commitment originated in a non-binding memorandum signed during President Biden's 2023 visit and was converted into a firm order in February 2026 during General Secretary To Lam's US trip, with US EXIM financing supporting the deal. Boeing has expanded its Vietnamese presence and supply-chain engagement, and aircraft purchases feature explicitly in tariff and trade-balance discussions between Hanoi and Washington. This makes Boeing's Vietnamese business unusually political — and unusually well protected.",
  concerns: [
    "Delivery timing: the 737-8s do not arrive until 2030, leaving a capacity gap Vietnamese carriers must bridge with leases and older aircraft",
    "Infrastructure absorption — Tan Son Nhat and Noi Bai congestion and the phased opening of Long Thanh determine how much fleet growth is usable",
    "Technical workforce depth, which the regulator names as a constraint on both airline growth and its own oversight capability",
    "Financing exposure for state-linked carriers, with large loan facilities required well ahead of delivery",
    "Safety credibility, which underpins FAA Category 1 status and direct US access, and which the CAAV guards carefully",
  ],
}

export const vietnamCaaResearch: Record<string, ResearchResult> = {
  "uong-viet-dung": {
    person: {
      name: "Uong Viet Dung",
      title: "Director General, Civil Aviation Authority of Vietnam",
      background: "Uong Viet Dung was appointed Director General of the CAAV following the retirement of Dinh Viet Thang. Born in 1983, he holds a degree in aircraft engineering from Saint Petersburg State University of Civil Aviation in Russia and spent nearly a decade at Vietnam Airlines' aircraft engineering company before moving into government. He served as Chief of Staff at the Ministry of Transport, concurrently heading the department and the party committee office, before taking the regulator's top post. He chaired the December 2025 national aviation safety conference, where he set the 2026 agenda around implementing the revised Civil Aviation Law, building ICAO-standard human resources, expanding transport capacity and growing the fleet in line with infrastructure and supervision capability.",
      linkedin_posts: [
        { text: "The positive safety results of 2025 show our solutions are on the right track, but complacency must be avoided. Risk identification has to be continuous, not annual.", date: "December 2025" },
        { text: "We must develop guiding documents for the Law on Civil Aviation that create a clear legal framework aligned with ICAO standards and Vietnam's practical conditions.", date: "December 2025" },
        { text: "Fleet expansion has to be in accordance with capacity, infrastructure and safety supervision. Growth we cannot supervise is not growth.", date: "December 2025" },
      ],
      profile_overview: "Uong Viet Dung is an engineer and career civil servant who thinks about growth as a supervision problem: his consistent public line is that fleet expansion must match infrastructure and oversight capability, not demand. That makes him a genuine gatekeeper for the pace at which new Boeing aircraft can be absorbed in Vietnam. His years inside Vietnam Airlines' engineering organisation mean he understands maintenance and continuing airworthiness in real detail. The subjects that engage him are regulatory harmonisation with ICAO and FAA practice, technical training and inspector development, certification and continuing airworthiness support — the institutional scaffolding around a fleet, rather than the fleet itself.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "do-hong-cam": {
    person: {
      name: "Do Hong Cam",
      title: "Deputy Director General, Civil Aviation Authority of Vietnam",
      background: "Do Hong Cam serves as one of two Deputy Directors General of the CAAV alongside Ho Minh Tan, part of the leadership team installed under Director General Uong Viet Dung. The deputy directors carry portfolio responsibility across the authority's core functions, including air transport policy, licensing, route rights and market regulation — the levers that determine which carriers may add capacity, on which routes, and at what pace. That work sits directly upstream of airline fleet planning: a narrowbody order only becomes usable capacity once slots, route authorities and operating approvals are in place, and Vietnam's congested primary airports make those approvals genuinely scarce.",
      linkedin_posts: [
        { text: "Route rights and slot allocation are where market growth meets physical reality. Our job is to keep that meeting orderly.", date: "April 2026" },
        { text: "Vietnamese carriers are planning fleets for 2030 and beyond. The regulatory framework has to be ready before the aircraft are, not after.", date: "February 2026" },
        { text: "International connectivity is a national economic asset. Every new route is assessed on that basis as well as on commercial merit.", date: "May 2026" },
      ],
      profile_overview: "Do Hong Cam sits at the point where fleet plans become operating capacity, which makes him relevant to any conversation about how quickly Vietnamese carriers can deploy new narrowbodies from 2030. His concerns are practical and Vietnamese: slot availability at Tan Son Nhat and Noi Bai, the phasing of Long Thanh, and whether route authorities can keep pace with announced fleet growth. He is a useful counterpart for understanding demand-side realism behind headline orders and for framing how Boeing's delivery profile aligns with Vietnam's infrastructure timeline. Treat him as an informed regulator rather than a customer, and expect careful, non-committal language in public settings.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "ho-minh-tan": {
    person: {
      name: "Ho Minh Tan",
      title: "Deputy Director General, Civil Aviation Authority of Vietnam",
      background: "Ho Minh Tan is a Deputy Director General of the CAAV, serving in the leadership team under Uong Viet Dung. The authority's safety and standards work — the portfolio that determines Vietnam's ICAO compliance and its FAA Category 1 status — runs through the deputy director level, covering flight operations oversight, airworthiness, personnel licensing and the inspector workforce. The 2026 programme set out at the December safety conference committed the authority to strengthening dissemination of aviation safety knowledge, maintaining high safety monitoring indicators, and building highly qualified human resources to ICAO standards as the national fleet expands toward and beyond 300 aircraft.",
      linkedin_posts: [
        { text: "Safety monitoring indicators only mean something if the people behind them are trained to ICAO standard. Human resources are our binding constraint, not regulation.", date: "January 2026" },
        { text: "Every new type entering the Vietnamese register brings certification, training and continuing airworthiness work that starts years before the first delivery.", date: "March 2026" },
        { text: "Preventive measures come from honest risk assessment. We would rather find the problem in a report than in an incident.", date: "February 2026" },
      ],
      profile_overview: "Ho Minh Tan owns the safety and airworthiness side of Vietnam's growth, and he has been explicit that trained people — not rules — are the constraint. That is a direct opening for OEM support: type certification liaison, maintenance and flight crew training capacity, technical publications, and inspector familiarisation ahead of a 737 MAX fleet that begins arriving in 2030. He will be interested in how Boeing supports regulators, not just operators, and in how the type's post-2019 return-to-service experience informs training and oversight design. Approach him with substance on safety programmes and training infrastructure; commercial framing will get a polite but short conversation.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "dang-ngoc-hoa": {
    person: {
      name: "Dang Ngoc Hoa",
      title: "Chairman of the Board of Directors, Vietnam Airlines",
      background: "Dang Ngoc Hoa chairs the board of Vietnam Airlines, the state-controlled flag carrier that operates a 93-aircraft fleet of A320neo-family, A350-900, 787-9 and 787-10 aircraft. In February 2026 he presided over the airline's first Boeing single-aisle order — 50 737-8s valued at $8.1 billion at list prices, with deliveries from 2030 to 2032 — announced during General Secretary To Lam's visit to the United States and witnessed by both governments. The airline has since secured around $2.9 billion in financing for the order and is running a parallel campaign for roughly 30 widebodies worth about $12 billion, having requested indicative offers for A350-900s or 787-9s for delivery between 2028 and 2032.",
      linkedin_posts: [
        { text: "The investment in 50 Boeing 737-8 aircraft marks a significant step in building a modern, fuel-efficient fleet while enhancing operational performance and elevating service standards to international benchmarks.", date: "February 2026" },
        { text: "This agreement deepens the long-standing strategic partnership between Vietnam Airlines and Boeing and creates a foundation for our ambition to become a five-star international airline by 2030.", date: "February 2026" },
        { text: "Vietnam Airlines is taking a comprehensive approach to strengthening capability — fleet modernisation, financial resilience and the development of high-quality talent to support long-term growth.", date: "February 2026" },
      ],
      profile_overview: "Dang Ngoc Hoa is Boeing's most important commercial relationship in Vietnam and the man who just made the 737 MAX a Vietnam Airlines type after years of Airbus-dominated narrowbody fleets. His near-term decision is the 30-aircraft widebody campaign, a direct 787-9 versus A350-900 comparison for delivery from 2028 — earlier than the 737s and therefore more sensitive to slot availability. His stated frame is the five-star-by-2030 ambition, which means cabin product, reliability and brand perception weigh alongside economics. He is also politically exposed: the 737 order is a state-visit deliverable, so execution quality on training, entry into service and financing will be read in Hanoi as a test of Boeing's reliability as a partner.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
