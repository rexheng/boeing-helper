export interface Person {
  id: string
  companyId: string
  name: string
  /**
   * Family / address surname for salutations (e.g. "Minister Chan").
   * Curated explicitly — do not infer from the last token of `name`
   * (Chinese and Vietnamese names often put the family name first).
   */
  surname?: string
  title: string
  headline: string
  initial: string
  linkedinUrl?: string
  photoUrl?: string
  seniority?: string
  isCustom?: boolean
  videoId?: string
  videoStart?: number
}

/** Surname for Dear / Minister lines — prefers curated `surname`. */
export function personSurname(person: Pick<Person, "name" | "surname">): string {
  if (person.surname?.trim()) return person.surname.trim()
  // Manual / dynamic contacts only: last token is a last-resort fallback.
  const parts = person.name.trim().split(/\s+/).filter(Boolean)
  return parts[parts.length - 1] || person.name
}

export const people: Person[] = [
  // American Airlines — titles from aa.com corporate structure
  { id: "robert-isom", companyId: "american", name: "Robert D. Isom", surname: "Isom", title: "Chief Executive Officer, American Airlines Group & American Airlines", headline: "CEO since 2022 — dual-source fleet, 89 737-8 MAX in service, remaining 787-9 stream and MAX 10 certification timing", initial: "R", photoUrl: "/people/robert-d-isom.webp", seniority: "C-Suite" },
  { id: "david-seymour", companyId: "american", name: "David Seymour", surname: "Seymour", title: "Chief Operating Officer", headline: "COO absorbing 737-8 MAX and 787-9 induction while DFW re-banks to a 13-bank structure", initial: "D", photoUrl: "/people/david-seymour.jpg", seniority: "C-Suite" },
  { id: "devon-may", companyId: "american", name: "Devon May", surname: "May", title: "Chief Financial Officer", headline: "CFO defending 2026 free-cash-flow >$2B and scoring Boeing delivery dates against the debt path", initial: "D", photoUrl: "/people/devon-may.jpg", seniority: "C-Suite" },
  { id: "nat-pieper", companyId: "american", name: "Nat Pieper", surname: "Pieper", title: "Chief Commercial Officer", headline: "CCO converting Flagship Suite on 787-9 and 777 retrofits into the premium-seat lead American has already claimed", initial: "N", photoUrl: "/people/nathaniel-pieper.jpg", seniority: "C-Suite" },

  // Delta Air Lines — titles from news.delta.com leader bios / 5 Mar 2026 employee memo
  { id: "ed-bastian", companyId: "delta", name: "Ed Bastian", surname: "Bastian", title: "Chief Executive Officer", headline: "Tenth year as CEO in 2026 — owns 737-10 EIS credibility and Delta’s first direct 787-10 order", initial: "E", seniority: "C-Suite" },
  { id: "peter-carter", companyId: "delta", name: "Peter Carter", surname: "Carter", title: "President", headline: "President from April 2026 — international portfolio, JV product and 787-10 cabin commonality with A350", initial: "P", seniority: "C-Suite" },
  { id: "dan-janki", companyId: "delta", name: "Dan Janki", surname: "Janki", title: "EVP and Chief Operating Officer", headline: "COO from April 2026 after the CFO chair — 737-10 entry-into-service and the cost of a further slip", initial: "D", seniority: "C-Suite" },
  { id: "alain-bellemare", companyId: "delta", name: "Alain Bellemare", surname: "Bellemare", title: "President – International and Chairman, Delta TechOps", headline: "International equity plus TechOps chair — LEAP-1B shop now, GEnx path for the 787-10", initial: "A", seniority: "C-Suite" },

  // Ministry of Defence Singapore / RSAF
  // Chinese Singapore names: family name first (Chan Chun Sing → Chan), except Western-given + Chinese surname (Kelvin Fan… → Fan; Aaron Beng → Beng).
  { id: "chan-chun-sing", companyId: "mindef-sg", name: "Chan Chun Sing", surname: "Chan", title: "Minister for Defence", headline: "Former Chief of Army, Defence Minister since May 2025 — owns the 20-aircraft F-35 commitment and Singapore's 'diversified fleet' doctrine", initial: "C", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2025_Chan_Chun_Sing_%28cropped%29.jpg/330px-2025_Chan_Chun_Sing_%28cropped%29.jpg", seniority: "Minister" },
  { id: "kelvin-fan", companyId: "mindef-sg", name: "MG Kelvin Fan Sui Siong", surname: "Fan", title: "Chief of Air Force, RSAF", headline: "Calls F-35 and P-8A the RSAF's 'game-changers' — running AH-64D life extension, CH-47F fleet and a used-airframe C-130 refresh", initial: "K", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Portrait_of_Kelvin_Fan_in_2017.jpg/330px-Portrait_of_Kelvin_Fan_in_2017.jpg", seniority: "Service Chief" },
  { id: "aaron-beng", companyId: "mindef-sg", name: "VADM Aaron Beng", surname: "Beng", title: "Chief of Defence Force, SAF", headline: "Joint-force chief pushing drones, counter-UAS and readiness lessons from Ukraine and the Red Sea into SAF force design", initial: "A", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Singapore_Chief_of_Defense_Vice_Admiral_Aaron_Beng_at_Munich_Security_Conference%2C_Germany_on_February_15%2C_2025_%28cropped%29.jpg/330px-Singapore_Chief_of_Defense_Vice_Admiral_Aaron_Beng_at_Munich_Security_Conference%2C_Germany_on_February_15%2C_2025_%28cropped%29.jpg", seniority: "Service Chief" },
  { id: "ng-chad-son", companyId: "mindef-sg", name: "Ng Chad-Son", surname: "Ng", title: "Permanent Secretary (Defence Development)", headline: "Delivered F-35, P-8A and G550 programmes as DSTA chief executive — now MINDEF's acquisition and technology gatekeeper", initial: "N", seniority: "Permanent Secretary" },

  // Ministry of Defense of the Republic of Indonesia (Kemhan RI)
  { id: "sjafrie-sjamsoeddin", companyId: "mod-id", name: "Sjafrie Sjamsoeddin", surname: "Sjamsoeddin", title: "Minister of Defense", headline: "Prabowo's defence minister since Oct 2024 — pushing 'defensive active' doctrine, centralised procurement and hard budget discipline", initial: "S", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sjafrie_Sjamsoeddin_2025_Portrait.png/330px-Sjafrie_Sjamsoeddin_2025_Portrait.png", seniority: "Minister" },
  { id: "tonny-harjono", companyId: "mod-id", name: "ACM Mohamad Tonny Harjono", surname: "Harjono", title: "Chief of Staff, Indonesian Air Force (KSAU)", headline: "Leading Rafale induction and a national radar build-out to close air-surveillance blind spots across the archipelago", initial: "T", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Kasau_Marsekal_TNI_Mohamad_Tonny_Harjono.jpg/330px-Kasau_Marsekal_TNI_Mohamad_Tonny_Harjono.jpg", seniority: "Service Chief" },
  { id: "donny-ermawan", companyId: "mod-id", name: "Donny Ermawan Taufanto", surname: "Taufanto", title: "Deputy Minister of Defense", headline: "Retired air marshal handling budget execution and industrial cooperation — the man who scores offset and local-content offers", initial: "D", seniority: "Deputy Minister" },
  { id: "rico-sirait", companyId: "mod-id", name: "Brig. Gen. Rico Ricardo Sirait", surname: "Sirait", title: "Head of Defense Information Bureau (Infohan)", headline: "Ministry's public voice on procurement — framed the F-15EX exit as a price mismatch, not a policy shift", initial: "R", seniority: "Director" },

  // Royal Thai Air Force
  { id: "seksan-kantha", companyId: "rtaf", name: "ACM Seksan Kantha", surname: "Kantha", title: "Commander-in-Chief, Royal Thai Air Force", headline: "In post since Oct 2025 — driving the 12-aircraft Gripen E/F squadron, transport recapitalisation and a 'technological force' restructure", initial: "S", seniority: "Service Chief" },
  { id: "poonsak-piyarat", companyId: "rtaf", name: "AVM Poonsak Piyarat", surname: "Piyarat", title: "Director, Policy and Planning Office, RTAF", headline: "Writes the RTAF White Paper procurement cases — owns phasing, budget submissions and the FY2028 Gripen tranche proposal", initial: "P", seniority: "Planning Lead" },
  { id: "adul-boonthamcharoen", companyId: "rtaf", name: "Gen. Adul Boonthamcharoen", surname: "Boonthamcharoen", title: "Minister of Defence, Kingdom of Thailand", headline: "Backs RTAF readiness spending but wants unit restructuring and personnel reform tied to every new platform", initial: "A", seniority: "Minister" },
  { id: "sihasak-phuangketkeow", companyId: "rtaf", name: "Sihasak Phuangketkeow", surname: "Phuangketkeow", title: "Deputy Prime Minister and Minister of Foreign Affairs", headline: "Career diplomat linking defence procurement to strategic partnerships — pressing for offsets with tangible industrial returns", initial: "S", seniority: "Minister" },

  // Royal Malaysian Air Force / MINDEF Malaysia
  { id: "norazlan-aris", companyId: "rmaf", name: "Gen. Tan Sri Muhamad Norazlan Aris", surname: "Aris", title: "Chief of Air Force (Panglima Tentera Udara)", headline: "21st RMAF chief and former Su-30MKM squadron commander — FA-50M induction in October, C-130 replacement is his stated priority", initial: "N", seniority: "Service Chief" },
  { id: "khaled-nordin", companyId: "rmaf", name: "Dato' Seri Mohamed Khaled Nordin", surname: "Nordin", title: "Minister of Defence, Malaysia", headline: "Sequencing CAP55 in tranches — FLIT-LCA Phase 2 first, MRCA acceleration under RMK13, full capability only around 2040", initial: "K", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Mohamed_Khaled_Nordin%2C_Malaysia_Minister_of_Defense%2C_at_the_International_Institute_for_Strategic_Studies_%28IISS%29_and_21st_Shangri-La_Dialogue_in_Singapore_on_June_1%2C_2024_%28cropped%29.jpg/330px-thumbnail.jpg", seniority: "Minister" },
  { id: "nur-hafis", companyId: "rmaf", name: "Lt Gen. Dato' Nur Hafis Abdul Karim", surname: "Karim", title: "Deputy Chief of Air Force, RMAF", headline: "Runs force generation and training pipelines — owns the conversion plan taking crews from Hawk and MiG legacy fleets to FA-50M", initial: "H", seniority: "Deputy Chief" },
  { id: "masro-kaliwon", companyId: "rmaf", name: "Lt Gen. Dato' Masro Kaliwon", surname: "Kaliwon", title: "Air Operations Commander, RMAF", headline: "Owns readiness across Su-30MKM, F/A-18D and the 10-aircraft C-130 fleet, plus South China Sea maritime air patrols", initial: "M", seniority: "Operations" },

  // Singapore Airlines — Chinese family name first
  { id: "goh-choon-phong", companyId: "sia", name: "Goh Choon Phong", surname: "Goh", title: "Chief Executive Officer", headline: "CEO since 2011 — 31 777-9s on order, Air India stake integration, and an early-stage contest for 50+ next-decade widebodies", initial: "G", linkedinUrl: "https://linkedin.com/in/goh-choon-phong", seniority: "C-Suite" },
  { id: "lee-lik-hsin", companyId: "sia", name: "Lee Lik Hsin", surname: "Lee", title: "EVP Commercial & Chief Commercial Officer", headline: "Former Scoot CEO running network, cargo and customer experience — owns the revenue case for every fleet decision", initial: "L", linkedinUrl: "https://linkedin.com/in/lee-lik-hsin", seniority: "C-Suite" },
  { id: "tan-kai-ping", companyId: "sia", name: "Tan Kai Ping", surname: "Tan", title: "EVP Operations & Chief Operating Officer", headline: "Ex-CFO now running operations — absorbing 777-9 slippage by extending 777-300ERs and resequencing the cabin retrofit programme", initial: "T", linkedinUrl: "https://linkedin.com/in/tan-kai-ping", seniority: "C-Suite" },
  { id: "chin-yau-seng", companyId: "sia", name: "Chin Yau Seng", surname: "Chin", title: "Chief Executive Officer, SIA Engineering Company", headline: "Runs Changi's MRO anchor — base maintenance, component JVs and the capacity question for 787 and future 777-9 heavy checks", initial: "C", linkedinUrl: "https://linkedin.com/in/chin-yau-seng", seniority: "C-Suite" },

  // Garuda Indonesia
  { id: "glenny-kairupan", companyId: "garuda", name: "Glenny Kairupan", surname: "Kairupan", title: "President Director & CEO", headline: "Turnaround CEO targeting 68 serviceable aircraft by year-end via heavy checks on 737-800NG, 777-300ER and A330 fleets", initial: "G", linkedinUrl: "https://linkedin.com/in/glenny-kairupan", seniority: "C-Suite" },
  { id: "rosan-roeslani", companyId: "garuda", name: "Rosan Perkasa Roeslani", surname: "Roeslani", title: "Minister of Investment & CEO, Danantara Indonesia", headline: "Owns the sovereign fund holding Garuda and the 50-aircraft Boeing commitment written into the US-Indonesia tariff agreement", initial: "R", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rosan_Perkasa_Roeslani%2C_Menteri_Investasi_dan_Hilirisasi_%282024%29.webp/330px-Rosan_Perkasa_Roeslani%2C_Menteri_Investasi_dan_Hilirisasi_%282024%29.webp.png", seniority: "Minister" },
  { id: "rohan-hafas", companyId: "garuda", name: "Rohan Hafas", surname: "Hafas", title: "Managing Director, Stakeholder Management, Danantara", headline: "Publicly flagged the seven-year delivery queue as the blocker on the 50-jet order — wants slots before capital", initial: "R", linkedinUrl: "https://linkedin.com/in/rohan-hafas", seniority: "Managing Director" },
  { id: "andi-fahrurrozi", companyId: "garuda", name: "Andi Fahrurrozi", surname: "Fahrurrozi", title: "President Director & CEO, GMF AeroAsia", headline: "Runs Indonesia's largest MRO through a quasi-reorganisation — chasing third-party 737 and widebody heavy-check volume", initial: "A", linkedinUrl: "https://linkedin.com/in/andi-fahrurrozi", seniority: "C-Suite" },

  // Civil Aviation Authority of Vietnam — Vietnamese family name first
  { id: "uong-viet-dung", companyId: "vietnam-caa", name: "Uong Viet Dung", surname: "Uong", title: "Director General, CAAV", headline: "Aircraft engineer turned regulator — implementing the revised Civil Aviation Law and scaling oversight for a fleet growing past 300", initial: "U", seniority: "Director General" },
  { id: "do-hong-cam", companyId: "vietnam-caa", name: "Do Hong Cam", surname: "Do", title: "Deputy Director General, CAAV", headline: "Handles air transport licensing and route rights — the gate for new narrowbody capacity entering the domestic market", initial: "D", seniority: "Deputy DG" },
  { id: "ho-minh-tan", companyId: "vietnam-caa", name: "Ho Minh Tan", surname: "Ho", title: "Deputy Director General, CAAV", headline: "Owns safety oversight and ICAO-standard workforce build-up ahead of Long Thanh's opening and the 737 MAX induction wave", initial: "H", seniority: "Deputy DG" },
  { id: "dang-ngoc-hoa", companyId: "vietnam-caa", name: "Dang Ngoc Hoa", surname: "Dang", title: "Chairman, Vietnam Airlines", headline: "Signed the 50-aircraft 737-8 order in Feb 2026 and is running a parallel campaign for 30 widebodies to hit five-star by 2030", initial: "D", linkedinUrl: "https://linkedin.com/in/dang-ngoc-hoa", seniority: "Chairman" },

  // Philippine Air Force
  { id: "arthur-cordura", companyId: "paf", name: "Lt Gen. Arthur M. Cordura", surname: "Cordura", title: "Commanding General, Philippine Air Force", headline: "Steering Flight Plan 2040 from counter-insurgency to territorial defence — open to GBAD and unmanned options if MRF funding slips", initial: "A", photoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Lt_General_Cordura.jpg/330px-Lt_General_Cordura.jpg", seniority: "Service Chief" },
  { id: "gilberto-teodoro", companyId: "paf", name: "Gilberto Teodoro Jr.", surname: "Teodoro", title: "Secretary of National Defense", headline: "Returned Lockheed's $5.58B F-16 proposal over funding, not capability — demands financing creativity and absorbable capability", initial: "G", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Gilbert_Teodoro%2C_2023_official_portrait.jpg/330px-Gilbert_Teodoro%2C_2023_official_portrait.jpg", seniority: "Secretary" },
  { id: "antonio-nafarrete", companyId: "paf", name: "Gen. Antonio Nafarrete", surname: "Nafarrete", title: "Chief of Staff, Armed Forces of the Philippines", headline: "61st AFP chief since July 2026 — inherits Horizon 3 and the shift to the Comprehensive Archipelagic Defence Concept", initial: "N", photoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/LtGen_Nafarrete.jpg/330px-LtGen_Nafarrete.jpg", seniority: "Service Chief" },
  { id: "jose-romualdez", companyId: "paf", name: "Jose Manuel Romualdez", surname: "Romualdez", title: "Ambassador of the Philippines to the United States", headline: "Says Manila is 'not closing doors' on US platforms but needs imaginative financing — the channel for FMS and EXIM structuring", initial: "J", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Portrait_of_Ambassador_of_the_Philippines_to_the_United_States_Jose_Manuel_Romualdez.jpg/330px-Portrait_of_Ambassador_of_the_Philippines_to_the_United_States_Jose_Manuel_Romualdez.jpg", seniority: "Ambassador" },

  // Japan Airlines
  { id: "mitsuko-tsuchiya", companyId: "jal", name: "Mitsuko Tsuchiya", surname: "Tsuchiya", title: "Senior Vice President, Fleet Strategy (illustrative)", headline: "Fleet planning counterpart for widebody utilisation and cabin programmes", initial: "M", seniority: "VP" },

  // Korean Air
  { id: "walter-cho", companyId: "korean-air", name: "Walter Cho", surname: "Cho", title: "Chairman & CEO, Korean Air", headline: "Leads Korean Air Group through Asiana integration and fleet renewal", initial: "W", seniority: "C-Suite" },

  // Air India
  { id: "campbell-wilson", companyId: "air-india", name: "Campbell Wilson", surname: "Wilson", title: "Chief Executive Officer, Air India", headline: "CEO driving Air India transformation and Boeing delivery ramp", initial: "C", seniority: "C-Suite" },

  // Qantas
  { id: "vanessa-hudson", companyId: "qantas", name: "Vanessa Hudson", surname: "Hudson", title: "Chief Executive Officer, Qantas Group", headline: "CEO owning Project Sunrise timing and group fleet strategy", initial: "V", seniority: "C-Suite" },

  // Australian Department of Defence
  { id: "robert-chipman", companyId: "mod-australia", name: "AIRMSHL Robert Chipman", surname: "Chipman", title: "Chief of Air Force, RAAF", headline: "RAAF chief owning airborne ISR and strike readiness including P-8A and Growler", initial: "R", seniority: "Service Chief" },

  // Emirates
  { id: "ahmed-bin-saeed", companyId: "emirates", name: "HH Sheikh Ahmed bin Saeed Al Maktoum", surname: "Al Maktoum", title: "Chairman & Chief Executive, Emirates Airline", headline: "Chairs Emirates Group — owns fleet strategy including 777X induction", initial: "A", seniority: "Chairman" },

  // Qatar Airways
  { id: "akbar-al-baker", companyId: "qatar-airways", name: "Akbar Al Baker", surname: "Al Baker", title: "Group Chief Executive, Qatar Airways", headline: "Long-serving GCE shaping Qatar's Boeing widebody commitments", initial: "A", seniority: "C-Suite" },
]
