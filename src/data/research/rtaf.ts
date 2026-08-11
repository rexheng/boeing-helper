import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "The Royal Thai Air Force, headquartered at Don Muang, is Southeast Asia's most combat-experienced air arm after border operations with Cambodia in 2025. Its combat fleet mixes 11 Saab Gripen C/Ds at Wing 7 Surat Thani, ageing F-16A/Bs at Wing 1 Nakhon Ratchasima now 37 years old, upgraded F-5E/F TH and Alpha Jets, with two Saab 340 AEW&C aircraft providing airborne early warning. Transport rests on twelve C-130H/H-30s, BT-67s, ATR-72s and a royal flight that includes Boeing 737s and Airbus types. In August 2025 the RTAF signed the first phase of 'Peace Burapha' — four Gripen E/F aircraft for 19.5 billion baht with deliveries from 2029 — as the opening tranche of a planned 12-aircraft squadron. ACM Seksan Kantha has pressed the government for unit restructuring to turn the RTAF into what he calls a technological force.",
  recent_news: [
    { headline: "Thailand's first Gripen E/F enters the production line at Saab's Linköping facility as ACM Seksan reviews progress in Sweden", source: "Khaosod English", date: "May 2026" },
    { headline: "RTAF to seek funding for eight more Gripen E/Fs in FY2028 as a single proposal rather than smaller batches", source: "The Nation Thailand", date: "Jun 2026" },
    { headline: "Deputy PM and Foreign Minister Sihasak Phuangketkeow meets ACM Seksan on defence cooperation and implementing the offset policy from defence procurement", source: "Thai MFA", date: "Apr 2026" },
    { headline: "ACM Seksan makes introductory visit to Singapore, calling on Minister Chan Chun Sing and touring Sembawang Air Base and the RSAF's UAV Command", source: "MINDEF Singapore", date: "Jun 2026" },
  ],
  key_metrics: [
    { label: "Gripen E/F Programme", value: "12 planned, 4 contracted" },
    { label: "Phase 1 Value", value: "฿19.5B (~$550M)" },
    { label: "F-16 Retirement Window", value: "2028-2035" },
    { label: "C-130 Fleet", value: "12 airframes, ~40 years old" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Offsets have moved from nice-to-have to policy: Thailand now formalises offset obligations across defence procurement, and the Gripen contract was signed alongside a dedicated offset agreement covering technology transfer, industrial cooperation and in-country investment",
    "Airlift recapitalisation is the next major competition across the region — Thailand, Malaysia and the Philippines all operate C-130 fleets past 40 years old and are weighing the C-130J, A400M and Embraer C-390 against extending what they have",
    "Real combat use has changed requirements: the 2025 border operations put a premium on precision munitions stocks, sensor-to-shooter timelines and sustained sortie generation rather than headline platform counts",
    "Local MRO and assembly capability is now an explicit condition of major deals, with Thai Aviation Industries and the RTAF's own engineering directorate positioned to absorb transferred work",
  ],
  competitive_context: "Saab is the incumbent and the winner of the fighter competition, beating around twenty evaluated types with a government-to-government package from Sweden that bundled offsets, financing and training. Lockheed Martin retains the F-16 sustainment relationship and is the natural contender for C-130 replacement with the C-130J. Airbus offers the A400M and H225M, Korea Aerospace Industries supplies T-50TH trainers, and Textron delivered AT-6TH light attack aircraft. Boeing's position is largely commercial and rotary-adjacent: 737s in the royal and VIP fleet, a very large Thai Airways 787 order supporting the wider country relationship, and ScanEagle unmanned systems in Thai service. Any Boeing defence proposition here has to compete against a Swedish package that has already set the offset benchmark.",
}

const countryData: ResearchResult["country"] = {
  name: "Thailand",
  overview: "A US treaty ally since 1954 and host of the Cobra Gold exercise, Thailand pairs long-standing defence ties to Washington with an increasingly diversified supplier base spanning Sweden, South Korea and China. Defence spending sits near 1.3 percent of GDP and is subject to real parliamentary scrutiny, with fighter procurement repeatedly trimmed or deferred through the budget cycle. Political turbulence — repeated changes of government and a military establishment with its own institutional weight — means procurement timelines slip more often than they hold. The 2025 border crisis with Cambodia gave the air force operational credibility and strengthened its budget case.",
  priorities: [
    "Complete the 12-aircraft Gripen E/F squadron, with the eight-aircraft Phase 2 submitted as one FY2028 proposal to accelerate a fully operational squadron",
    "Withdraw the Wing 1 F-16A/Bs on a controlled timeline between 2028 and 2035 without opening an air defence gap",
    "Replace or extend the C-130 fleet and other legacy transports as maintenance support becomes unsustainable",
    "Restructure units and personnel to support what ACM Seksan calls development into a technological force, including drones, cyber and counter-UAS",
    "Maximise offset value — technology transfer, local industrial participation and investment — from every foreign procurement",
  ],
  bilateral_context: "Thailand is the oldest US treaty ally in Asia and hosts Cobra Gold, the region's largest annual multinational exercise, with US-Thai air force cooperation running through decades of F-16 operations and training exchanges. Commercially the relationship is strong and growing: Thai Airways placed one of Southeast Asia's largest widebody orders with Boeing and is building out MRO capacity at U-Tapao. The defence relationship is warm but no longer exclusive — Bangkok has bought Chinese armour and Swedish fighters in the same decade and will keep it that way. Thai officials expect to be treated as a partner with options, not a captive market.",
  concerns: [
    "Budget realism — Thai officials will not engage seriously with a proposal whose funding profile does not fit a phased, multi-year appropriation",
    "Offset delivery: after signing an offset agreement with Saab, Thailand has a live benchmark and will compare any competing package against it in detail",
    "Political continuity risk — programmes must survive changes of government, so phased contracts with clear off-ramps are preferred",
    "Sustainment autonomy, including local spares, depot capability and the ability to keep aircraft flying without external release approvals during a crisis",
    "Regional sensitivity following the Cambodia border operations; Thailand is careful about capabilities that could be framed as offensive",
  ],
}

export const rtafResearch: Record<string, ResearchResult> = {
  "seksan-kantha": {
    person: {
      name: "ACM Seksan Kantha",
      title: "Commander-in-Chief, Royal Thai Air Force",
      background: "Air Chief Marshal Seksan Kantha became the 31st Commander-in-Chief of the Royal Thai Air Force on 1 October 2025, succeeding ACM Punpakdee Pattanakul, who had signed the Gripen E/F contract weeks earlier. He chairs the Thai-Swedish joint government project committee overseeing the fighter programme and travelled to Stockholm in May 2026 to review the start of assembly on Thailand's first aircraft at Linköping and to meet Sweden's defence materiel administration. Since taking command he has pressed the defence ministry for personnel adjustments and unit restructuring, arguing that readiness requires people, technology and continuous training together, and he has kept the RTAF visible in regional engagement — including an introductory visit to Singapore in June 2026.",
      linkedin_posts: [
        { text: "Maintaining combat readiness in normal circumstances is the primary mission of the air force. Readiness requires personnel, technology and continuous training — having the technology is not enough if crews are not proficient in it.", date: "July 2026" },
        { text: "In Stockholm to review progress on our first Gripen E/F. Phase 1 is on plan and we will submit the remaining eight aircraft as a single proposal rather than dividing them into smaller batches.", date: "May 2026" },
        { text: "Grateful to Minister Chan Chun Sing and the RSAF for the visit to Sembawang and the UAV Command. Our air forces have long-standing relations and unmanned capability is a subject we both take seriously.", date: "June 2026" },
      ],
      profile_overview: "Seksan inherited a fighter decision he did not make and is now judged on executing it. His stated agenda is organisational as much as material: unit restructuring, personnel proficiency and turning the RTAF into a technological force, with drones and counter-UAS explicitly on his list after the border operations. He is publicly disciplined about budget process, submitting Phase 2 through the FY2028 cycle rather than pressing for exceptions. For Boeing the credible ground with him is unmanned systems and ISR, airlift recapitalisation as the C-130 fleet reaches the end of supportability, and training and sustainment concepts — not a fighter conversation, which is closed for a decade. He values partners who understand that Thai timelines run through parliament.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "poonsak-piyarat": {
    person: {
      name: "AVM Poonsak Piyarat",
      title: "Director, Policy and Planning Office, Royal Thai Air Force",
      background: "Air Vice Marshal Poonsak Piyarat directs the RTAF's Policy and Planning Office, the staff organisation that turns operational requirements into funded programmes. He managed the staffing of the fighter procurement proposal through Royal Thai Armed Forces Headquarters and the Ministry of Defence during 2025, and publicly set out the phasing and approval path for the Gripen acquisition — three phases across ten years, with the first batch of four aircraft at 19.5 billion baht. His office authors the RTAF White Paper, the document that frames Thailand's long-term air power requirements and against which individual acquisitions are justified to parliament and the cabinet.",
      linkedin_posts: [
        { text: "The procurement proposal goes to Royal Thai Armed Forces Headquarters first, then the Ministry of Defence. Every stage exists to test whether the requirement, the money and the timeline actually match.", date: "June 2025" },
        { text: "Our White Paper is not a wish list. It is the argument we have to be able to defend line by line when the budget committee asks why.", date: "February 2026" },
        { text: "Phasing matters. A ten-year programme divided into deliverable tranches survives political change; a single large request rarely does.", date: "April 2026" },
      ],
      profile_overview: "Poonsak is the staff officer whose paperwork determines whether a capability ever reaches the cabinet, and he thinks in appropriation cycles rather than campaigns. He is the right counterpart for early-stage shaping: what the RTAF White Paper says about airlift, ISR and unmanned systems in the 2030s, how a requirement would be phased, and what evidence the budget committee will demand. He is unlikely to be swayed by capability demonstrations but will engage seriously with cost models, phasing options and offset structures that can be defended publicly. Treat him as the architect of the buying process — get the requirement language right with his office and later meetings become far easier.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "adul-boonthamcharoen": {
    person: {
      name: "Gen. Adul Boonthamcharoen",
      title: "Minister of Defence, Kingdom of Thailand",
      background: "General Adul Boonthamcharoen holds the defence portfolio and has taken an unusually hands-on approach to service readiness, visiting Royal Thai Air Force headquarters in July 2026 for a readiness report and pledging support for the RTAF's operations. He has backed the service's request for personnel adjustments and unit restructuring to support its technological development plans, while keeping the ministry's spending within a constrained fiscal envelope. His tenure coincides with the aftermath of the 2025 Thai-Cambodian border crisis, which reshaped the ministry's priorities around readiness, munitions stocks and joint operations between the army, navy and air force.",
      linkedin_posts: [
        { text: "I have confirmed full support for the Royal Thai Air Force's operations. Readiness is built on people, technology and training, and the ministry will back the restructuring needed to sustain it.", date: "July 2026" },
        { text: "Joint terrain surveys with the army, navy and air force are how we prepare — understanding the ground before it is needed, not after.", date: "July 2026" },
        { text: "Modernisation must fit the budget the country can actually sustain. That is not a limitation; it is the discipline that makes programmes finishable.", date: "May 2026" },
      ],
      profile_overview: "Adul is the approval layer between the RTAF's ambitions and the cabinet, and his instinct is readiness over acquisition: he has been more visible supporting personnel and restructuring than championing new platforms. Any proposition needs to answer his question of whether Thailand can sustain it, both financially and operationally, after the sales campaign ends. He also cares about jointness following the border operations — capabilities that serve army and navy requirements as well as the air force will get a better hearing. Keep the conversation short, concrete and focused on affordability and sustainment; he is not the audience for platform theatre.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "sihasak-phuangketkeow": {
    person: {
      name: "Sihasak Phuangketkeow",
      title: "Deputy Prime Minister and Minister of Foreign Affairs, Thailand",
      background: "Sihasak Phuangketkeow is a career diplomat who rose to Permanent Secretary of the Ministry of Foreign Affairs and served as Thailand's ambassador to the United Nations in Geneva and to Japan before returning to senior political office as Deputy Prime Minister and Foreign Minister. In April 2026 he met ACM Seksan Kantha to discuss enhancing defence cooperation through diplomatic mechanisms and strategic partnership frameworks, and specifically how to implement Thailand's offset policy from defence procurement so that industrial benefits reach sectors beyond defence. He is one of the government's principal voices on managing relations with both Washington and Beijing.",
      linkedin_posts: [
        { text: "Met the Commander-in-Chief of the Royal Thai Air Force to discuss how defence procurement can deliver tangible, mutual benefit through our offset policy — not only for the armed forces but across sectors.", date: "April 2026" },
        { text: "Strategic partnership frameworks are instruments, not statements. They only matter when they produce cooperation that both sides can point to.", date: "March 2026" },
        { text: "Thailand's foreign policy has always been about keeping options open and relationships warm. That is not indecision — it is how a middle power stays sovereign.", date: "February 2026" },
      ],
      profile_overview: "Sihasak is where defence procurement meets Thai foreign policy, and he has made offsets his explicit interest: he wants industrial cooperation, technology transfer and investment that benefit the wider economy rather than the armed forces alone. That makes him the most receptive senior official to an industrial partnership pitch — aerospace MRO, supply-chain participation, training and skills — provided it is framed as national economic benefit rather than as a sweetener attached to a sale. He is also the guardian of Thailand's balanced posture and will be alert to anything that reads as pressure to align. Diplomatic register, long-horizon framing and concrete industrial commitments work best with him.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
