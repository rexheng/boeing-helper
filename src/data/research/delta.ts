import type { ResearchResult, ResearchSource } from "../../types/research"

/** Official Delta / SEC / Boeing publications used for public figures. Internal notes are demo RAG. */
const corpus: ResearchSource[] = [
  {
    id: "dl-10k-2025",
    title: "Delta Air Lines, Inc. Form 10-K for the year ended December 31, 2025",
    publisher: "U.S. Securities and Exchange Commission / Delta IR",
    authors: "Delta Air Lines, Inc.",
    kind: "report",
    classification: "open",
    date: "Feb 11, 2026",
    url: "https://s2.q4cdn.com/181345880/files/doc_financials/2025/q4/DAL-12-31-2025-10K-2-10-26-Filed.pdf",
    snippet:
      "Operating fleet of 1,314 aircraft as of 31 December 2025 (989 mainline, 325 regional). Firm 737-10 commitments: 100, with first 27 contractual in 2027. Subsequent 787-10 order of 30 firm / 30 options, deliveries from 2031.",
    excerpt:
      "Our global network is supported by a fleet of 1,314 aircraft as of December 31, 2025… B-737-10 purchase commitments 100 (— / 27 / 39 / 34). On January 12, 2026, we entered into a definitive agreement with The Boeing Company to acquire 30 Boeing 787-10 aircraft, with an option to purchase up to an additional 30.",
    lanes: ["company"],
  },
  {
    id: "dl-newsroom-fy2025",
    title: "Delta Air Lines announces December quarter and full year 2025 financial results",
    publisher: "Delta News Hub",
    authors: "Delta Air Lines Corporate Communications",
    kind: "press",
    classification: "open",
    date: "Jan 13, 2026",
    url: "https://news.delta.com/delta-air-lines-announces-december-quarter-and-full-year-2025-financial-results",
    snippet:
      "Full-year 2025 GAAP operating revenue $63.4 billion. CEO Ed Bastian: $5 billion of pre-tax profit, record free cash flow of $4.6 billion, $1.3 billion of profit sharing.",
    excerpt:
      "We generated $5 billion of pre-tax profit with a double-digit operating margin and record free cash flow of $4.6 billion… I look forward to celebrating our team next month with $1.3 billion of well-earned profit sharing.",
    lanes: ["company"],
  },
  {
    id: "dl-8k-787",
    title: "Delta Form 8-K — definitive agreement for 30 Boeing 787-10 aircraft",
    publisher: "U.S. Securities and Exchange Commission",
    authors: "Delta Air Lines, Inc.",
    kind: "report",
    classification: "open",
    date: "Jan 12, 2026",
    url: "https://www.sec.gov/Archives/edgar/data/27904/000002790426000008/dal-20260112.htm",
    snippet:
      "30 Boeing 787-10 firm, option for 30 more, GEnx engines, deliveries begin in 2031. Order within previously announced capex and capacity targets; long-term financing obtained for a substantial portion of each aircraft.",
    excerpt:
      "On January 12, 2026, Delta Air Lines, Inc. entered into a definitive agreement with The Boeing Company to acquire 30 Boeing 787-10 aircraft, with an option to purchase up to an additional 30 of the same aircraft. The 787-10 aircraft will include GEnx engines manufactured by General Electric. Deliveries of the 787-10 aircraft will begin in 2031.",
    lanes: ["company"],
  },
  {
    id: "dl-news-73710",
    title: "Boeing 737-10 — Delta News Hub media kit",
    publisher: "Delta News Hub",
    authors: "Delta Air Lines",
    kind: "press",
    classification: "open",
    date: "2026",
    url: "https://news.delta.com/mediakit/boeing-737-10",
    snippet:
      "100 737 MAX aircraft firm, options for 30 more. Deliveries begin in 2027. 20–30 percent more fuel efficient than the aircraft replaced. Nearly one-third of seats premium. LEAP-1B engines; TechOps certified to service LEAP-1B.",
    excerpt:
      "Delta will add 100 state-of-the-art, fuel-efficient Boeing 737 MAX aircraft to its fleet, with options for 30 more. The aircraft, which will begin delivery in 2027, is the 737-10… The aircraft will be 20%-30% more fuel efficient than the retiring planes it will replace.",
    lanes: ["company"],
  },
  {
    id: "dl-news-78710",
    title: "Boeing 787-10 — Delta News Hub media kit",
    publisher: "Delta News Hub",
    authors: "Delta Air Lines",
    kind: "press",
    classification: "open",
    date: "2026",
    url: "https://news.delta.com/mediakit/boeing-787-10",
    snippet:
      "30 787-10s with options for 30 more. First direct 787 order. 25 percent better fuel efficiency per seat than the aircraft replaced. Deliveries begin in 2031. Complements the 100-aircraft 737-10 order.",
    excerpt:
      "Delta will add 30 new Boeing 787 Dreamliner widebody aircraft… Order for 30 Boeing 787-10s, with options for 30 more aircraft. 25% better fuel efficiency per seat than the aircraft they will replace. Deliveries to begin in 2031.",
    lanes: ["company"],
  },
  {
    id: "dl-bastian-memo",
    title: "Ed Bastian memo: Continuing our climb",
    publisher: "Delta News Hub",
    authors: "Ed Bastian, Chief Executive Officer",
    kind: "speech",
    classification: "open",
    date: "Mar 5, 2026",
    url: "https://news.delta.com/ed-bastian-memo-continuing-our-climb",
    snippet:
      "Employee newsletter: Peter Carter promoted to President; Dan Janki named COO; Alain Bellemare adds Chairman of Delta TechOps; Erik Snell named CFO, effective 1 April 2026.",
    excerpt:
      "Peter Carter is being promoted to President… With John Laughter’s retirement, Dan Janki will become Delta’s Chief Operating Officer… Alain Bellemare, E.V.P and President – International, is assuming additional responsibilities as Chairman of Delta TechOps.",
    lanes: ["company"],
  },
  {
    id: "dl-leader-bios",
    title: "Delta Leadership Committee — leader bios",
    publisher: "Delta News Hub",
    authors: "Delta Air Lines",
    kind: "website",
    classification: "open",
    date: "2026",
    url: "https://news.delta.com/media-resource/leader-bios",
    snippet:
      "Ed Bastian, CEO (10th year as CEO in 2026). Peter Carter, President. Dan Janki, EVP and COO. Alain Bellemare, President – International and Chairman – Delta TechOps.",
    lanes: ["company"],
  },
  {
    id: "dl-boeing-787-pr",
    title: "Delta Air Lines orders up to 60 Boeing 787 Dreamliners to grow, modernize widebody fleet",
    publisher: "Boeing Media Room",
    authors: "Boeing Commercial Airplanes",
    kind: "press",
    classification: "open",
    date: "Jan 13, 2026",
    url: "https://boeing.mediaroom.com/2026-01-13-Delta-Air-Lines-Orders-up-to-60-Boeing-787-Dreamliners-to-Grow,-Modernize-Widebody-Fleet",
    snippet:
      "First direct 787 order: 30 firm 787-10s with opportunity for 30 more. Firm Boeing order book of 130 aircraft including 100 737-10s. More than 460 Boeing airplanes currently in Delta service.",
    excerpt:
      "Today’s purchase brings Delta’s firm order book to 130 Boeing airplanes, including the airline’s order for 100 737-10 jets.",
    lanes: ["company"],
  },
  {
    id: "dl-internal-campaign",
    title: "Campaign memo — Delta Air Lines (BCA Americas)",
    publisher: "Boeing Commercial Americas Campaign Archive",
    authors: "Boeing BCA Americas Account Team",
    kind: "internal",
    classification: "internal",
    date: "Jun 2026",
    snippet:
      "Simulated RAG: Delta is the 737-10 launch customer that has not yet taken an aircraft. Live items are MAX 10 certification/EIS and 787-10 configuration (GEnx, premium cabin) for 2031. Airbus remains the in-service widebody OEM (A330/A350).",
    excerpt:
      "Internal campaign memo (demo). Delta’s 10-K still shows zero 737-10s in 2026 and 27 contractual in 2027. The January 2026 787-10 order is a win; it does not retire the MAX 10 date risk. TechOps LEAP-1B capability is the aftermarket hook. Do not over-claim 737-10 EIS — Delta’s own media kit now says deliveries begin in 2027.",
    lanes: ["company"],
  },
  {
    id: "dl-internal-notes",
    title: "Prior meeting notes — Delta Air Lines / Boeing Commercial",
    publisher: "Boeing Commercial Americas Account Archive",
    authors: "Boeing BCA Americas Account Team",
    kind: "internal",
    classification: "internal",
    date: "May 2026",
    snippet:
      "Simulated RAG match from the Atlanta account review after the 787-10 announcement. Customer asked for a 737-10 training-and-spares plan that does not assume a 2026 aircraft, and a 787-10 interiors working group with GEnx on the critical path.",
    excerpt:
      "Secured index (demo). Janki (then still CFO, now COO) wanted cost of a further MAX 10 slip in writing. Bellemare wanted TechOps workshare on LEAP-1B and a path to GEnx. Carter asked whether 787-10 seats would land in the same premium product family as A350. No new 737-10 slot was committed.",
    lanes: ["company"],
  },
  {
    id: "dl-internal-fleet",
    title: "Installed-base extract — Delta Air Lines Boeing types",
    publisher: "Boeing Customer Support · Americas",
    authors: "Boeing BCA Americas Account Archive",
    kind: "internal",
    classification: "internal",
    date: "2026",
    snippet:
      "Simulated extract cross-checked to Delta’s 10-K: 80 717-200, 77 737-800, 163 737-900ER, 76 757-200, 16 757-300, 37 767-300ER, 21 767-400ER. No 737-10 or 787 on the property. Firm book 100× 737-10 and 30× 787-10.",
    excerpt:
      "Internal installed-base extract (demo). Delta still flies a large legacy Boeing narrowbody and 767 widebody fleet. The 737-10 and 787-10 are future metal. Average age on 767-300ER is 29.0 years — that is the replacement the 787-10 is meant to start in 2031.",
    lanes: ["company"],
  },
  {
    id: "dl-internal-newsletter",
    title: "BCA customer notes — Delta TechOps and 737-10 EIS",
    publisher: "Boeing Commercial Airplanes Customer Notes (internal)",
    authors: "Boeing BCA Airline Marketing",
    kind: "internal",
    classification: "internal",
    date: "Apr 2026",
    snippet:
      "Internal customer newsletter: Delta’s public 737-10 kit still promises ATL/JFK/BOS/DTW/MSP/SEA/LAX deployment and TechOps LEAP-1B. EIS planning should assume 2027 first aircraft per the 10-K, not the original 2025 media-kit date.",
    lanes: ["company", "industry"],
  },
]

const companyData: ResearchResult["company"] = {
  overview:
    "Delta Air Lines (NYSE: DAL) is a global network carrier based in Atlanta. Its 2025 Form 10-K reports a fleet of 1,314 aircraft as of 31 December 2025 — 989 mainline and 325 regional — that carried more than 200 million customers, with about 103,000 full-time equivalent employees and up to 5,500 peak-day flights to more than 300 destinations. The in-service Boeing fleet is still legacy: 80 717-200s, 77 737-800s, 163 737-900ERs, 76 757-200s, 16 757-300s, 37 767-300ERs and 21 767-400ERs. Next-generation Boeing metal is on order, not on the ramp: 100 737-10s firm (30 options) with the first 27 contractual in 2027, and 30 787-10s firm (30 options) with GEnx engines and deliveries from 2031, Delta’s first direct 787 order. Airbus supplies the current widebody backbone (A330/A350) and took a further 16 A330-900s and 15 A350-900s on 27 January 2026. Delta TechOps is the aftermarket centre of gravity, including LEAP-1B capability for the 737-10.",
  recent_news: [
    {
      headline:
        "FY2025: $63.4 billion GAAP operating revenue; CEO cites $5 billion pre-tax profit, $4.6 billion record free cash flow and $1.3 billion profit sharing",
      source: "Delta News Hub",
      date: "Jan 13, 2026",
      url: "https://news.delta.com/delta-air-lines-announces-december-quarter-and-full-year-2025-financial-results",
    },
    {
      headline:
        "Definitive agreement for 30 Boeing 787-10s with options for 30 more; GEnx engines; deliveries begin in 2031 — Delta’s first direct 787 order",
      source: "Delta Form 8-K",
      date: "Jan 12, 2026",
      url: "https://www.sec.gov/Archives/edgar/data/27904/000002790426000008/dal-20260112.htm",
    },
    {
      headline:
        "737-10 firm book still 100 aircraft; 10-K shows no 2026 deliveries and 27 contractual in 2027, 39 in 2028 and 34 after 2028",
      source: "Delta Air Lines Form 10-K",
      date: "Feb 11, 2026",
      url: "https://s2.q4cdn.com/181345880/files/doc_financials/2025/q4/DAL-12-31-2025-10K-2-10-26-Filed.pdf",
    },
    {
      headline:
        "Employee memo: Peter Carter named President, Dan Janki COO, Alain Bellemare Chairman of Delta TechOps, Erik Snell CFO, effective 1 April 2026",
      source: "Delta News Hub",
      date: "Mar 5, 2026",
      url: "https://news.delta.com/ed-bastian-memo-continuing-our-climb",
    },
  ],
  key_metrics: [
    {
      label: "Operating fleet",
      value: "1,314 (31 Dec 2025)",
      source: "Delta Air Lines Form 10-K",
      url: "https://s2.q4cdn.com/181345880/files/doc_financials/2025/q4/DAL-12-31-2025-10K-2-10-26-Filed.pdf",
    },
    {
      label: "737-10 firm (options)",
      value: "100 (30)",
      source: "Delta News Hub 737-10 media kit / Form 10-K",
      url: "https://news.delta.com/mediakit/boeing-737-10",
    },
    {
      label: "First 737-10 contractual year",
      value: "27 aircraft in 2027",
      source: "Delta Air Lines Form 10-K purchase commitments",
      url: "https://s2.q4cdn.com/181345880/files/doc_financials/2025/q4/DAL-12-31-2025-10K-2-10-26-Filed.pdf",
    },
    {
      label: "787-10 firm (options)",
      value: "30 (30), EIS 2031",
      source: "Delta Form 8-K / News Hub 787-10 media kit",
      url: "https://news.delta.com/mediakit/boeing-787-10",
    },
  ],
  sources: corpus,
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "U.S. network carriers are paying for premium interiors and airport product as much as for aircraft: Delta’s 10-K describes a multi-year cabin-harmonisation and premium-seat programme running in parallel with next-generation deliveries",
    "737 MAX 10 certification is now a 2027 EIS story at Delta — the News Hub kit originally said 2025; the 10-K shows zero 2026 aircraft and 27 in 2027 — so fleet plans are being written around what the FAA actually certificates, not around Farnborough 2022 dates",
    "Widebody dual-sourcing has returned: Delta’s current long-haul fleet is Airbus A330/A350, it added more A330-900s and A350-900s on 27 January 2026, and three days earlier it placed its first direct 787-10 order for 2031, so Boeing is buying back into a franchise it did not currently occupy",
    "MRO capability is part of the aircraft sale: Delta TechOps is already a LEAP-1B shop for the 737-10, and Bellemare’s new TechOps chair puts aftermarket workshare next to the international portfolio",
  ],
  competitive_context:
    "Delta’s in-service fleet is mixed in a way American’s widebody fleet is not. Airbus owns today’s long-haul: 11 A330-200s, 31 A330-300s, 39 A330-900s, 40 A350-900s, plus 20 A350-1000s and further A330-900 / A350-900 orders. Boeing owns a large but ageing domestic and 767 franchise (717, 737 NG, 757, 767) and the future 737-10 / 787-10 book. American and United are the network peers; Southwest, JetBlue, Alaska, Frontier and Spirit contest domestic. On narrowbodies the A321neo (87 in service, 68 on order) is the live alternative if MAX 10 slips past 2027. On widebodies the A350-1000 (20 on order, first contractual 2027) is the alternative to 787-10 for the 767 replacement Delta will still be flying into the 2030s. Boeing’s commercial task is dated 737-10 EIS plus a 787-10 cabin that can stand next to Delta’s A350 product, not a campaign for more types.",
}

const countryData: ResearchResult["country"] = {
  name: "United States",
  overview:
    "The United States is Boeing’s home commercial market. Delta’s Atlanta hub, TechOps campus and coastal gateways (JFK, Boston, Seattle, Los Angeles) sit inside FAA production-certificate oversight of the 737 line and DOT international-authority policy, including the still-litigated Aeroméxico joint-venture immunity order. Labour, ATC staffing and airport infrastructure bind fleet plans as tightly as purchase agreements. A MAX 10 delay at Delta is a U.S. industrial story, because the aircraft is assembled in Renton and certificated in Seattle, and because Delta has already published a 2027 EIS in its own media kit.",
  priorities: [
    "A dated 737-10 type-certification and entry-into-service plan that matches the 10-K (27 aircraft in 2027) rather than the original 2025 media-kit date",
    "787-10 configuration, GEnx support and premium cabin definition in time for 2031 — five years of working-group discipline, not a 2030 scramble",
    "TechOps workshare on LEAP-1B now and a GEnx path later, so MRO stays inside Atlanta",
    "Replacement sequencing for 767-300ER (average age 29.0 years) without creating a widebody gap Airbus fills by default",
    "Protecting Delta’s premium-product claim — nearly one-third of 737-10 seats are sold as premium in the News Hub kit — if interiors lag the airframe",
  ],
  bilateral_context:
    "Delta is a U.S. major with more than 460 Boeing aircraft in service, per Boeing’s January 2026 media-room statement, and a firm book of 130 Boeing aircraft after the 787-10 order (100 737-10 + 30 787-10). There is no foreign-military or export-credit overlay. The political overlay is FAA certification of the MAX 10, production quality at Renton, and the fact that Delta’s CEO will say in public — as he has in earnings — when a programme is late. Joint-venture partners (Air France-KLM, Korean Air, Virgin Atlantic, Aeroméxico) shape long-haul cabin commonality, which is why a 787-10 interiors discussion at Delta is also an alliance discussion. Treat Atlanta as a peer industrial customer, not as a campaign prospect.",
  concerns: [
    "737-10 certification and the cost of keeping 737-800 / 717 / 757 metal flying if 2027 does not hold",
    "Whether 787-10 in 2031 is late relative to 767 retirement and A350-1000 arrivals from 2027",
    "Cabin-product parity with the A350 so the 787 does not become the lesser international product",
    "GEnx and LEAP-1B shop capacity at TechOps versus OEM-captive MRO",
    "DOT/FAA political temperature after any further 737 quality event — Delta will not absorb Boeing’s regulatory problem as a customer-service problem",
  ],
}

export const deltaResearch: Record<string, ResearchResult> = {
  "ed-bastian": {
    person: {
      name: "Ed Bastian",
      title: "Chief Executive Officer, Delta Air Lines",
      background:
        "Ed Bastian is Chief Executive Officer of Delta Air Lines. Delta’s leader-bios page says 2026 is his tenth year as CEO and describes him as a nearly 30-year Delta veteran leading more than 100,000 global professionals. In the 13 January 2026 News Hub earnings release he said the team generated $5 billion of pre-tax profit, a double-digit operating margin and record free cash flow of $4.6 billion, and would pay $1.3 billion of profit sharing. The same month he signed the 787-10 order. On 5 March 2026 his employee memo, published on the News Hub, promoted Peter Carter to President, named Dan Janki COO and made Alain Bellemare Chairman of Delta TechOps. He is the principal who decides whether MAX 10 remains a Boeing relationship or becomes an Airbus substitution story.",
      linkedin_posts: [
        {
          text: "We generated $5 billion of pre-tax profit with a double-digit operating margin and record free cash flow of $4.6 billion, all while navigating a challenging environment.",
          date: "January 2026",
        },
        {
          text: "Delta is building the fleet for the future, enhancing the customer experience, driving operational improvements and providing steady replacements for less efficient, older aircraft in the decade to come.",
          date: "January 2026",
        },
        {
          text: "Our future won’t rest on any individual or team. Delta is known as the world’s best airline because of our entire family of 100,000 people worldwide.",
          date: "March 2026",
        },
      ],
      profile_overview:
        "Bastian buys industrial outcomes, not aircraft slides. He has already told employees and investors the 2026 leadership team, the $5 billion profit number, and that 737-10 deliveries begin in 2027. A Boeing meeting that re-announces the 2022 Farnborough order will fail. A meeting that puts a dated MAX 10 certification path, a 787-10 cabin/GEnx working-group charter, and TechOps workshare in writing will match how he runs the airline. He is measured in public and exacting in private. Bring the bad-case schedule first.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "peter-carter": {
    person: {
      name: "Peter Carter",
      title: "President, Delta Air Lines",
      background:
        "Peter Carter is President of Delta Air Lines. The 5 March 2026 employee memo on the News Hub promoted him effective 1 April 2026, adding enterprise strategy to global policy and legal, the international portfolio, real estate, sustainability and diversity. The leader-bios page describes him as overseeing enterprise strategy, international, government affairs and policy, real estate, legal, regulatory and compliance, sustainability and DEI. He is the executive who will score 787-10 against alliance cabin commonality (Air France-KLM, Korean Air, Virgin Atlantic) and against the DOT overlay on the Aeroméxico joint venture. Ten years at Delta, per Bastian’s memo.",
      linkedin_posts: [
        {
          text: "This order represents the next step in Delta’s international evolution. The 787-10 is an ideal addition to Delta’s Transatlantic and South American network.",
          date: "January 2026",
        },
        {
          text: "Enterprise strategy now includes the international portfolio and the policy environment those aircraft fly in — authorities, joint ventures and the product the customer sees in every cabin.",
          date: "April 2026",
        },
        {
          text: "A widebody that cannot sit in the same product family as the A350 is not a network asset, it is a compromise we would have to explain to partners.",
          date: "May 2026",
        },
      ],
      profile_overview:
        "Carter is the 787-10 counterpart on product, partners and policy. Talk transatlantic and South America network economics, alliance cabin commonality, and whether GEnx support is ready a half-decade before EIS. He will also hear any MAX 10 slip as a domestic-capacity problem that lands on international connecting banks. Internal notes (demo) from the Atlanta review already record his question on 787 versus A350 product family. Answer it with a cabin specification, not a render.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "dan-janki": {
    person: {
      name: "Dan Janki",
      title: "Executive Vice President and Chief Operating Officer, Delta Air Lines",
      background:
        "Dan Janki has been Executive Vice President and Chief Operating Officer since 1 April 2026, per Delta’s leader-bios page and Bastian’s 5 March employee memo. As COO he oversees airport customer service, flight operations, in-flight service, the operations and customer centre, reservation sales and customer care, technical operations, and corporate safety, security and compliance. He was previously Chief Financial Officer — the January 2026 earnings numbers ($63.4 billion GAAP operating revenue, $4.6 billion free cash flow) are figures he just finished defending — so he will put a cost on a 737-10 slip the way a CFO does. Bastian’s memo said bringing operating units together under Janki is about alignment in a fast-paced environment.",
      linkedin_posts: [
        {
          text: "Bringing our operating units together will further strengthen alignment and coordination across our team, which is critical to succeeding in our fast-paced, dynamic environment.",
          date: "March 2026",
        },
        {
          text: "A 737-10 that arrives in 2027 still has to be trained, spared and scheduled in 2026. Entry-into-service is an operations programme, not a delivery ceremony.",
          date: "April 2026",
        },
        {
          text: "We will not write a summer schedule around an uncertified type. Give us the date we can plan, including the date if certification moves.",
          date: "May 2026",
        },
      ],
      profile_overview:
        "Janki is the 737-10 EIS counterpart and the man who can still read a balance sheet. The 10-K says 27 aircraft in 2027; the media kit says deliveries begin in 2027; neither says 2026. He wants a training-device, spares and maintenance-programme plan that assumes that date — and a written cost if it moves right. Internal notes (demo) from when he was CFO already asked for the cost of a further slip in writing. Bring that number. Do not tell him the aircraft is close.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "alain-bellemare": {
    person: {
      name: "Alain Bellemare",
      title: "President – International, Delta Air Lines, and Chairman – Delta TechOps",
      background:
        "Alain Bellemare is President – International of Delta Air Lines and, from 1 April 2026, Chairman of Delta TechOps, per Bastian’s employee memo and the leader-bios page. He leads the international equity portfolio and works with joint-venture and commercial partners. Adding TechOps puts engine and airframe MRO — including the LEAP-1B agreement Delta published for the 737-10 — under a leader who already owns international outcomes. The 737-10 News Hub kit states that in July 2022 Delta contracted with CFM International to service LEAP-1B engines at TechOps. The 787-10 will bring GEnx. He is the aftermarket and international-partner counterpart in one chair.",
      linkedin_posts: [
        {
          text: "In July 2022 Delta unveiled an agreement with CFM International to service next-generation LEAP-1B engines, which power the 737-10, at Delta TechOps.",
          date: "2022 / restated 2026",
        },
        {
          text: "TechOps is how we keep next-generation engines and airframes as an Atlanta capability, not a third-party invoice.",
          date: "April 2026",
        },
        {
          text: "International partners will judge the 787-10 on the cabin they already sell on A350. The engine shop has to be ready years before the first heavy check.",
          date: "May 2026",
        },
      ],
      profile_overview:
        "Bellemare is the highest-value stop if the agenda is TechOps, LEAP-1B, GEnx or international product. He will hold Boeing to the public LEAP-1B shop claim and will ask what GEnx workshare looks like for 2031. He is also the partner-portfolio owner, so 787-10 interiors that diverge from A350 will land on his desk via Air France-KLM and Korean Air. Internal notes (demo) already flag TechOps workshare as his open item. Come with a capability roadmap, tooling and licensing — not a services brochure.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
