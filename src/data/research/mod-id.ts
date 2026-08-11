import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "Kementerian Pertahanan Republik Indonesia (Kemhan RI) directs defence policy, budget and acquisition for the world's largest archipelagic state, with the TNI Angkatan Udara operating across more than 17,000 islands from headquarters at Cilangkap, Jakarta. The air force flies upgraded F-16A/B and F-16C/D Block 25s, Su-27/Su-30 Flankers, T-50i Golden Eagles, Super Tucanos, C-130H and newly delivered C-130J-30s, and eight Boeing AH-64E Apaches, with Insitu ScanEagle UAS in the ISR role. Forty-two Rafales are on contract with the first three delivered in January 2026, and Jakarta holds stakes or agreements in Korea's KF-21 and Turkey's Kaan programmes. Minister Sjafrie Sjamsoeddin has centralised procurement decisions and set a 2025-2029 policy framework built on 'defensive active' doctrine.",
  recent_news: [
    { headline: "Boeing confirms at Singapore Airshow there is no longer an active Indonesia F-15EX campaign; Jakarta cites price mismatch, not policy change", source: "Janes / Jakarta Post", date: "Feb 2026" },
    { headline: "First three Rafales arrive in Indonesia in January, opening a multi-year induction of the 42-aircraft French order", source: "Defense News", date: "Feb 2026" },
    { headline: "KSAU Tonny Harjono tells DPR Commission I the air force is adding radars in phases to close national air-surveillance blind spots", source: "RRI", date: "May 2026" },
    { headline: "Sjafrie chairs the 2026 Kemhan-TNI leadership meeting on 'developing the national defence system to safeguard sovereignty', aligning FY2026 policy, strategy and budget", source: "Kemhan RI", date: "Jan 2026" },
  ],
  key_metrics: [
    { label: "Rafales on Order", value: "42 (3 delivered)" },
    { label: "Boeing Apaches", value: "8 AH-64E" },
    { label: "Defence Spending", value: "~0.8% of GDP" },
    { label: "Fighter Types in Service", value: "5+ (F-16, Su-27/30, T-50i, Rafale)" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Multi-vendor hedging has become Indonesian policy in practice: French Rafales, Korean KF-21 participation, Turkish Kaan, plus recurring interest in second-hand Eurofighters, Chinese J-10s and Pakistani JF-17s — a strategy that buys diplomatic optionality at the price of a fragmented logistics tail",
    "Offsets and local content are statutory, not negotiable: Law 16/2012 on the defence industry requires technology transfer, local content and industrial participation on foreign purchases, routed through PT Dirgantara Indonesia, PT Pindad and PT PAL",
    "Airborne surveillance and radar coverage is the fastest-moving requirement, driven by South China Sea and Natuna incursions and a national programme to eliminate radar blind spots across the archipelago",
    "Financing structure often decides Indonesian competitions — foreign loan facilities, export credit and long payment tails matter more than headline unit price, which is precisely where the F-15EX campaign failed",
  ],
  competitive_context: "Dassault currently holds the initiative with 42 Rafales under contract and deliveries under way. Korea Aerospace Industries retains a foothold through the T-50i fleet and Indonesia's KF-21 partnership, despite repeated payment disputes. Turkish Aerospace is the newest entrant via the Kaan agreement. Lockheed Martin sustains the F-16 fleet and has delivered C-130J-30s. Boeing's position is an installed base rather than a campaign: eight AH-64E Apaches, ScanEagle ISR, legacy 737 Surveiller heritage in the maritime patrol role, and a very large commercial relationship through Garuda and Lion Air. Boeing's own executives have said publicly that Apache and ScanEagle support continues even after the F-15EX withdrawal.",
}

const countryData: ResearchResult["country"] = {
  name: "Indonesia",
  overview: "The world's fourth most populous country and Southeast Asia's largest economy, Indonesia has run a bebas aktif — free and active — foreign policy since independence and treats non-alignment as a national identity, not a bargaining position. President Prabowo Subianto, a former defence minister and special forces general, came to office in October 2024 promising military modernisation, but fiscal room is squeezed by flagship social programmes including the free nutritious meals scheme. Defence spending remains under 1 percent of GDP. Procurement is centralised under the defence ministry and shaped as much by financing availability and industrial offsets as by operational requirement.",
  priorities: [
    "Close air surveillance gaps across the archipelago through a phased national radar expansion and improved air detection and control",
    "Absorb the Rafale induction — infrastructure, aircrew conversion and sustainment — without destabilising existing F-16 and Flanker fleets",
    "Grow domestic aerospace capability through PT Dirgantara Indonesia, with technology transfer and local assembly as explicit conditions of foreign purchases",
    "Maintain maritime sovereignty around the Natuna Islands and the wider South China Sea without provoking escalation",
    "Rationalise a fragmented fleet: senior officials privately acknowledge that operating F-16, Sukhoi, T-50, Rafale and potentially more types is a sustainment burden",
  ],
  bilateral_context: "The US-Indonesia relationship warmed sharply in 2025 with a reciprocal trade agreement that cut US tariffs on Indonesian exports from 32 to 19 percent, in exchange for commitments including the purchase of about 50 Boeing aircraft valued near $13.5 billion for Garuda. Defence ties run through the Super Garuda Shield exercise — now the largest multinational exercise in the region — plus IMET training and the Apache and ScanEagle programmes. The F-15EX collapse in February 2026 was handled without acrimony on either side: Jakarta framed it as a price mismatch and Boeing publicly reaffirmed support for existing Indonesian programmes, leaving the relationship intact but the fighter lane closed.",
  concerns: [
    "Price and financing above all — the ministry stated plainly that the F-15EX offer was 'too high' and never reached the budgeting stage; any proposal must arrive with a credible financing structure",
    "Offset and local-content compliance is a legal requirement; vague industrial-participation language reads as non-responsive",
    "Sovereignty and autonomy — Indonesia will not accept end-use conditions or political framing that constrains its freedom of manoeuvre",
    "Logistics fragmentation from a multi-type fleet, which senior officers cite as a genuine operational risk",
    "Delivery certainty, given a seven-year commercial delivery queue that Danantara officials have publicly called a blocker on the Boeing order",
  ],
}

export const modIdResearch: Record<string, ResearchResult> = {
  "sjafrie-sjamsoeddin": {
    person: {
      name: "Sjafrie Sjamsoeddin",
      title: "Minister of Defense, Republic of Indonesia",
      background: "Sjafrie Sjamsoeddin was sworn in as Minister of Defense by President Prabowo Subianto on 21 October 2024 in the Kabinet Merah Putih. A retired lieutenant general and Kopassus officer, he previously served as Deputy Minister of Defense from 2010 to 2014 and as Special Assistant to the Minister of Defense for defence management from 2019 to 2024 — the years when Prabowo held the portfolio, making him the continuity figure in Indonesian defence policy across two administrations. He chairs the annual Kemhan-TNI leadership meeting, where FY policy, strategy and budget are aligned, and has emphasised centralisation of acquisition decisions and a defensive-active defence posture for 2025-2029.",
      linkedin_posts: [
        { text: "The 2026 leadership meeting theme is clear: developing the national defence system to safeguard and control the sovereignty of the Republic. Every programme we fund must answer to that sentence.", date: "January 2026" },
        { text: "Defence modernisation is not a shopping list. It is doctrine, budget and industry moving together — and where industry is concerned, that means Indonesian industry.", date: "March 2026" },
        { text: "Our posture is defensive active. We are not building a force to threaten anyone; we are building one that makes threatening us unprofitable.", date: "February 2026" },
      ],
      profile_overview: "Sjafrie is the decision authority and the continuity of Prabowo's defence agenda; nothing significant moves without him. He is disciplined about budget and has shown he will walk away from a platform he considers overpriced — the F-15EX outcome was his ministry's call, communicated calmly and without burning the relationship. He responds to proposals framed as sovereignty, industrial capability and affordability rather than capability superiority. For Boeing the constructive agenda with him is sustainment of the Apache fleet, ISR and radar-adjacent capability, and the commercial side of the US-Indonesia trade agreement, where the ministry has influence without owning the budget. Do not reopen the fighter conversation unless Jakarta does.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "tonny-harjono": {
    person: {
      name: "ACM Mohamad Tonny Harjono",
      title: "Chief of Staff, Indonesian Air Force (KSAU)",
      background: "Air Chief Marshal Mohamad Tonny Harjono was installed as Chief of Staff of the Indonesian Air Force on 5 April 2024, succeeding Fadjar Prasetyo. Born in Jakarta in 1971, he is a pilot who commanded Adi Soemarmo and Halim Perdanakusuma air bases, served as aide-de-camp to President Joko Widodo from 2014, became Presidential Military Secretary in 2020, and commanded Kogabwilhan II — the joint regional defence command covering central Indonesia — immediately before his appointment. He also sat as a commissioner of PT Pelita Air Service. He is the service's public face before DPR Commission I, where air force budget and programmes are scrutinised.",
      linkedin_posts: [
        { text: "Strengthening radar is an important part of building an air detection and control system that adapts to regional security challenges. We are adding coverage in stages to eliminate blind spots.", date: "May 2026" },
        { text: "The arrival of our first Rafales marks a new chapter, but the work is only beginning: infrastructure, aircrew, maintainers and doctrine all have to arrive with the aircraft.", date: "January 2026" },
        { text: "An air force is measured on the days nothing happens. Readiness across the archipelago is our daily mission, from Sabang to Merauke.", date: "April 2026" },
      ],
      profile_overview: "Tonny Harjono is the operator who has to make a five-type fighter fleet work, and his public focus is squarely on surveillance coverage and readiness rather than new fighter acquisition. His time at Kogabwilhan II and in the presidential palace gives him unusual reach: he is comfortable in both the operational and political registers, and he defends air force budget lines directly in parliament. For Boeing, the openings are Apache sustainment and readiness rates, ScanEagle and unmanned ISR expansion, and anything that contributes to the radar and maritime-surveillance picture he has publicly prioritised. He will engage on availability data and spares turnaround in specifics; generalities about partnership will not hold his attention.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "donny-ermawan": {
    person: {
      name: "Donny Ermawan Taufanto",
      title: "Deputy Minister of Defense, Republic of Indonesia",
      background: "Marsekal Madya (Ret.) Donny Ermawan Taufanto was appointed Deputy Minister of Defense in October 2024. A career air force officer, he served as Secretary General of the Ministry of Defense before his elevation, giving him unusual command of the ministry's internal machinery — budget execution, contracting and the industrial cooperation clauses that accompany foreign purchases. He briefly served as acting minister during the 2024 transition. Within Kemhan he is the official who translates ministerial direction into procurement documentation and who scores offset, local-content and technology-transfer offers from foreign vendors.",
      linkedin_posts: [
        { text: "Every foreign procurement carries an obligation under Law 16/2012. Offsets are not a courtesy — they are the legal basis on which we sign.", date: "April 2026" },
        { text: "Budget absorption is as important as budget allocation. A programme that cannot be executed in the fiscal year is a programme that does not exist.", date: "February 2026" },
        { text: "Working with PT Dirgantara Indonesia and our national industry partners to make sure capability we buy abroad builds capability at home.", date: "May 2026" },
      ],
      profile_overview: "Donny is the process owner: the person whose sign-off converts political intent into a contract, and the one most likely to reject a proposal on documentation and offset grounds rather than capability. His secretary-general background means he knows exactly where Indonesian programmes stall — budget absorption, foreign loan approval, and industrial participation compliance. He is the right counterpart for a detailed conversation about how Boeing would structure local content with PT Dirgantara Indonesia, MRO localisation, and training in-country. Bring specifics with numbers and named partners; his objection to a weak offset package will be technical and hard to argue past.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "rico-sirait": {
    person: {
      name: "Brig. Gen. Rico Ricardo Sirait",
      title: "Head of Defense Information Bureau (Infohan), Kemhan RI",
      background: "Brigadier General Rico Ricardo Sirait heads the Defence Information Bureau within the Secretariat General of the Ministry of Defense, making him the ministry's authoritative public voice on procurement, doctrine and ministerial activity. He is the official who clarified the F-15EX outcome in February 2026, stating that the plan had never reached the budgeting stage and that Boeing's proposed price was too high to follow up. He manages the ministry's media posture around Kemhan-TNI leadership meetings, parliamentary hearings and international engagements, and coordinates the press programme around defence exhibitions and air shows.",
      linkedin_posts: [
        { text: "We need to be clear: the F-15EX procurement had not reached the budgeting stage. The government requested a proposal as part of planning; the price offered could not be followed up.", date: "February 2026" },
        { text: "Accuracy matters in defence reporting. Speculation about acquisitions that have not been contracted does not serve the public or our partners.", date: "March 2026" },
        { text: "Preparing the ministry's programme for the region's exhibition season — engagement with international industry is part of how we understand the market.", date: "May 2026" },
      ],
      profile_overview: "Sirait controls how any Boeing engagement with Kemhan is reported in Indonesia, which matters more than it looks: the F-15EX story was defused domestically because his framing — price mismatch, no policy change — held. He is precise about the difference between planning, budgeting and contracting, and he will publicly correct anyone who blurs them. For an air show meeting he is the counterpart for agreeing what is said publicly, coordinating joint statements and avoiding surprises during ministerial visits to a stand or chalet. Never leave a media line unagreed with his bureau; premature announcements are the fastest way to damage credibility in Jakarta.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
