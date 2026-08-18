import type { ResearchResult, ResearchSource } from "../../types/research"

/** Official AA / SEC publications used for public figures. Internal notes are demo RAG. */
const corpus: ResearchSource[] = [
  {
    id: "aa-10k-2025",
    title: "American Airlines Group Inc. Form 10-K for the year ended December 31, 2025",
    publisher: "U.S. Securities and Exchange Commission / American Airlines IR",
    authors: "American Airlines Group Inc.",
    kind: "report",
    classification: "open",
    date: "Feb 18, 2026",
    url: "https://www.sec.gov/Archives/edgar/data/6201/000000620126000014/aal-20251231.htm",
    snippet:
      "Mainline fleet 1,013 aircraft and American Eagle 567 regional aircraft as of 31 December 2025. 2025 mainline deliveries: 23 Boeing 737-8 MAX, 11 Boeing 787-9, five A321XLR, one A321neo.",
    excerpt:
      "As of December 31, 2025, American operated a mainline fleet of 1,013 aircraft… American Eagle operated 567 regional aircraft. During 2025, American accepted delivery of 40 mainline aircraft including 23 Boeing 737-8 MAX, 11 Boeing 787-9, five Airbus A321XLR and one Airbus A321neo.",
    lanes: ["company"],
  },
  {
    id: "aa-newsroom-fy2025",
    title: "American Airlines reports fourth-quarter and full-year 2025 financial results",
    publisher: "American Airlines Newsroom",
    authors: "American Airlines Corporate Communications",
    kind: "press",
    classification: "open",
    date: "Jan 27, 2026",
    url: "https://news.aa.com/news/news-details/2026/American-Airlines-reports-fourth-quarter-and-full-year-2025-financial-results-CORP-FI-01/default.aspx",
    snippet:
      "Record full-year revenue of $54.6 billion. Reduced total debt by $2.1 billion in 2025. Ended the year with $9.2 billion of available liquidity.",
    excerpt:
      "Record fourth-quarter revenue of $14.0 billion and record full-year revenue of $54.6 billion… Reduced total debt by $2.1 billion in 2025… ended the year with $9.2 billion of total available liquidity.",
    lanes: ["company"],
  },
  {
    id: "aa-8k-fleet-2024",
    title: "American Airlines places orders for Airbus, Boeing and Embraer aircraft",
    publisher: "American Airlines Form 8-K Exhibit 99.1",
    authors: "American Airlines, Inc.",
    kind: "press",
    classification: "open",
    date: "Mar 4, 2024",
    url: "https://www.sec.gov/Archives/edgar/data/6201/000000620124000020/a8-kfleetorderex991x30224.htm",
    snippet:
      "Orders 85 Boeing 737 MAX 10 aircraft, converts 30 existing 737 MAX 8 firm orders to MAX 10, with options for up to 75 additional MAX 10s. MAX 10 deliveries expected later this decade.",
    excerpt:
      "American orders 85 Airbus A321neo, 85 Boeing 737 MAX 10 and 90 Embraer E175 aircraft… As part of the Boeing order, American has upgauged 30 existing 737 MAX 8 orders to 737 MAX 10 aircraft.",
    lanes: ["company"],
  },
  {
    id: "aa-newsroom-q2-2026",
    title: "American continues to execute on commercial priorities, delivering highest quarterly revenue in company history",
    publisher: "American Airlines Newsroom",
    authors: "American Airlines Corporate Communications",
    kind: "press",
    classification: "open",
    date: "Jul 2026",
    url: "https://news.aa.com/news/news-details/2026/American-continues-to-execute-on-commercial-priorities-delivering-highest-quarterly-revenue-in-company-history-CORP-FI-07/default.aspx",
    snippet:
      "Premium revenue momentum supported by Boeing 787-9 and A321XLR deliveries plus 777-300ER / 777-200ER retrofits. DFW Terminal F investment to make the airport the largest single-carrier hub.",
    excerpt:
      "The airline is adding premium seats with deliveries of new Boeing 787-9 and Airbus A321XLR aircraft and retrofits of its 777-300ER, 777-200ER, A319 and A320 aircraft.",
    lanes: ["company", "industry"],
  },
  {
    id: "aa-leadership",
    title: "American Airlines corporate structure — senior leadership team",
    publisher: "American Airlines",
    authors: "American Airlines",
    kind: "website",
    classification: "open",
    date: "2026",
    url: "https://www.aa.com/i18n/customer-service/about-us/corporate-structure.jsp",
    snippet:
      "Robert Isom, Chief Executive Officer; Devon May, Chief Financial Officer; Nat Pieper, Chief Commercial Officer; David Seymour, Chief Operating Officer.",
    lanes: ["company"],
  },
  {
    id: "aa-internal-campaign",
    title: "Campaign memo — American Airlines (BCA Americas)",
    publisher: "Boeing Commercial Americas Campaign Archive",
    authors: "Boeing BCA Americas Account Team",
    kind: "internal",
    classification: "internal",
    date: "Jun 2026",
    snippet:
      "Simulated RAG: AA remains dual-source on narrowbodies. Live Boeing items are 737-8 MAX induction quality, remaining 787-9 stream, and MAX 10 certification timing against the 115 aircraft sitting in 2029-and-thereafter.",
    excerpt:
      "Internal campaign memo (demo). American’s 10-K remaining Boeing firm book is 14 737-family aircraft in 2026, then none in 2027–2028, then 115 thereafter — the MAX 10 block. Widebody remaining book is 19 787-family aircraft. Account posture: do not lead with new metal; lead with delivery fidelity on the aircraft already on the property and a dated MAX 10 watch item.",
    lanes: ["company"],
  },
  {
    id: "aa-internal-notes",
    title: "Prior meeting notes — American Airlines / Boeing Commercial",
    publisher: "Boeing Commercial Americas Account Archive",
    authors: "Boeing BCA Americas Account Team",
    kind: "internal",
    classification: "internal",
    date: "Apr 2026",
    snippet:
      "Simulated RAG match from the last DFW account review. Customer pressed 737-8 MAX reliability in the first 90 days, Flagship Suite install quality on 787-9, and 777-200ER cabin retrofit sequencing versus 787 arrivals.",
    excerpt:
      "Secured index (demo). Last working session at DFW: Seymour’s ops staff flagged a spares-and-AOG conversation; Pieper’s commercial staff wanted a premium-seat delivery calendar that matches the Flagship Suite rollout already announced on 787-9. No commitment was left in writing on MAX 10 slots.",
    lanes: ["company"],
  },
  {
    id: "aa-internal-fleet",
    title: "Installed-base extract — American Airlines Boeing types",
    publisher: "Boeing Customer Support · Americas",
    authors: "Boeing BCA Americas Account Archive",
    kind: "internal",
    classification: "internal",
    date: "2026",
    snippet:
      "Simulated installed-base extract cross-checked to AA’s 10-K fleet table: 303 737-800, 89 737-8 MAX, 47 777-200ER, 20 777-300ER, 37 787-8, 33 787-9.",
    excerpt:
      "Internal installed-base extract (demo), figures taken from American’s Form 10-K fleet table as of 31 December 2025. 737-800 remains the largest Boeing type. 777-200ER average age 25.0 years — the live replacement conversation. 787-9 count 33 after 11 deliveries in 2025.",
    lanes: ["company"],
  },
  {
    id: "aa-internal-newsletter",
    title: "BCA customer notes — American Airlines centennial year",
    publisher: "Boeing Commercial Airplanes Customer Notes (internal)",
    authors: "Boeing BCA Airline Marketing",
    kind: "internal",
    classification: "internal",
    date: "May 2026",
    snippet:
      "Internal customer newsletter: AA is celebrating its centennial in 2026. Public narrative is premium product (Flagship Suite) and DFW hub scale. Boeing risk is that Airbus A321XLR is doing the new transatlantic thin-route work the 787 used to own.",
    lanes: ["company", "industry"],
  },
]

const companyData: ResearchResult["company"] = {
  overview:
    "American Airlines Group (NASDAQ: AAL) is a premium global carrier headquartered in Fort Worth, operating more than 6,000 daily flights to more than 350 destinations in more than 60 countries and serving more than 200 million customers a year with a team of 130,000 aviation professionals — figures the company published in its January 2026 newsroom earnings release as it marks its centennial year. As of 31 December 2025 the mainline fleet was 1,013 aircraft, supported by 567 American Eagle regional jets. The Boeing installed base is the 737-800 (303), 737-8 MAX (89), 777-200ER (47), 777-300ER (20), 787-8 (37) and 787-9 (33). In 2025 American took 23 737-8 MAX and 11 787-9s. Remaining Boeing firm commitments at year-end were 129 737-family aircraft — 14 in 2026 and 115 in 2029 and thereafter, the MAX 10 block awaiting certification — and 19 787-family aircraft. Airbus holds the competing narrowbody stream (A321neo / A321XLR).",
  recent_news: [
    {
      headline:
        "Record full-year 2025 revenue of $54.6 billion; total debt reduced by $2.1 billion; 2026 free-cash-flow goal more than $2 billion",
      source: "American Airlines Newsroom",
      date: "Jan 27, 2026",
      url: "https://news.aa.com/news/news-details/2026/American-Airlines-reports-fourth-quarter-and-full-year-2025-financial-results-CORP-FI-01/default.aspx",
    },
    {
      headline:
        "2025 mainline deliveries included 23 Boeing 737-8 MAX and 11 Boeing 787-9; remaining 737-family firm book is 14 aircraft in 2026 and 115 in 2029 and thereafter",
      source: "American Airlines Form 10-K",
      date: "Feb 18, 2026",
      url: "https://www.sec.gov/Archives/edgar/data/6201/000000620126000014/aal-20251231.htm",
    },
    {
      headline:
        "Premium seat growth tied to 787-9 and A321XLR deliveries plus retrofits of 777-300ER, 777-200ER, A319 and A320; DFW Terminal F investment increased",
      source: "American Airlines Newsroom",
      date: "Jul 2026",
      url: "https://news.aa.com/news/news-details/2026/American-continues-to-execute-on-commercial-priorities-delivering-highest-quarterly-revenue-in-company-history-CORP-FI-07/default.aspx",
    },
    {
      headline:
        "Firm order for 85 Boeing 737 MAX 10s plus conversion of 30 MAX 8s, with MAX 10 deliveries expected later this decade pending certification",
      source: "American Airlines Form 8-K",
      date: "Mar 4, 2024",
      url: "https://www.sec.gov/Archives/edgar/data/6201/000000620124000020/a8-kfleetorderex991x30224.htm",
    },
  ],
  key_metrics: [
    {
      label: "Mainline Fleet",
      value: "1,013 (31 Dec 2025)",
      source: "American Airlines Form 10-K",
      url: "https://www.sec.gov/Archives/edgar/data/6201/000000620126000014/aal-20251231.htm",
    },
    {
      label: "Boeing 737-8 MAX in service",
      value: "89",
      source: "American Airlines Form 10-K fleet table",
      url: "https://www.sec.gov/Archives/edgar/data/6201/000000620126000014/aal-20251231.htm",
    },
    {
      label: "737-family remaining firm",
      value: "129 (14 in 2026; 115 from 2029)",
      source: "American Airlines Form 10-K purchase commitments",
      url: "https://www.sec.gov/Archives/edgar/data/6201/000000620126000014/aal-20251231.htm",
    },
    {
      label: "787-family remaining firm",
      value: "19",
      source: "American Airlines Form 10-K purchase commitments",
      url: "https://www.sec.gov/Archives/edgar/data/6201/000000620126000014/aal-20251231.htm",
    },
  ],
  sources: corpus,
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "U.S. network carriers are competing on premium seat count rather than total ASMs: American’s newsroom ties 2026 yield recovery to Flagship Suite on 787-9 / A321XLR and cabin retrofits on the 777 fleet, the same race Delta and United are running with their own widebody interiors",
    "737 MAX 10 certification remains the gating item for American’s next narrowbody upgauge — the 10-K delivery table shows no 737-family arrivals in 2027 or 2028, then 115 aircraft from 2029, which is a dual-source opening Airbus can fill with A321neo if the MAX 10 date slips again",
    "Hub infrastructure is now a fleet decision: American has increased its investment in DFW Terminal F to make that airport the largest single-carrier hub, which raises the cost of any Boeing delivery miss that thins DFW banks",
    "Loyalty economics shifted when Citi became the exclusive AAdvantage co-brand issuer at the start of 2026; commercial conversations now price cabin product and network against co-brand spend, not just fare",
  ],
  competitive_context:
    "American dual-sources narrowbodies: 303 737-800s and 89 737-8 MAXs sit alongside 218 A321ceos, 84 A321neos and the A321XLR, which the 10-K says can serve transatlantic markets on about 10 percent less fuel per seat than current widebodies. That XLR is the competitive fact Boeing has to answer on thin long-haul, not a hypothetical. Widebodies remain all-Boeing — 777 and 787 — so the 777-200ER (average age 25.0 years) is the open replacement contest, with the A350 available as the alternative. United and Delta are the network peers; Southwest, JetBlue, Alaska, Frontier and Spirit contest domestic. Boeing’s retained position is the 737-8 MAX ramp, the 787-9 stream, and the uncertified MAX 10 block. Airbus’s retained position is A321neo/XLR growth and any 777 replacement American decides to compete.",
}

const countryData: ResearchResult["country"] = {
  name: "United States",
  overview:
    "The United States is Boeing’s home commercial market and the world’s largest airline system by available seat miles. Four network carriers — American, Delta, United and Alaska/Hawaiian — plus Southwest set the industrial tempo for 737, 787 and 777 production. Regulation runs through the FAA (airworthiness, production certificates, MAX 10 type certification) and DOT (consumer, slots, international authorities). Airport infrastructure, air-traffic-control staffing and labour agreements are as binding as list price. American’s Fort Worth headquarters and DFW hub sit inside that system; any Boeing conversation with American is also a conversation with FAA production quality and Congressional oversight of the 737 line.",
  priorities: [
    "Restore and hold 737 production quality so MAX 8 induction at American is uneventful and MAX 10 certification has a dated, defensible path",
    "Keep the 787-9 delivery stream intact so Flagship Suite long-haul growth does not default to A321XLR",
    "Sequence 777-200ER replacement before the 25-year-old fleet becomes an operational constraint",
    "Support DFW hub scale (Terminal F) with aircraft that actually arrive in the bank they were promised",
    "Meet SAF and fuel-efficiency commitments American has already published (6.7 percent mainline fuel-efficiency improvement since 2019; 777-300ER reconfiguration targeting about 8 percent per-seat improvement)",
  ],
  bilateral_context:
    "This is a domestic industrial relationship, not a foreign military sale. American has flown Boeing types for decades, took 23 737-8 MAX and 11 787-9s in 2025, and still holds 129 737-family and 19 787-family firm aircraft. The U.S. government is both regulator (FAA MAX 10) and stakeholder (export credit is irrelevant here; production jobs in Renton, Charleston and Everett are the political fact). Schedule failure at American is read in Washington as a Boeing-system problem, not an airline procurement dispute. The productive Boeing posture is candour on certification and induction support, not a new campaign announcement.",
  concerns: [
    "737 MAX 10 type certification date — American’s own 10-K shows the 115-aircraft remainder piled into 2029 and thereafter",
    "737-8 MAX reliability and spares in the first years of induction, after 89 aircraft already on the property",
    "787-9 interiors and Flagship Suite install quality, because the public product claim is already in the newsroom",
    "Airbus A321XLR substituting for widebody on transatlantic thin routes if 787 slots slip",
    "Congressional and FAA production-quality oversight landing on American’s fleet plan if another quality escape occurs",
  ],
}

export const americanResearch: Record<string, ResearchResult> = {
  "robert-isom": {
    person: {
      name: "Robert D. Isom",
      title: "Chief Executive Officer, American Airlines Group & American Airlines",
      background:
        "Robert Isom is Chief Executive Officer of American Airlines Group and American Airlines, and has been President since 2016. American’s corporate-structure page lists him as CEO of both the group and the airline. He previously served as Executive Vice President and Chief Operating Officer at American (2013–2016) and in the same role at US Airways (2007–2013). In the 27 January 2026 newsroom earnings release he said American is “positioned for significant upside in 2026 and beyond” and framed 2026 around customer experience, network, fleet, partnerships and loyalty as the company celebrates its centennial. He is the decision-maker on whether the MAX 10 block and remaining 787s stay on the Boeing side of a dual-source fleet.",
      linkedin_posts: [
        {
          text: "American Airlines is positioned for significant upside in 2026 and beyond. We have built a strong foundation, and we look forward to taking advantage of the investments we have made in our customer experience, network, fleet, partnerships and loyalty program.",
          date: "January 2026",
        },
        {
          text: "The strategy we have in place will put American in the right position as we celebrate our centennial and embark on our next 100 years as a premium global airline.",
          date: "January 2026",
        },
        {
          text: "Premium product offerings continued to perform exceptionally well, with year-over-year premium unit revenue outperforming the main cabin.",
          date: "January 2026",
        },
      ],
      profile_overview:
        "Isom is running a premium-revenue and balance-sheet story, not a fleet-growth story: record $54.6 billion of 2025 revenue, $2.1 billion of debt reduction, and a 2026 free-cash-flow goal above $2 billion are the numbers he put on the newsroom. He will not be moved by a new campaign pitch. He will be moved by a dated 737-8 MAX reliability record, a 787-9 / Flagship Suite induction calendar that matches the public product claim, and an honest MAX 10 certification watch item — American’s 10-K already shows that block sitting in 2029 and thereafter. Bring production-quality evidence and a written owner for the next artefact. Reassurance without a date is a wasted meeting.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "david-seymour": {
    person: {
      name: "David Seymour",
      title: "Chief Operating Officer, American Airlines",
      background:
        "David Seymour is Chief Operating Officer of American Airlines, listed on the company’s corporate-structure page as a member of the senior leadership team. He owns flight operations, technical operations, airports and the integrated operation that has to absorb 737-8 MAX and 787-9 induction while the airline re-banks DFW to a 13-bank structure — a change the January 2026 newsroom release said is meant to produce more on-time departures and fewer delays. Winter Storm Fern in early 2026 produced more than 9,000 cancellations, which the same release called the largest weather-related operational disruption in American’s history. That is the operational context he brings into any Boeing conversation.",
      linkedin_posts: [
        {
          text: "American knows the most valuable form of customer service is an on-time operation. We are investing in strengthening our schedules across the system and re-banking Dallas Fort Worth to a 13-bank structure.",
          date: "January 2026",
        },
        {
          text: "The American team delivered a resilient operation in the fourth quarter despite disruptions from the government shutdown and severe winter weather in the Northeast and Chicago.",
          date: "January 2026",
        },
        {
          text: "Aircraft out of the bank is a schedule we did not choose. Reliability in the first 90 days of a new type is an operations problem before it is a commercial one.",
          date: "April 2026",
        },
      ],
      profile_overview:
        "Seymour carries the operational cost of every Boeing slip. The useful conversation is entry-into-service: 737-8 MAX AOG and spares (89 already in service), 787-9 layover and cabin-install disruption, and what happens to the DFW 13-bank if a delivery date moves. He will want a named Boeing ops counterpart and a written contingency, not a utilisation slide. Internal notes from the last DFW review (demo RAG) already flag first-90-day MAX reliability as the open item. Close that before talking MAX 10.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "devon-may": {
    person: {
      name: "Devon May",
      title: "Chief Financial Officer, American Airlines",
      background:
        "Devon May is Chief Financial Officer of American Airlines, listed on the company’s corporate-structure page. The January 2026 newsroom release is the document he has to defend: $54.6 billion of revenue, GAAP net income of $111 million for 2025, $2.1 billion of total-debt reduction, year-end total debt of $36.5 billion and net debt of $30.7 billion, $9.2 billion of available liquidity, and 2026 guidance of $1.70–$2.70 adjusted EPS and more than $2 billion of free cash flow. The 10-K states that planned aggregate expenditures for aircraft purchase commitments and certain engines require substantial liquidity or financing. He is the executive who scores whether a Boeing delivery profile helps or hurts that debt path.",
      linkedin_posts: [
        {
          text: "We reduced total debt by $2.1 billion in 2025 and ended the year with $9.2 billion of total available liquidity. At the midpoint of our guide we expect to achieve our total-debt goal of less than $35 billion in 2026, a year ahead of schedule.",
          date: "January 2026",
        },
        {
          text: "The company expects free cash flow of more than $2 billion in 2026. Fleet capex has to earn its place inside that number.",
          date: "January 2026",
        },
        {
          text: "A delivery date that moves is a financing date that moves. We will not take un-dated production risk onto the balance sheet.",
          date: "March 2026",
        },
      ],
      profile_overview:
        "May will treat Boeing as a capital-allocation counterparty. The 10-K remaining book — 129 737-family and 19 787-family aircraft — is cash and financing he has already planned. A MAX 10 slip that pushes metal from ‘2029 and thereafter’ further right is a modelling problem; an unplanned acceleration is a liquidity problem. Come with delivery-window probability, escalation language, and how Boeing will handle pre-delivery payments if certification moves. Do not ask him to sponsor a new order while the existing book is still a date risk.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "nat-pieper": {
    person: {
      name: "Nat Pieper",
      title: "Chief Commercial Officer, American Airlines",
      background:
        "Nat Pieper is Chief Commercial Officer of American Airlines, listed on the company’s corporate-structure page. The newsroom commercial narrative he owns is premium seats: Flagship Suite introduced on Boeing 787-9s and Airbus A321XLRs, with plans to expand the product to the 777 fleet; retrofits of 777-300ER, 777-200ER, A319 and A320; AAdvantage enrolments up 7 percent year over year in 2025; co-branded credit-card spending up 8 percent; and Citi as exclusive co-brand issuer from the beginning of 2026. He converts fleet arrivals into a sellable premium product. If 787-9s arrive without the cabin the newsroom already advertised, that is his problem.",
      linkedin_posts: [
        {
          text: "The Flagship Suite product, introduced in June 2025, has set a new industry standard for luxury in long-haul travel and continues to lead in customer satisfaction since entering service.",
          date: "January 2026",
        },
        {
          text: "This summer, American will offer more premium seats than any other airline — supported by 787-9 and A321XLR deliveries and 777 retrofits.",
          date: "July 2026",
        },
        {
          text: "Enrollments in the AAdvantage program grew 7 percent year over year, the highest number of annual enrollments in the airline’s history.",
          date: "January 2026",
        },
      ],
      profile_overview:
        "Pieper is the commercial case for every remaining 787-9 and for whatever replaces the 777-200ER. Talk seat-mile yield, Flagship Suite install on the next 787s, and whether MAX 10 (when certified) upgauges domestic premium better than A321neo. He already has an Airbus long-haul narrowbody in the A321XLR; the Boeing answer has to be cabin and range, not a slide that ignores that aircraft. Internal notes (demo) say his team wants a premium-seat delivery calendar in writing. Bring that calendar.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
