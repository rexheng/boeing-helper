import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "The Ministry of Defence (MINDEF) directs the Singapore Armed Forces and the Republic of Singapore Air Force from Gombak, with acquisition executed through the Defence Science and Technology Agency (DSTA). The RSAF operates roughly 100 combat aircraft — 40 F-15SGs and upgraded F-16C/Ds — alongside 75 rotorcraft including 20 Boeing AH-64D Apaches, 16 CH-47F and 10 CH-47SD Chinooks, and 16 H225Ms. Twenty F-35s (12 F-35B, 8 F-35A) are on order, and Boeing P-8A Poseidons will replace the Fokker 50 maritime patrol fleet from the early 2030s. Singapore's defence budget runs at roughly S$23 billion, held to about 3 percent of GDP, and MINDEF plans capability in 10- to 20-year cycles rather than annual buys.",
  recent_news: [
    { headline: "Singapore's first four F-35Bs due before end-2026; aircraft to operate from Ebbing Air National Guard Base before Tengah basing around 2029", source: "Asian Military Review", date: "Feb 2026" },
    { headline: "Chief of Air Force calls F-35 and P-8A 'game-changers' as RSAF modernises manned aircraft, ground-based air defence and C4 systems", source: "CNA", date: "Feb 2026" },
    { headline: "RSAF opts for a partial C-130 refresh — acquiring used but well-maintained C-130Hs to replace 65-year-old KC-130Bs rather than buying new", source: "FlightGlobal", date: "Feb 2026" },
    { headline: "Ng Chad-Son to become Permanent Secretary (Defence Development) on 1 September; Roy Chan succeeds him as DSTA chief executive", source: "MINDEF Press Release", date: "Jul 2026" },
  ],
  key_metrics: [
    { label: "Defence Budget", value: "~S$23B (~3% GDP)" },
    { label: "F-35s on Order", value: "20 (12 B / 8 A)" },
    { label: "Boeing Rotorcraft", value: "20 AH-64D, 26 CH-47" },
    { label: "C-130 Fleet Avg Age", value: "52.7 years" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Fifth-generation transition across the Asia-Pacific: Lockheed Martin projects more than 300 F-35s in the region by 2030, pulling allied air forces toward common sustainment, data and weapons standards — and raising the bar for what a fourth-generation platform must offer to stay competitive",
    "Maritime domain awareness is the fastest-growing mission set in Southeast Asia, with the P-8A, MPA conversions of business jets and unmanned systems all competing for the same submarine-detection and surface-picture requirements",
    "Attrition-tolerant mass: lessons from Ukraine and the Red Sea have pushed regional air forces to pair exquisite platforms with cheap drones, loitering munitions and counter-UAS — Singapore stood up a dedicated UAV Command and briefs visiting delegations on it",
    "Sustainment economics now decide competitions as often as flyaway price; life-extension programmes such as the RSAF's AH-64D upgrade are increasingly preferred over new-build replacement when readiness can be preserved",
  ],
  competitive_context: "Lockheed Martin holds the fighter and tactical airlift relationship (F-16, F-35, C-130), Airbus supplies the A330 MRTT tanker fleet and H225M rotorcraft, and Boeing owns the heavy-lift, attack-helicopter and — with the P-8A — maritime patrol franchises. IAI supplies the G550 CAEW airborne early warning aircraft. ST Engineering is the local prime for MRO, upgrades and unmanned systems, and any foreign vendor is expected to route sustainment work through it. Singapore deliberately avoids single-vendor dependence: MG Fan has publicly framed the future fighter force as a mixed F-35A, F-35B and F-15SG fleet rather than a single type.",
}

const countryData: ResearchResult["country"] = {
  name: "Singapore",
  overview: "A city-state of 6 million with no strategic depth, Singapore sustains one of Asia's most capable militaries on a disciplined budget of roughly 3 percent of GDP and a conscript-based force. Defence planning is long-horizon, technocratic and famously price-sensitive on lifecycle cost rather than sticker price. Because domestic airspace is too small for realistic training, the SAF maintains permanent overseas detachments — F-16s at Luke AFB (Peace Carvin II), F-15SGs at Mountain Home (Peace Carvin V), Apaches in Arizona (Peace Vanguard), Chinooks in Texas (Peace Prairie) — making US basing and training access a structural, not transactional, part of the relationship.",
  priorities: [
    "Deliver the F-35 programme on schedule and stand up Tengah Air Base's westward expansion with the shelters, hangars and secure facilities the type requires",
    "Replace the Fokker 50 maritime patrol fleet with the P-8A in the early 2030s and integrate it with complementary unmanned and surface platforms",
    "Extend the life of proven fleets — AH-64D upgrade into the 2030s, F-16 mid-life upgrades to the mid-2030s — instead of premature replacement",
    "Build depth in drones, counter-drone and AI-enabled command and control, the areas Chief of Defence Force Aaron Beng has flagged from current conflicts",
    "Protect training access abroad and deepen interoperability with the US, Australia and regional partners without being drawn into bloc politics",
  ],
  bilateral_context: "The US-Singapore defence relationship is the deepest in Southeast Asia short of a treaty alliance: the 1990 MOU and its 2019 renewal give US forces access to Paya Lebar and Changi through 2035, and Singapore is the largest regional customer for US aircraft on a per-capita basis. Boeing's Southeast Asia footprint is anchored in Singapore, and the country hosts the biennial Singapore Airshow — the region's principal industry gathering, last held in February 2026. Singapore is scrupulously non-aligned in public messaging: it buys American hardware while insisting the relationship is not directed at any third country.",
  concerns: [
    "Delivery credibility — the 777-9 and F-35 schedule slips have made Singaporean planners sceptical of manufacturer timelines, and they will ask for dated, contractual commitments rather than targets",
    "Lifecycle and sustainment cost, especially spares availability and depot turnaround, weighted more heavily than acquisition price",
    "Manpower: a conscript force with a shrinking cohort means training pipelines, simulation and maintainer-hours-per-flight-hour are decision criteria",
    "Local industry participation through ST Engineering and DSTA-led technology insertion, rather than pure foreign military sales",
    "Strategic hedging — Singapore will resist framing any purchase as choosing sides in US-China competition and dislikes public statements that imply it",
  ],
}

export const mindefSgResearch: Record<string, ResearchResult> = {
  "chan-chun-sing": {
    person: {
      name: "Chan Chun Sing",
      title: "Minister for Defence",
      background: "Chan Chun Sing became Minister for Defence on 23 May 2025, succeeding Ng Eng Hen after fourteen years in the portfolio. He served in the Singapore Armed Forces from 1987 to 2011, rising to Major-General and Chief of Army, with earlier appointments including Army Attaché in Jakarta and Chief of Staff – Joint Staff. He holds degrees from Christ's College Cambridge, an MBA from MIT and is a graduate of the US Army Command and General Staff College. Before Defence he was Minister for Education, Minister for Trade and Industry, and Secretary-General of the National Trades Union Congress; he remains Coordinating Minister for Public Services. In September 2025 he visited Lockheed Martin's Fort Worth line and signed the wing of Singapore's first F-35.",
      linkedin_posts: [
        { text: "At Fort Worth today to see Singapore's first F-35 being built. This is not just a milestone but one step in a long journey we take together with our partners — every one of us needs to come together for this capability to be realised.", date: "September 2025" },
        { text: "Closing the Shangri-La Dialogue: small states cannot choose their geography, but they can choose to be useful, consistent and credible. Singapore's defence policy is built on exactly that.", date: "June 2025" },
        { text: "Welcomed the Commander-in-Chief of the Royal Thai Air Force to MINDEF. Our air forces have trained together for decades — the value of these relationships shows up long before any crisis.", date: "June 2026" },
      ],
      profile_overview: "Chan is a soldier-turned-technocrat who reads programme detail personally and dislikes being sold to. His public framing of the F-35 is deliberately unglamorous — capability delivered over decades, dependent on partners, industry and the workforce in Ebbing as much as on the airframe. For a Boeing conversation the productive ground is the P-8A induction, Apache life extension and Chinook sustainment: existing programmes where reliability and cost-per-flight-hour matter more than new platform pitches. He will notice, and quietly discount, anyone who leads with capability slides rather than schedule commitments. Avoid any framing that positions Singapore in a US-versus-China posture; he is consistent that Singapore's purchases are about self-defence, not alignment.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "kelvin-fan": {
    person: {
      name: "MG Kelvin Fan Sui Siong",
      title: "Chief of Air Force, Republic of Singapore Air Force",
      background: "Major-General Kelvin Fan was appointed Chief of Air Force on 22 March 2024. An Air Warfare Officer, he commanded 163 Squadron and served as Head Air Plans, Head Air Operations, Commander Air Defence and Operations Command, Chief of Staff – Air Staff and Chief of Staff – Joint Staff. Unusually for a service chief he is also a member of the Singapore Administrative Service, having served as Deputy Secretary (Policy) at MINDEF and been seconded to the Ministry of Trade and Industry, where he worked on tourism policy including the Integrated Resorts. He holds master's degrees from Cambridge, Yale and MIT, sits on the board of the Civil Aviation Authority of Singapore, and previously served on the Changi Airport Group board.",
      linkedin_posts: [
        { text: "The F-35As, with greater endurance and higher payload capacity, will provide sustained reach and persistence, while the F-35Bs with short take-off and vertical landing capability will offer greater operational agility.", date: "February 2026" },
        { text: "The P-8A maritime patrol aircraft will enhance the SAF's maritime situational awareness and our ability to counter sub-surface threats, working alongside complementary platforms to be announced in due time.", date: "February 2026" },
        { text: "Our AH-64D Apaches are undergoing a Life Extension Programme to continue operating into the 2030s. Modernisation is not only about new platforms — it is about keeping proven ones relevant.", date: "February 2026" },
      ],
      profile_overview: "Fan is the single most important RSAF interlocutor for Boeing: he owns the P-8A induction, the AH-64D life extension and the Chinook fleet, and he has already made the public case for all three. His policy-and-Treasury background means he thinks in trade-offs — his C-130 decision to buy used but well-maintained H-models rather than new airlift is the clearest tell of how he values money. He speaks in measured, non-promotional language and responds well to the same. Best openings: P-8A basing, training and sustainment design ahead of early-2030s induction; the 'complementary platforms' he has hinted at for the maritime mission; and how Apache life extension pairs with unmanned teaming. Do not pitch him a fighter; that lane is settled through the mid-2030s.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "aaron-beng": {
    person: {
      name: "VADM Aaron Beng",
      title: "Chief of Defence Force, Singapore Armed Forces",
      background: "Vice Admiral Aaron Beng has served as Chief of Defence Force since March 2022, the first naval officer in the role in over a decade. A submariner by background, he commanded the RSN's submarine force and served as Chief of Navy before taking the joint appointment. He represents Singapore at the Munich Security Conference and Shangri-La Dialogue and hosts visiting service chiefs — including the Royal Thai Air Force commander-in-chief in June 2026 — as part of a dense regional engagement calendar. His tenure has been defined by joint force design: standing up the Digital and Intelligence Service, integrating unmanned systems and pulling lessons from Ukraine and Red Sea operations into SAF doctrine.",
      linkedin_posts: [
        { text: "The character of war is changing faster than our procurement cycles. Our answer is not to chase every trend but to build a force that can absorb new technology without breaking.", date: "February 2026" },
        { text: "Hosted the Commander-in-Chief of the Royal Thai Air Force this week. Regional air forces train together, exercise together and — increasingly — think about the same problems together.", date: "June 2026" },
        { text: "Drones and counter-drone are no longer a niche. Every service is now an air defence service, and that changes how we organise, not just what we buy.", date: "April 2026" },
      ],
      profile_overview: "Beng is the joint-force customer rather than the platform customer: he cares about how a capability plugs into SAF command and control, maritime domain awareness and counter-UAS, not about the platform's individual specifications. As a submariner he has direct professional interest in the P-8A's anti-submarine warfare mission and will engage in genuine detail on sensor performance and cueing. He is also the SAF's principal diplomatic face in the region, so he thinks about interoperability with Australia, the US and ASEAN partners as an outcome in itself. Bring the joint and coalition picture — how Singapore's P-8As would work with Australian and US P-8 fleets — rather than a platform brief.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "ng-chad-son": {
    person: {
      name: "Ng Chad-Son",
      title: "Permanent Secretary (Defence Development), MINDEF",
      background: "Ng Chad-Son, 51, becomes Permanent Secretary (Defence Development) on 1 September 2026, taking over from Melvyn Ong, and concurrently serves as Permanent Secretary for National Research and Development at the Prime Minister's Office. He joined the Singapore Armed Forces in 1994, held command and staff appointments in the SAF and MINDEF, and became Deputy Secretary (Technology) at MINDEF in 2022 before being appointed Chief Executive of DSTA in May 2024. In two years at DSTA he oversaw delivery of the Invincible-class submarines, Multi-Role Combat Vessels, Titan infantry fighting vehicles, the F-35 and P-8A programmes, the G550 maritime aircraft, SAFTI City and the Shoalwater Bay training area expansion, while pushing drones, robotics, counter-drone systems and AI into the acquisition pipeline.",
      linkedin_posts: [
        { text: "Defence procurement is a long game. The systems we contract this decade will still be flying when the engineers who specified them have retired — which is why we design for upgradability first.", date: "May 2026" },
        { text: "Proud of the DSTA team as we hand over another set of milestones. Delivery is a culture, not a schedule.", date: "July 2026" },
        { text: "Open competitive sourcing is our default for a reason. Transparency is not friction — it is how we keep the cost of trust low over a thirty-year programme.", date: "March 2026" },
      ],
      profile_overview: "Ng is the acquisition gatekeeper: he ran the DSTA side of both the F-35 and P-8A programmes and now sets MINDEF's development and technology direction from the permanent-secretary chair. He is an engineer by training and evaluates proposals on systems integration, upgradability and total lifecycle cost, with a documented preference for open competitive sourcing and structured evaluation over relationship-led selling. His new dual-hatted role linking national R&D and defence development means industrial and research collaboration — local engineering content, AI and autonomy work with Singapore institutions — is a live conversation, not a courtesy topic. Come with programme substance: delivery schedule risk, obsolescence management, data rights and depot strategy.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
