import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "The Philippine Air Force, headquartered at Villamor Air Base in Pasay City, is midway through the most significant reorientation in its history: away from decades of counter-insurgency and toward territorial defence in support of the Comprehensive Archipelagic Defence Concept. Its combat capability rests on twelve FA-50PH light fighters, with twelve more contracted from Korea Aerospace Industries in June 2025 for about $700 million and deliveries beginning at the end of 2026, alongside A-29B Super Tucanos. Mobility and ISR run on C-130s, C-295s, S-70i Black Hawks and Insitu ScanEagle unmanned systems. Under Flight Plan 2040 the service seeks 36 multirole fighters for air defence and interdiction, but the programme remains unfunded and Commanding General Arthur Cordura has begun publicly discussing alternatives.",
  recent_news: [
    { headline: "At Pitch Black 2026 in Darwin, Lt Gen Cordura says the PAF is weighing ground-based air defence and unmanned platforms alongside the multirole fighter programme", source: "Janes / Aviation Week", date: "Jul 2026" },
    { headline: "F-16 negotiations continue in limbo as Manila seeks 'imaginative and creative ways' to fund a $5.58 billion proposal for 20 Block 70/72 aircraft", source: "Defense News", date: "Feb 2026" },
    { headline: "Philippines requests KF-21 deliveries between 2027 and 2029, aligning the Korean option with the Horizon 3 planning cycle", source: "Army Recognition", date: "2026" },
    { headline: "Gen. Antonio Nafarrete appointed 61st AFP Chief of Staff on 21 July, succeeding Gen. Romeo Brawner Jr. after his fixed three-year term", source: "Rappler / GMA", date: "Jul 2026" },
  ],
  key_metrics: [
    { label: "Multirole Fighters Sought", value: "36 under Flight Plan 2040" },
    { label: "F-16 Proposal", value: "20 aircraft, $5.58B" },
    { label: "FA-50PH Fleet", value: "12 + 12 on order" },
    { label: "Horizon 3 Programme", value: "~$35B across 188 projects" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Absorptive capacity has become an explicit procurement criterion in Manila: Cordura frames any multirole platform decision against 'how much capability we can actually absorb' as a developing country, which changes what a winning offer looks like",
    "Cheaper distributed capability is competing directly with exquisite platforms — ground-based air defence, loitering munitions and unmanned systems are being evaluated as partial substitutes for a fighter fleet, not just complements",
    "Korean aircraft have built a structural advantage through delivery speed and familiarity: KAI allocated early production slots to deliver twelve additional FA-50PHs roughly six months after contract signature, against three or more years for most new-build fighters",
    "Financing innovation increasingly decides Southeast Asian defence competitions, with export credit, multi-year appropriations and government-to-government structures mattering as much as capability",
  ],
  competitive_context: "Lockheed Martin's F-16 Block 70/72 remains the reference option but is stalled on price, with Defense Secretary Teodoro having returned the $5.58 billion proposal over funding rather than capability. Saab is pitching the Gripen E/F, Leonardo the Eurofighter Typhoon, and Korea Aerospace Industries the KF-21 Boramae, where the Philippines has requested 2027 to 2029 deliveries and benefits from an existing FA-50 sustainment and training relationship. Boeing's Philippine footprint is ISR and commercial: Insitu ScanEagle systems supplied through US assistance, and Philippine Airlines' 787 widebody fleet. Any Boeing defence proposition here has to solve the funding problem the F-16 could not.",
}

const countryData: ResearchResult["country"] = {
  name: "Philippines",
  overview: "The Philippines is a US treaty ally under the 1951 Mutual Defense Treaty, with the alliance deepened in recent years through expanded EDCA base access, larger Balikatan exercises and US foreign military financing. Its defence modernisation runs through the three-phase Horizon programme, of which only 59 of 188 projects have been completed because appropriations have never matched ambition — Congress cut the proposed 50 billion peso modernisation fund to 35 billion in 2025 and moved the balance into 'unprogrammed' funds that budget experts warn cannot be used as planning assumptions. Manila is simultaneously managing sustained Chinese pressure in the West Philippine Sea, which drives urgency that the budget cannot match.",
  priorities: [
    "Complete the transition from internal security operations to territorial defence under the Comprehensive Archipelagic Defence Concept",
    "Build an integrated air defence system able to project air power beyond 200 nautical miles across the archipelago",
    "Resolve the multirole fighter programme — 36 aircraft under Flight Plan 2040 — or find an affordable alternative mix of GBAD and unmanned systems",
    "Absorb the additional twelve FA-50PHs from late 2026 while sustaining the existing fleet's availability",
    "Secure predictable multi-year funding for Horizon 3, whose roughly $35 billion ambition currently outruns appropriations by a wide margin",
  ],
  bilateral_context: "The US-Philippine alliance is the closest it has been in decades: nine EDCA sites, expanded Balikatan exercises, US foreign military financing at unprecedented levels, and Bilateral Defense Guidelines that clarify treaty commitments in the South China Sea. Ambassador Romualdez has said Manila is 'not closing its doors' to US aircraft while making clear that funding, not preference, is the obstacle. That creates an opening for financing creativity — EXIM support, FMF layering, multi-year structures — that a purely commercial offer cannot match. Commercially, Philippine Airlines' Boeing widebody fleet anchors the civil side of the relationship.",
  concerns: [
    "Funding above all else: the defence secretary returned a fighter proposal explicitly because of price, and unprogrammed congressional funds are too uncertain to plan against",
    "Absorptive capacity — infrastructure, maintainers, pilots and sustainment funding for a complex new type, which senior officers raise unprompted",
    "Delivery speed, where Korean competitors have set an expectation of aircraft arriving within a year of contract",
    "Political durability of long programmes across administrations and congressional cycles",
    "Escalation management in the West Philippine Sea, where capability acquisitions are read regionally as signals",
  ],
}

export const pafResearch: Record<string, ResearchResult> = {
  "arthur-cordura": {
    person: {
      name: "Lt Gen. Arthur M. Cordura",
      title: "Commanding General, Philippine Air Force",
      background: "Lieutenant General Arthur M. Cordura commands the Philippine Air Force through its shift from counter-insurgency to territorial defence. He represented the service at Exercise Pitch Black 2026 at RAAF Base Darwin in July 2026, where he set out the PAF's requirement to project air power beyond 200 nautical miles in support of the Comprehensive Archipelagic Defence Concept, and spoke candidly about the affordability of the multirole fighter programme. Under Flight Plan 2040, the service's transformation roadmap, the PAF seeks 36 multirole fighters for air defence and interdiction while simultaneously inducting twelve additional FA-50PHs from the end of 2026 and expanding its unmanned and ground-based air defence holdings.",
      linkedin_posts: [
        { text: "An MRF is very expensive, but you have other options. Ground-based air defence and unmanned platforms have shown us how much air power has changed over the years.", date: "July 2026" },
        { text: "A multirole platform has to be considered in the context of the Philippines as a developing country, and assessed against how much capability we can actually absorb.", date: "July 2026" },
        { text: "The MRF programme remains a critical acquisition to meet our defence requirements — along with the peripherals that go with it. The aircraft alone is never the capability.", date: "July 2026" },
      ],
      profile_overview: "Cordura is unusually candid for a service chief, and his candour is the most useful intelligence available about this programme: he has said publicly that fighters are expensive, that alternatives exist, and that absorption capacity constrains what the Philippines can realistically field. That is not a negotiating posture, it is a budget reality. He responds to propositions that acknowledge the 'peripherals' — infrastructure, munitions, training, sustainment funding — rather than treating them as follow-on business. Boeing's credible ground with him is ISR and unmanned systems, where ScanEagle is already in service, plus anything that improves integrated air defence at a price the PAF can sustain. He will respect a partner who tells him what he cannot afford.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "gilberto-teodoro": {
    person: {
      name: "Gilberto Teodoro Jr.",
      title: "Secretary of National Defense, Republic of the Philippines",
      background: "Gilberto Teodoro Jr. has served as Secretary of National Defense since 2023, in his second stint in the portfolio after holding it from 2007 to 2009. A lawyer and former congressman who ran for president in 2010, he has driven the reorientation of the armed forces toward external defence, the expansion of EDCA cooperation with the United States and the articulation of the Comprehensive Archipelagic Defence Concept. In November 2025 he returned Lockheed Martin's proposal for 20 F-16 Block 70/72 aircraft, priced at $5.58 billion including a research and training centre, telling reporters at Camp Aguinaldo that anything is under consideration except the funding — a formulation that has framed the programme ever since.",
      linkedin_posts: [
        { text: "Anything is under consideration. What is not under consideration right now — and what should be considered — is the funding.", date: "November 2025" },
        { text: "The next chief of staff must continue the reforms: modernisation and the shift from internal security operations to territorial defence. That direction does not change with personalities.", date: "July 2026" },
        { text: "We have received pitches and are in discussions on several platforms. The department will not be rushed into a commitment the budget cannot carry.", date: "February 2026" },
      ],
      profile_overview: "Teodoro is the decision authority and the reason the F-16 programme has not moved: he blocked it on price, publicly and without ambiguity, while keeping every option open. He is a lawyer by training, precise in language, and unimpressed by capability arguments that do not come with a funding mechanism. The only conversations that will advance with him involve money — export credit, foreign military financing layering, multi-year structures, phased delivery that matches appropriations, or capability packages priced for what Congress will actually approve. He is also managing the alliance relationship politically, so he is sensitive to being seen as either captured by Washington or drifting from it.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "antonio-nafarrete": {
    person: {
      name: "Gen. Antonio Nafarrete",
      title: "Chief of Staff, Armed Forces of the Philippines",
      background: "General Antonio G. Nafarrete was appointed the 61st Chief of Staff of the Armed Forces of the Philippines on 21 July 2026, succeeding Gen. Romeo Brawner Jr., who became the first military chief to complete the fixed three-year term established by Republic Act 11939. A member of the Philippine Military Academy 'Bigkis-Lahi' Class of 1990, Nafarrete commanded the Philippine Army from July 2025 and previously led Western Mindanao Command, with earlier service in the 1101st Infantry Brigade, the 11th Infantry Division and the AFP's operations directorate. Under the fixed-term law he can serve until July 2029, giving him an unusually long runway to shape Horizon 3 execution.",
      linkedin_posts: [
        { text: "The transition from internal to external defence is not a slogan. It changes what we buy, how we train and where we base — and it takes longer than any single term.", date: "July 2026" },
        { text: "Honoured to assume command of the Armed Forces. My predecessor set a direction on modernisation and professionalism, and we will carry it forward.", date: "July 2026" },
        { text: "Joint capability is the priority. Air, naval and ground systems that cannot talk to each other are three separate expenses, not one defence.", date: "August 2026" },
      ],
      profile_overview: "Nafarrete is new in post with a three-year runway and an army background, which shapes what he prioritises: joint integration, ground-based air defence and systems that serve the archipelagic defence concept across services rather than a single-service platform. He inherits Horizon 3 with a funding gap he did not create and a fighter decision that has been deferred repeatedly. Early engagement matters — he is forming his positions now — and the useful frame is joint and interoperable capability, integrated air and missile defence, and ISR that supports maritime domain awareness. Expect him to defer platform-specific commitments to Teodoro while shaping the requirement underneath them.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "jose-romualdez": {
    person: {
      name: "Jose Manuel Romualdez",
      title: "Ambassador of the Philippines to the United States",
      background: "Jose Manuel 'Babe' Romualdez has served as Philippine Ambassador to the United States since 2017, making him one of the longest-serving envoys in Washington and the principal channel for alliance business including foreign military sales, EDCA implementation and defence financing. A former newspaper columnist and business executive before his appointment, he is unusually accessible to media and often previews the government's thinking before formal announcements. On the fighter programme he has said publicly that the Philippines is 'not closing its doors' to acquiring American jets but that doing so would require 'imaginative and creative ways' to fund the programme — the clearest official signal that the obstacle is structure, not preference.",
      linkedin_posts: [
        { text: "We are not closing our doors to acquiring American aircraft. But it will take imaginative and creative ways to fund a programme of this size.", date: "February 2026" },
        { text: "The alliance is in its strongest state in decades. Turning that into capability on the ramp is the work that remains.", date: "April 2026" },
        { text: "Financing is where allies can be most useful to each other. Access to US systems means little without a path to pay for them.", date: "March 2026" },
      ],
      profile_overview: "Romualdez is the alliance's dealmaker and the most likely route to unlocking a Philippine acquisition, because he operates on exactly the axis where the programme is stuck: financing structure rather than platform choice. He has direct access to the US administration, Congress, EXIM and the defence industry, and he uses public statements deliberately to shape expectations in both capitals. For Boeing he is the counterpart for exploring FMF layering, export credit and creative multi-year structures before a formal proposal is submitted — the work that would have to be done differently from how the F-16 package was presented. He is warm, media-fluent and fast; assume anything discussed with him may inform his next public comment.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
