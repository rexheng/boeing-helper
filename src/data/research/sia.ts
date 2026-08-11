import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "Singapore Airlines operates one of the world's youngest all-widebody fleets — roughly 150 aircraft serving around 80 destinations from Changi — built on about 63 A350-900s including the ultra-long-range jets that fly Singapore to New York, 26 Boeing 787-10s, 22 777-300ERs and 12 A380s. The group pairs the full-service airline with low-cost Scoot and a 25.1 percent stake in Air India acquired through the Vistara merger. Thirty-one Boeing 777-9s are on order as the next flagship, and SIA is the launch customer for the Airbus A350F after choosing it over the 777-8F for freighter renewal. SIA Engineering Company anchors MRO at Changi, including a joint venture with Boeing for regional fleet support.",
  recent_news: [
    { headline: "No 777-9 deliveries scheduled in SIA's fleet plan for the financial year to 31 March 2027 as certification work drags on", source: "Aviation Week", date: "May 2026" },
    { headline: "SIA's long-haul fleet to shrink for the first time in six years as another 777-300ER retires ahead of 777-9 arrival in 2027", source: "Mainly Miles", date: "May 2026" },
    { headline: "Singapore Airlines in early talks with Airbus and Boeing for at least 50 large widebodies — 777X or A350-1000 — for next-decade growth", source: "Reuters / Business Times", date: "Jun 2026" },
    { headline: "Boeing says 777X delays add cost for airlines like SIA that must keep older jets flying; SIA says it has built flexibility into its fleet plans", source: "Business Times", date: "Mar 2026" },
  ],
  key_metrics: [
    { label: "Group Fleet", value: "~150 aircraft" },
    { label: "777-9 on Order", value: "31" },
    { label: "Boeing 787-10s", value: "26 (launch customer)" },
    { label: "Air India Stake", value: "25.1%" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Widebody delivery scarcity is now the binding constraint on network growth across Asia: with backlogs stretching seven years, airlines are competing for delivery slots rather than discounts, and fleet plans are being written around what can actually arrive",
    "Premium demand has stayed resilient through the cycle, pushing carriers to invest in cabin products — SIA's multibillion-dollar long-haul retrofit is timed to land alongside the 777-9's new First and Business seats",
    "Southeast Asian traffic continues to outgrow global averages, with Vietnamese, Indonesian and Indian markets adding narrowbody capacity faster than airport infrastructure can absorb it",
    "Sustainable aviation fuel mandates are moving from voluntary to statutory in Singapore, adding a cost line that carriers are passing through via levies and factoring into fleet fuel-burn decisions",
  ],
  competitive_context: "Airbus has taken ground at SIA in the last decade — the A350 is the backbone of the long-haul fleet and the A350F won the freighter competition over the 777-8F, a loss Boeing executives have publicly attributed in part to timelines. Boeing retains a strong position through 26 787-10s, the 777-300ER fleet and 31 777-9s on order, but the 777X programme's repeated slippage has real commercial cost for SIA, which is extending ageing 777-300ERs to cover. Regionally SIA competes with Emirates and Qatar for sixth-freedom traffic and increasingly with a resurgent Air India that it part-owns. The next widebody competition, for at least 50 aircraft, is a straight 777X versus A350-1000 contest and will hinge on delivery credibility as much as economics.",
}

const countryData: ResearchResult["country"] = {
  name: "Singapore",
  overview: "Singapore treats aviation as national infrastructure: Changi is the hub around which the economy's connectivity, tourism and logistics are organised, and the government invests accordingly, with Terminal 5 under construction to add capacity into the 2030s. The Civil Aviation Authority of Singapore regulates with a reputation for rigour and has introduced a sustainable aviation fuel levy from 2026 to fund an initial blending target. Singapore Airlines is majority owned by Temasek, the state investment company, which means fleet decisions carry a national dimension even though the airline is run commercially. The city-state also hosts the biennial Singapore Airshow, the region's principal aerospace gathering.",
  priorities: [
    "Protect Changi's hub position against Gulf and regional competitors as Terminal 5 capacity comes online",
    "Grow the aerospace maintenance, repair and overhaul cluster at Seletar and Changi, where SIA Engineering and its joint ventures anchor a globally significant MRO base",
    "Meet sustainable aviation fuel targets funded through a levy on departing passengers from 2026 without eroding hub competitiveness",
    "Deepen the Air India relationship as a second growth engine in the world's fastest-expanding major aviation market",
    "Maintain the premium product positioning that underpins SIA's yield advantage, which requires cabins and aircraft arriving on schedule",
  ],
  bilateral_context: "The US-Singapore aviation relationship runs through an open skies agreement, extensive Boeing content in the SIA and Scoot fleets, and Boeing's own Southeast Asian presence in Singapore. SIA has been a Boeing launch customer before — most recently for the 787-10 — and SIA Engineering operates a joint venture with Boeing providing fleet support services across the region. That history cuts both ways: it earns Boeing access at the most senior level, and it means schedule failures on the 777X are read as a breach of an unusually trusting relationship rather than as ordinary programme risk.",
  concerns: [
    "Delivery credibility above all — SIA has publicly built 'flexibility' into its fleet plans because it no longer treats manufacturer dates as firm, and will press for contractual certainty on any new order",
    "The cost of extending 777-300ERs and reworking cabin retrofit sequencing while waiting for the 777-9, which Boeing has acknowledged imposes real expense on operators",
    "Cabin product integration — the first 777-9s must arrive with the new First and Business Class already installed, so interiors supply chains are part of the schedule risk",
    "Fleet commonality and pilot resourcing across a fleet that already spans A350, 787, 777 and A380 types",
    "Reputational exposure: SIA's brand is built on reliability, and it will not accept a delivery profile that forces visible service compromises",
  ],
}

export const siaResearch: Record<string, ResearchResult> = {
  "goh-choon-phong": {
    person: {
      name: "Goh Choon Phong",
      title: "Chief Executive Officer, Singapore Airlines",
      background: "Goh Choon Phong has been Chief Executive Officer of Singapore Airlines since 1 January 2011, one of the longest tenures among major airline chief executives. He joined SIA in 1990, held senior management roles in Singapore and overseas, and was appointed to the SIA board in October 2010. He also chairs Budget Aviation Holdings, which oversees Scoot, and sits on the boards of SIA Engineering Company, Mastercard and Air India, where SIA holds 25.1 percent following the Vistara merger. He steered SIA through the pandemic without cutting the premium product, then through a record post-crisis recovery, and has been consistently measured in public about Boeing's 777-9 delays.",
      linkedin_posts: [
        { text: "Because of the delay in the 777-9s, we have had to look at extending the use of some of our aircraft, particularly the older 777-300ERs. We have built flexibility into our fleet plans for exactly this reason.", date: "May 2026" },
        { text: "Our stake in Air India gives us a second engine of growth in the world's fastest-expanding major aviation market. Integration is a long project and we are approaching it patiently.", date: "March 2026" },
        { text: "Premium service is not a segment for us, it is the product. Investment in cabins and consistency is what makes the brand worth the fare.", date: "January 2026" },
      ],
      profile_overview: "Goh is the decision-maker on the next widebody order — at least 50 aircraft in a 777X versus A350-1000 contest now at an early stage — and he is going into it with fresh evidence of what schedule slippage costs. He has been notably restrained in public, saying he does not expect major impact from the delays, but the airline's actions tell the real story: 777-300ERs extended, a long-haul fleet shrinking for the first time in six years, and the A350F chosen over the 777-8F for the freighter fleet. He responds to precision and candour rather than reassurance. The most useful thing any Boeing executive can bring him is a dated, defensible 777-9 delivery profile with the new cabin installed, followed by a credible slot picture for the next order.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "lee-lik-hsin": {
    person: {
      name: "Lee Lik Hsin",
      title: "Executive Vice President Commercial & Chief Commercial Officer",
      background: "Lee Lik Hsin was promoted to Executive Vice President Commercial on 1 April 2020 and appointed Chief Commercial Officer on 1 June 2023, with responsibility for cargo, customer experience, marketing planning, and sales and marketing across all regions. He was previously Chief Executive Officer of Scoot, having been appointed CEO of Tigerair in 2014 and led its merger with Scoot in 2016. Before that he was President of SIA Cargo, Senior Vice President Corporate Planning, and head of SIA's company planning and fuel department, with regional vice president roles in West Asia, Africa and North Asia. He is the executive who converts fleet capability into network and revenue plans.",
      linkedin_posts: [
        { text: "Every aircraft decision is a network decision. Range, payload and cabin count determine which routes we can open and at what yield — the aircraft is just the instrument.", date: "April 2026" },
        { text: "Cargo has settled into a structurally stronger position than pre-pandemic, and it shapes how we think about widebody capacity, not just belly space.", date: "February 2026" },
        { text: "Our customers notice consistency more than novelty. A fleet plan that keeps the product uniform across routes is worth more than a headline aircraft.", date: "May 2026" },
      ],
      profile_overview: "Lee is where the commercial case for the next widebody order gets built, and his low-cost and cargo background makes him unusually numerate about aircraft economics across segments. His practical problem right now is planning a network around aircraft that may or may not arrive: 777-9 slippage forces route and cabin-product decisions with incomplete information, and he is the executive absorbing that uncertainty. Conversations that work with him are seat-mile cost, cabin configuration flexibility, cargo capability and route-opening economics, backed by data. He was on the commercial side when SIA chose the A350F over the 777-8F and will remember exactly how that evaluation ran.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "tan-kai-ping": {
    person: {
      name: "Tan Kai Ping",
      title: "Executive Vice President Operations & Chief Operating Officer",
      background: "Tan Kai Ping serves as Executive Vice President Operations and Chief Operating Officer of Singapore Airlines, having moved into the role from the chief financial officer's chair — a background that shapes how he approaches operational trade-offs. He is responsible for flight operations, engineering, ground services and the operational execution of the fleet plan, which currently means managing extended service life on 777-300ERs, sequencing the multibillion-dollar A350 cabin retrofit programme, and preparing the airline's operational and training infrastructure for the 777-9's eventual arrival. His finance grounding makes him the executive most likely to quantify what a delivery slip actually costs the airline.",
      linkedin_posts: [
        { text: "Extending an aircraft's service life is never free. Heavy checks, reliability management and cabin refresh all land on the operation, and they land on a schedule we did not choose.", date: "April 2026" },
        { text: "The cabin retrofit programme is one of the largest operational projects we have run. Aircraft out of service is capacity we cannot sell, so sequencing is everything.", date: "February 2026" },
        { text: "Introducing a new type is a two-year operational project before the first revenue flight — simulators, engineering, spares provisioning, crew qualification. We are already working the 777-9 induction.", date: "June 2026" },
      ],
      profile_overview: "Tan carries the operational consequences of every schedule change, and his CFO background means he can put a number on them. He is the right counterpart for entry-into-service planning: spares provisioning, simulator and training timelines, maintenance programme development, and the reliability performance SIA will expect from a new type. He will also be sceptical in a specific way — he wants to know what happens if the date moves again, and what Boeing will do operationally and commercially when it does. Bring induction planning detail and contingency structures rather than assurances; a credible plan for the bad case earns more trust with him than confidence about the good one.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "chin-yau-seng": {
    person: {
      name: "Chin Yau Seng",
      title: "Chief Executive Officer, SIA Engineering Company",
      background: "Chin Yau Seng joined SIA Engineering Company as Chief Executive Officer-Designate on 1 June 2023 and took over full responsibilities on 1 October 2023. He came from Singapore Airlines, where he was Senior Vice President Cargo following SIA Cargo's reintegration as a division in 2018, and had been President of SIA Cargo since 2014. SIAEC anchors the Changi and Seletar MRO cluster, providing line and base maintenance, component and engine services through a network of joint ventures with major OEMs — including a joint venture with Boeing providing fleet support services in the region — and serves both the SIA group and a substantial third-party customer base across Asia-Pacific.",
      linkedin_posts: [
        { text: "MRO capacity in Asia-Pacific is tightening as fleets grow faster than hangar space and licensed engineers. Capability planning now runs five to ten years ahead of demand.", date: "May 2026" },
        { text: "Our joint ventures with OEM partners let us bring capability to Changi that no single company would build alone. That model is how a small country hosts a global MRO base.", date: "March 2026" },
        { text: "New types mean new tooling, new training and new approvals long before the first heavy check. We start preparing the moment an order is signed, not when the aircraft arrives.", date: "January 2026" },
      ],
      profile_overview: "Chin runs the aftermarket side of the relationship and is the natural counterpart for anything involving Boeing's regional services footprint, given the existing SIAEC-Boeing joint venture. His live questions are capacity and capability: which heavy-check work for 787s and eventually 777-9s can be done at Changi, what tooling and licensing is required, and how third-party demand across Southeast Asia — including growing Vietnamese and Indonesian 737 fleets — can be captured. He thinks in five-to-ten-year capability plans and welcomes early technical engagement. For an air show conversation he is the highest-value stop if the agenda is services, parts and regional MRO strategy rather than aircraft sales.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
