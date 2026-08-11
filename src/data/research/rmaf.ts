import type { ResearchResult } from "../../types/research"

const companyData: ResearchResult["company"] = {
  overview: "The Royal Malaysian Air Force (Tentera Udara Diraja Malaysia) operates from Markas Tentera Udara in Kuala Lumpur under the Ministry of Defence, with a combat fleet of 18 Su-30MKM Flankers at Gong Kedak and eight Boeing F/A-18D Hornets at Butterworth. Airlift rests on ten C-130 Hercules — the oldest now 50 years old, the newest 31 — plus four A400Ms and CN-235s. The MiG-29N fleet has been retired and the Hawk trainers are being replaced by 18 FA-50M Block 20 light combat aircraft from Korea Aerospace Industries under an RM4 billion contract, with the first two arriving in October 2026 into a restructured No. 15 Squadron at Kuantan and the remainder delivered through March 2028. Maritime patrol capability is being rebuilt around Leonardo P-72Ms, with a CAP55 target of six airframes.",
  recent_news: [
    { headline: "RMAF confirms first two FA-50M light combat aircraft arrive in October, with Kuantan base upgrades complete and squadron staffing at 90 percent", source: "Malay Mail / Bernama", date: "Jun 2026" },
    { headline: "Air force chief says C-130 replacement is a necessity as the transport fleet reaches 50 years, with 4.5, fifth and sixth-generation options all under study", source: "Malay Mail", date: "Jun 2026" },
    { headline: "Defence Minister signals FLIT-LCA Phase 2 for another 18 FA-50Ms, doubling the light fighter fleet to 36 aircraft", source: "Defence Security Asia", date: "Jan 2026" },
    { headline: "MRCA acceleration planned under the 13th Malaysia Plan, but a final decision is unlikely before 2034 with full operational capability around 2040", source: "DSA Exhibition", date: "Jan 2026" },
  ],
  key_metrics: [
    { label: "FA-50M Contract", value: "18 aircraft, RM4B (~$920M)" },
    { label: "Fighter Fleet", value: "18 Su-30MKM, 8 F/A-18D" },
    { label: "C-130 Fleet", value: "10 airframes, up to 50 years old" },
    { label: "MRCA Decision", value: "Not before 2034" },
  ],
}

const industryData: ResearchResult["industry"] = {
  trends: [
    "Light combat aircraft as a bridge capability: Malaysia, Thailand and the Philippines have all chosen Korean light fighters and trainers to preserve pilot pipelines and basic strike capability while heavyweight fighter decisions slide into the 2030s",
    "Transport recapitalisation is becoming the region's most valuable near-term programme as Southeast Asian C-130 fleets pass 40 and 50 years, with humanitarian and disaster relief driving the political case as much as military airlift",
    "Industrial Collaboration Programme obligations administered by the Technology Depository Agency shape every major Malaysian contract, and Malaysian aerospace suppliers already sit in global supply chains — CTRM produces composite structures for Boeing commercial programmes",
    "Maritime patrol and surveillance investment continues along the South China Sea littoral, driven by persistent presence around Malaysian energy operations off Sarawak",
  ],
  competitive_context: "Korea Aerospace Industries has won the near-term fight with 18 FA-50Ms and a probable Phase 2 for 18 more. Sukhoi and Boeing sustain the two legacy combat fleets, with Boeing's F/A-18D relationship dating to the 1990s. Airbus supplies the A400M fleet and is a natural contender for both transport and rotary requirements, while Leonardo won maritime patrol with the P-72M and is delivering AW149 helicopters. Lockheed Martin will press the C-130J for the Hercules replacement, and Embraer's C-390 is an active competitor. Any MRCA campaign in the 2030s will pit the F/A-18 successor generation against Rafale, Gripen E, Eurofighter, KF-21 and possibly fifth-generation offers — the RMAF chief has publicly said Malaysia has not yet decided which generation to buy.",
}

const countryData: ResearchResult["country"] = {
  name: "Malaysia",
  overview: "Malaysia spends roughly 1 percent of GDP on defence and plans capability through the Capability Development Plan 2055 (CAP55), whose first phase runs 2021 to 2030 with seven core programmes aimed at closing critical gaps. Procurement is funded through five-year Malaysia Plans — the 13th, RMK13, is the current vehicle — and every major acquisition carries Industrial Collaboration Programme obligations administered by the Technology Depository Agency. Kuala Lumpur maintains a carefully non-aligned posture: it manages Chinese coast guard presence around Luconia Shoals and Petronas operations off Sarawak through diplomacy rather than confrontation, and it declines to frame procurement as strategic alignment. Defence procurement is also politically scrutinised after past programme scandals, making transparency and deliverability unusually important.",
  priorities: [
    "Induct the FA-50M on schedule from October 2026 and stand up No. 15 Squadron at Kuantan, restoring fast-jet activity to a base idle since the MiG-29N retirement",
    "Secure FLIT-LCA Phase 2 for a further 18 aircraft to reach a 36-strong light combat fleet and rebuild the pilot training pipeline",
    "Replace the C-130 fleet, which the air force chief has called a necessity given airframes up to 50 years old",
    "Complete the six-aircraft maritime patrol build-out and sustain surveillance over the South China Sea approaches",
    "Keep the MRCA programme alive through RMK13 planning without committing before the fiscal and technological picture is clearer",
  ],
  bilateral_context: "Malaysia and the United States sustain a working defence relationship without a formal alliance: US assistance supported Malaysian maritime surveillance including ScanEagle unmanned systems, and Malaysian aerospace industry is embedded in American supply chains, with CTRM supplying composite structures for Boeing commercial aircraft. The Boeing commercial relationship is significant — Malaysia Aviation Group operates and has ordered 737 MAX aircraft — and Subang is being redeveloped as an aerospace and MRO hub. Malaysia hosts LIMA at Langkawi and DSA in Kuala Lumpur, both major regional engagement points. Kuala Lumpur will not accept public framing that positions it against China, and ASEAN centrality is a standing talking point in every senior meeting.",
  concerns: [
    "Affordability within a roughly 1 percent of GDP budget spread across three services and a five-year plan cycle",
    "Industrial Collaboration Programme value — Malaysian officials will ask precisely what work packages, technology and jobs come to Malaysian companies",
    "Procurement transparency and delivery record, given intense domestic scrutiny of past defence programmes",
    "Sustainment of a mixed fleet: Russian, American, European and now Korean aircraft in one small air force is a maintenance and training burden",
    "Non-alignment — any suggestion that a purchase signals alignment against China will be publicly rejected in Kuala Lumpur",
  ],
}

export const rmafResearch: Record<string, ResearchResult> = {
  "norazlan-aris": {
    person: {
      name: "Gen. Tan Sri Muhamad Norazlan Aris",
      title: "Chief of Air Force, Royal Malaysian Air Force",
      background: "General Tan Sri Dato' Sri Haji Muhamad Norazlan bin Aris became the 21st Chief of the Royal Malaysian Air Force on 26 June 2025, succeeding Mohd Asghar Khan Goriman Khan. Born in Johor in 1967, he served as Deputy Chief of Air Force from June 2022 until his elevation. His career runs through the operational core of the service: Staff Officer 1 Fighter Operations at No. 1 Air Division, Commanding Officer of No. 11 Squadron flying the Su-30MKM, Base Commander at Gong Kedak, Chief of Staff at Air Operations Command, Air Support Commander and Air Operations Commander. He holds the Panglima Gagah Angkatan Tentera and Panglima Setia Mahkota among numerous honours, and has become the public face of the FA-50M induction and the C-130 replacement debate.",
      linkedin_posts: [
        { text: "The first two FA-50M aircraft arrive in October and the remainder will be delivered in stages through March 2028. Kuantan's upgrades are in their final phase and squadron staffing has reached 90 percent — when the aircraft arrive, we will be ready to operate them without delay.", date: "June 2026" },
        { text: "Of our ten C-130s, the earliest is now 50 years old and the newest is 31. Replacement is not an aspiration, it is a necessity.", date: "June 2026" },
        { text: "We have not yet decided whether the next combat aircraft will be 4.5, fifth or sixth generation. Any procurement must reflect the defensive nature of our National Defence Policy.", date: "June 2026" },
      ],
      profile_overview: "Norazlan is a fighter pilot who runs his programmes on visible milestones — he publicly tracks FA-50M delivery dates, base readiness percentages and pilot conversion progress, and holds his organisation to them. The two openings he has personally named are transport replacement, where he has used the word 'necessity', and the still-undecided generation question for the future combat aircraft. He is careful to anchor every capability statement in Malaysia's defensive defence policy, so pitches framed around deterrence or power projection will land badly. He is also focused on training capacity: the FA-50M matters to him partly because it lets Malaysia train more pilots domestically before they progress to front-line types.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "khaled-nordin": {
    person: {
      name: "Dato' Seri Mohamed Khaled Nordin",
      title: "Minister of Defence, Malaysia",
      background: "Mohamed Khaled Nordin holds the defence portfolio in the unity government and has taken a methodical, publicly documented approach to air force modernisation, answering procurement questions directly in parliamentary oral replies. He has framed the FA-50M FLIT-LCA Phase 2 acquisition as a deliberate component of meeting medium and long-term requirements, while prioritising acceleration of MRCA planning under the 13th Malaysia Plan. A former Minister of Higher Education and Menteri Besar of Johor, he brings a political rather than military background to the role, and he consistently presents modernisation as an incremental, fiscally bounded process executed under the CAP55 framework running to 2055.",
      linkedin_posts: [
        { text: "The FLIT-LCA Phase 2 procurement is a deliberate part of meeting our medium and long-term requirements. We are accelerating MRCA planning under RMK13 while expanding the light combat fleet to preserve readiness and pilot training continuity.", date: "January 2026" },
        { text: "CAP55 exists so that modernisation is executed in stages that balance fiscal reality and industrial constraints. We replace ageing platforms methodically, not opportunistically.", date: "March 2026" },
        { text: "Malaysia's defence posture is defensive. Our acquisitions strengthen sovereignty and regional stability; they are not directed at any country.", date: "February 2026" },
      ],
      profile_overview: "Khaled is the budget and sequencing authority, and his public record makes his logic unusually legible: light combat aircraft now because they are affordable and preserve the training pipeline, MRCA later because the money is not there before RMK13 matures. He has already conceded publicly that an MRCA decision is unlikely before 2034, so any near-term fighter approach is wasted effort. Where he is genuinely engaged is industrial participation and phased affordability — Malaysian work share, technology transfer and jobs are the currency that moves him. He answers to parliament in detail, so proposals that can be defended in a public oral reply have a real advantage over those that cannot.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "nur-hafis": {
    person: {
      name: "Lt Gen. Dato' Nur Hafis Abdul Karim",
      title: "Deputy Chief of Air Force, Royal Malaysian Air Force",
      background: "Lieutenant General Dato' Nur Hafis bin Abdul Karim serves as Deputy Chief of the Royal Malaysian Air Force, the number two position in the service and the appointment traditionally responsible for force generation, personnel and the internal machinery of the air force. He is the senior officer overseeing the conversion effort behind the FA-50M induction: six flight instructors and 56 engineering crew members sent to South Korea for intensive training from October 2025, pilots completing ground school and simulator work before flying the TA-50, and the restructuring of No. 15 Squadron at Kuantan. His office also carries the training-capacity problem created by the Hawk fleet's retirement and the long gap in fast-jet lead-in training.",
      linkedin_posts: [
        { text: "Our pioneer group in Korea has completed ground studies and simulator training and is now flying the TA-50. Crew readiness has to lead aircraft delivery, not follow it.", date: "May 2026" },
        { text: "Rebuilding a training pipeline takes longer than buying an aircraft. Every decision we make now about instructors and simulators shapes the force a decade out.", date: "March 2026" },
        { text: "No. 15 Squadron's restructuring at Kuantan is about more than a new type — it is the return of fast-jet activity to a base that has been quiet for too long.", date: "April 2026" },
      ],
      profile_overview: "Nur Hafis owns the human side of modernisation, which in the RMAF's current state is the binding constraint: aircraft are arriving faster than the service can generate crews and maintainers for them. That makes training systems, simulation, courseware, maintainer development and sustainment manpower the subjects where he has real decision influence and genuine unmet need. He measures progress in people-ready dates rather than delivery dates. A conversation that leads with training and support infrastructure — and treats the airframe as secondary — will get further with him than any capability brief, and he is well placed to advocate internally for whichever partner solves the pipeline problem.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },

  "masro-kaliwon": {
    person: {
      name: "Lt Gen. Dato' Masro Kaliwon",
      title: "Air Operations Commander, Royal Malaysian Air Force",
      background: "Lieutenant General Dato' Masro bin Kaliwon commands RMAF Air Operations Command from Subang, holding responsibility for the day-to-day generation of missions across the Su-30MKM, F/A-18D, transport and rotary fleets. His command executes maritime air patrols over the South China Sea approaches, including the areas around Malaysian energy infrastructure off Sarawak where foreign coast guard presence is persistent, as well as search and rescue, humanitarian relief and support to the other services. He is the officer who feels aircraft availability most directly — the practical consequence of a ten-aircraft C-130 fleet up to 50 years old and an eight-aircraft Hornet force approaching its fourth decade.",
      linkedin_posts: [
        { text: "Availability is the number that matters. A capable aircraft that cannot generate sorties is not a capability.", date: "April 2026" },
        { text: "Maritime air patrols continue daily over our approaches. Presence is a mission in itself, and it is flown by crews and airframes that are working hard.", date: "February 2026" },
        { text: "Preparing operating procedures and infrastructure for the new squadron at Kuantan. Operational integration is where a procurement either works or does not.", date: "January 2026" },
      ],
      profile_overview: "Masro is the operational customer and the sharpest source of truth on what Malaysia's fleets can actually deliver. His pressure points are aircraft availability, spares turnaround and the sustainment burden of running Russian, American, European and Korean types simultaneously. For Boeing the natural subject with him is F/A-18D readiness — availability rates, obsolescence management and how long the Hornet fleet can credibly be held together — plus surveillance and unmanned support to the maritime patrol mission he flies every day. He is unimpressed by capability claims that are not backed by fleet data, and he will happily compare your availability figures with his own.",
    },
    company: companyData,
    industry: industryData,
    country: countryData,
  },
}
