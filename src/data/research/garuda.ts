import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "PT Garuda Indonesia (Persero) Tbk is Indonesia's state-owned flag carrier, majority controlled through the sovereign wealth manager Danantara following a capital injection of Rp23.67 trillion in mid-2025. Its operating fleet is built on Boeing 737-800NGs as the domestic workhorse, 777-300ERs on long haul and A330-200/300/900neos on regional widebody routes, with a single leased 737 MAX 8 delivered in August 2025 wearing a refreshed livery. President Director Glenny Kairupan, appointed in 2025, has made fleet serviceability the company's single highest priority, targeting at least 68 serviceable Garuda aircraft and 50 at Citilink by the end of 2026 through an accelerated heavy maintenance programme, alongside a three-way merger with Citilink and Pelita Air.",
  recent_news: [
    { headline: "Garuda targets at least 68 serviceable aircraft by end-2026 through heavy checks on 737-800NG, 777-300ER and A330 fleets plus engine, APU and landing gear overhauls", source: "Tempo", date: "Mar 2026" },
    { headline: "Danantara says it is ready to buy 50 Boeing aircraft but the seven-year delivery queue and financing scheme remain unresolved", source: "Tempo / Antara", date: "Feb 2026" },
    { headline: "Garuda's 50-jet Boeing deal hinges on financing as merger with Citilink and Pelita Air is prioritised for fleet efficiency", source: "ch-aviation", date: "Mar 2026" },
    { headline: "Garuda adjusts its board and secures $1.4 billion in funding as the turnaround programme moves into execution", source: "ch-aviation", date: "2026" },
  ],
  key_metrics: [
    { label: "Serviceable Aircraft Target", value: "68 by end-2026" },
    { label: "Boeing Commitment", value: "50 aircraft, ~$13.5B" },
    { label: "Danantara Injection", value: "Rp23.67T (2025)" },
    { label: "737 MAX in Fleet", value: "1 (leased, Aug 2025)" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Delivery slots have replaced price as the scarce resource: Danantara has publicly said the roughly seven-year global wait is the reason a 50-aircraft commitment has not converted into a contract, and Indonesian officials now discuss slots before they discuss discounts",
    "State consolidation of Indonesian aviation is under way, with the Garuda, Citilink and Pelita Air merger designed to rationalise fleets and route overlap before new capacity is ordered",
    "Fleet serviceability, not fleet size, is the limiting factor for Indonesian carriers — grounded aircraft awaiting heavy checks, engine shop visits and spares have cost more capacity than any absence of orders",
    "Trade policy is now an aviation variable: Indonesia's tariff agreement with Washington embedded a commercial aircraft purchase commitment, tying airline fleet planning to macroeconomic negotiation",
  ],
  competitive_context: "Garuda's domestic competition is Lion Air Group, the largest 737 operator in Southeast Asia and a long-standing Boeing customer, plus AirAsia Indonesia on the low-cost side. On fleet choices Garuda has run mixed: Boeing narrowbodies and long-haul 777-300ERs alongside Airbus A330neos, with a historic order for 49 737 MAX aircraft that was suspended after the Lion Air Flight 610 accident and never fully resolved. Airbus is an active competitor for any narrowbody recommitment. GMF AeroAsia competes regionally against SIA Engineering, ST Engineering and Malaysian MRO providers for third-party heavy maintenance, and is expanding capability precisely as regional 737 fleets grow.",
}

const countryData: ResearchResult["country"] = {
  name: "Indonesia",
  overview: "Indonesia is Southeast Asia's largest aviation market by population and geography — an archipelago of more than 17,000 islands where air transport is basic national infrastructure rather than a premium product. Aviation policy is shaped by three forces: state ownership, exercised through Danantara and the state-owned enterprises ministry; price regulation, with government pressure on domestic fares that compresses carrier margins; and a demanding safety record history that made regulatory credibility a national project. The 737 MAX carries specific weight here: the Lion Air Flight 610 accident in 2018 was Indonesian, and public confidence in the type remains a live consideration for any state carrier ordering it.",
  priorities: [
    "Restore fleet serviceability and production capacity before adding aircraft — the explicit stated priority of Garuda's 2026 strategy",
    "Complete the Garuda, Citilink and Pelita Air merger to eliminate route and fleet duplication",
    "Convert the 50-aircraft Boeing commitment under the reciprocal trade agreement into a financeable, deliverable order",
    "Grow GMF AeroAsia into a regionally competitive MRO that keeps maintenance spending inside Indonesia",
    "Expand connectivity to underserved regions and support new airport infrastructure without adding unsustainable capacity",
  ],
  bilateral_context: "The Indonesia-US reciprocal trade agreement reduced tariffs on Indonesian exports from 32 to 19 percent, with a commitment to acquire roughly 50 Boeing aircraft valued near $13.5 billion embedded in the package. That makes this order politically visible on both sides: it is a trade deliverable, not just a fleet decision, which raises the cost of failure and the scrutiny of terms. Boeing's Indonesian relationship is long — Lion Air is one of the region's largest 737 operators and Garuda has flown Boeing narrowbodies and widebodies for decades — but the commercial relationship now runs through Danantara and the investment ministry as much as through the airline.",
  concerns: [
    "Delivery timing — a seven-year wait is a genuine obstacle when the fleet gap is now; Indonesian officials have said explicitly they need aircraft sooner than the standard queue allows",
    "Financing structure: Danantara has not committed capital and is weighing schemes including further injections, lease structures and export credit",
    "737 MAX public perception in Indonesia, which is a real reputational factor for a state-owned flag carrier",
    "Cash discipline during a turnaround — every rupiah spent on fleet renewal competes with heavy maintenance that returns grounded aircraft to service faster",
    "Local content and MRO participation, with pressure to route maintenance and training work to GMF AeroAsia rather than overseas providers",
  ],
}

export const garudaResearch: Record<string, ResearchResult> = {
  "glenny-kairupan": {
    person: {
      name: "Glenny Kairupan",
      title: "President Director & Chief Executive Officer, Garuda Indonesia",
      background: "Glenny Kairupan became President Director of Garuda Indonesia in 2025, succeeding Wamildan Tsani Panjaitan, and took charge of a carrier operating around 58 aircraft against a much larger owned and leased fleet. His 2026 strategy rests on eleven transformation initiatives covering route network optimisation, capacity enhancement, digital transformation, revenue management and cargo monetisation, but the operational core is a heavy maintenance acceleration programme spanning airframe checks on the 737-800NG, 777-300ER and A330 fleets plus engine, auxiliary power unit and landing gear overhauls. He has publicly framed 2026 as the year Garuda accelerates its recovery toward a solid turnaround, backed by the Danantara capital injection secured at the end of 2025.",
      linkedin_posts: [
        { text: "Through capital injection support at the end of 2025, Garuda Indonesia targets at least 68 serviceable aircraft by the end of 2026, while Citilink targets 50. Serviceability is the number that decides everything else.", date: "March 2026" },
        { text: "Our declining performance in the first half of 2025 was driven by limited production capacity — aircraft awaiting scheduled maintenance. Fixing that is not glamorous work, but it is the work.", date: "March 2026" },
        { text: "Eleven strategic initiatives, executed in a disciplined and measured manner. 2026 is positioned as the year we accelerate the company's performance recovery.", date: "March 2026" },
      ],
      profile_overview: "Kairupan is running a turnaround and is explicit that returning grounded aircraft to service beats acquiring new ones in the near term. That framing matters for any Boeing conversation: a 50-aircraft order is politically real but operationally secondary to his 68-aircraft serviceability target and the Citilink and Pelita merger. The subjects where he has genuine urgency are spares availability, engine and component turnaround times, technical support for the existing 737-800NG and 777-300ER fleets, and anything that shortens heavy check duration. Come with an aftermarket and support proposition first and the fleet renewal conversation second; leading with new aircraft signals that you have not read his situation.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "rosan-roeslani": {
    person: {
      name: "Rosan Perkasa Roeslani",
      title: "Minister of Investment and Downstream Industry & CEO, Danantara Indonesia",
      background: "Rosan Perkasa Roeslani serves as Minister of Investment and Downstream Industry and head of BKPM, and leads Danantara Indonesia, the sovereign investment management agency that consolidated state-owned enterprise holdings including Garuda Indonesia. A businessman before entering government — he chaired the Indonesian Chamber of Commerce and served as ambassador to the United States — he was central to negotiating the reciprocal tariff agreement with Washington that cut duties on Indonesian exports from 32 to 19 percent and embedded commitments including the purchase of about 50 Boeing aircraft. He now controls both the capital that would fund Garuda's fleet renewal and the political mandate that created the commitment.",
      linkedin_posts: [
        { text: "From the reciprocal tariff agreement there are several activities involving the investment ministry and Danantara, including the plan to purchase 50 aircraft from Boeing.", date: "February 2026" },
        { text: "Danantara's mandate is to make state assets productive. That means capital discipline: we fund what generates returns, on terms we can defend.", date: "April 2026" },
        { text: "Investment relationships are built over decades. Trade agreements open the door; execution is what keeps it open.", date: "March 2026" },
      ],
      profile_overview: "Rosan is the decision-maker who matters most on the 50-aircraft commitment: he holds the capital, he negotiated the trade framework it sits inside, and he answers to the president for both. His interest is national — investment inflows, industrial downstream activity, jobs — rather than airline operational detail, so the conversation that engages him is what a Boeing relationship brings Indonesia beyond aircraft: supply chain participation, MRO investment, training, and financing structures that do not strain the state balance sheet. His American experience as former ambassador means he is comfortable and direct with US executives. He will also be alert to the political cost if a headline trade commitment quietly fails to convert.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "rohan-hafas": {
    person: {
      name: "Rohan Hafas",
      title: "Managing Director, Stakeholder Management, Danantara Indonesia",
      background: "Rohan Hafas is Managing Director of Stakeholder Management at Danantara Indonesia, the sovereign fund's public and institutional interface, and has become the most candid official voice on the Boeing purchase. In February 2026 he confirmed Danantara was examining schemes for buying 50 aircraft for Garuda, while stating plainly that discussions remained at government technical level, that no payment had been made, and that the roughly seven-year manufacturer delivery queue was the practical obstacle. He has also linked the fleet question to sequencing, arguing that the Garuda, Citilink and Pelita merger should come first so that fleet quantity is efficient for a consolidated route network.",
      linkedin_posts: [
        { text: "We are ready to buy 50 units, but this is still a technical discussion. Choosing the type matters less than delivery time — we have said we need aircraft sooner than seven years.", date: "February 2026" },
        { text: "The priority is to merge first. Combining Garuda, Citilink and Pelita makes the fleet efficient for a single route network before we add to it.", date: "February 2026" },
        { text: "Capital injection can be done later. We are potential buyers who have not paid — that distinction matters in how these conversations are reported.", date: "February 2026" },
      ],
      profile_overview: "Hafas is the working-level counterpart on the Boeing commitment and unusually transparent about where it actually stands, which makes him valuable and dangerous in equal measure: what he says publicly becomes the market's understanding of the deal. His two stated blockers are delivery timing and sequencing behind the merger, so any progress with him requires a concrete slot conversation — early positions, lease bridges, used aircraft, or transferred slots — rather than a commercial pitch. He is also the person to align with on messaging before any air show announcement, because he will be asked about it immediately and will answer honestly.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "andi-fahrurrozi": {
    person: {
      name: "Andi Fahrurrozi",
      title: "President Director & CEO, GMF AeroAsia",
      background: "Andi Fahrurrozi was appointed President and CEO of PT Garuda Maintenance Facility Aero Asia Tbk in August 2021, having previously served as Director of Business and Base Operation and, before that, Vice President of Component Services and of Logistics and Bonded Services. Born in Temanggung, Central Java in 1980, he holds bachelor's and master's degrees in aeronautics from Bandung Institute of Technology. He has led GMF through a period of aggressive restructuring, including a quasi-reorganisation approved by shareholders in 2026 to repair the capital structure, while positioning the company as an integrated maintenance provider competing for third-party work across the region rather than depending on Garuda group volume.",
      linkedin_posts: [
        { text: "The quasi-reorganisation marks an important step in strengthening our financial foundation. A healthier capital structure gives us the capacity to attract investors and strategic partners.", date: "July 2026" },
        { text: "2025 was a defining year for GMF in executing transformation initiatives aggressively but measurably. None of it would have been possible without a more solid operational foundation.", date: "May 2026" },
        { text: "We have grown significantly and sustainably. With stronger and more adaptive capabilities, GMFI will keep unlocking opportunities in the national and global aviation industries.", date: "May 2026" },
      ],
      profile_overview: "Andi runs the capability that determines whether Garuda's serviceability targets are achievable and whether Indonesian maintenance spending stays in the country. An aeronautical engineer by training, he is technically fluent and focused on capability expansion, partner relationships and third-party volume — the areas where an OEM services relationship has direct commercial value. Live subjects with him include 737 heavy check capacity, component and engine capability, parts pooling, and authorised service provider arrangements that would let GMF capture growing 737 MAX work across Southeast Asia. He is also the natural landing point for any local-content commitment attached to a Garuda order, and he will hold you to specifics.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
