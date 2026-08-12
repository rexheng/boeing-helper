import { useState, useEffect, useMemo } from "react"
import { people, type Person } from "../data/people"
import { getPartnerById, type Company } from "../data/companies"
import { Check, Loader2, ExternalLink, UserPlus, Search } from "lucide-react"
import { getJudgesByCompany, findJudgeByName } from "../data/research/judges"

function partnerContactsAsPeople(company: Company): Person[] {
  const partner = getPartnerById(company.id)
  if (!partner?.contacts?.length) return []
  return partner.contacts.map((ct) => ({
    id: ct.id,
    companyId: company.id,
    name: ct.name,
    surname: ct.surname,
    title: ct.title,
    headline: ct.headline,
    initial: ct.name.charAt(0).toUpperCase(),
    seniority: ct.seniority,
    photoUrl: ct.photoUrl,
    linkedinUrl: ct.linkedinUrl,
    isCustom: true,
  }))
}

interface Props {
  company: Company
  prefetchedContacts?: Person[] | null
  contactsLoading?: boolean
  onSelect: (person: Person) => void
}

export function PersonSelect({ company, prefetchedContacts, contactsLoading: externalLoading, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [dynamicPeople, setDynamicPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)
  const [manualName, setManualName] = useState("")
  const [manualTitle, setManualTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const seeded = people.filter((p) => p.companyId === company.id)
    if (seeded.length > 0) {
      setDynamicPeople([])
      setLoading(false)
      return
    }

    const fromPartner = partnerContactsAsPeople(company)
    if (fromPartner.length > 0) {
      setDynamicPeople(fromPartner)
      setLoading(false)
      return
    }

    if (prefetchedContacts !== undefined && prefetchedContacts !== null) {
      setDynamicPeople(prefetchedContacts)
      setLoading(false)
      return
    }

    const judges = getJudgesByCompany(company.name)
    if (judges.length > 0) {
      setDynamicPeople(
        judges.map((j) => ({
          id: j.slug,
          companyId: company.id,
          name: j.name,
          title: j.title,
          headline: j.title,
          initial: j.name.charAt(0).toUpperCase(),
          isCustom: true,
        })),
      )
      setLoading(false)
      return
    }

    if (externalLoading) return
    setDynamicPeople([])
    setLoading(false)
  }, [company, prefetchedContacts, externalLoading])

  useEffect(() => {
    if (prefetchedContacts && prefetchedContacts.length > 0 && dynamicPeople.length === 0) {
      const seeded = people.filter((p) => p.companyId === company.id)
      if (seeded.length === 0) setDynamicPeople(prefetchedContacts)
    }
  }, [prefetchedContacts, company.id, dynamicPeople.length])

  const seeded = people.filter((p) => p.companyId === company.id)
  const filtered = seeded.length > 0 ? seeded : dynamicPeople

  // Fuzzy match search query against hidden judge names
  const matchedJudge = useMemo(() => findJudgeByName(searchQuery), [searchQuery])

  const handleClick = (person: Person) => {
    setSelected(person.id)
    onSelect(person)
  }

  const handleJudgeSelect = () => {
    if (!matchedJudge) return
    const slug = matchedJudge.name.toLowerCase().replace(/ /g, "-")
    const person: Person = {
      id: slug,
      companyId: company.id,
      name: matchedJudge.name,
      title: matchedJudge.title,
      headline: `${matchedJudge.title}`,
      initial: matchedJudge.name.charAt(0).toUpperCase(),
      isCustom: true,
    }
    onSelect(person)
  }

  const handleManualSubmit = () => {
    if (!manualName.trim() || !manualTitle.trim()) return
    const person: Person = {
      id: `manual-${Date.now()}`,
      companyId: company.id,
      name: manualName.trim(),
      title: manualTitle.trim(),
      headline: `${manualTitle.trim()} at ${company.name}`,
      initial: manualName.trim().charAt(0).toUpperCase(),
      isCustom: true,
    }
    onSelect(person)
  }

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="system-badge system-badge--dark mb-3">Step 02 &middot; Contact</p>
        <h2
          className="text-2xl md:text-3xl font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          Select contact
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          {company.isCustom && (loading || externalLoading)
            ? `Finding contacts at ${company.name}...`
            : `Select a contact at ${company.name}.`}
        </p>
      </div>

      {/* Name search input */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name"
            className="w-full h-12 px-4 pl-10 rounded text-sm outline-none transition-colors"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--surface-border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--boeing-blue)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 51, 161, 0.12)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none" }}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>

        {/* Judge match result */}
        {matchedJudge && (
          <button
            onClick={handleJudgeSelect}
            className="w-full mt-3 flex items-center gap-4 p-4 glass-card text-left cursor-pointer"
            style={{ animation: "fadeInUp 0.3s ease-out" }}
          >
            <div
              className="w-12 h-12 rounded flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ background: "var(--boeing-blue)" }}
            >
              {matchedJudge.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{matchedJudge.name}</h3>
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{matchedJudge.title}</p>
            </div>
          </button>
        )}
      </div>

      {(loading || externalLoading) && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--boeing-blue)" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Searching for contacts...</p>
        </div>
      )}

      {!loading && !externalLoading && filtered.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {filtered.map((person) => {
            const isSelected = selected === person.id
            return (
              <button
                key={person.id}
                onClick={() => handleClick(person)}
                className="relative flex flex-col items-center p-6 glass-card cursor-pointer"
                style={isSelected ? { borderColor: "var(--boeing-blue)", background: "var(--boeing-ice)" } : undefined}
              >
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="w-14 h-14 rounded object-cover mb-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = "flex"
                      }
                    }}
                  />
                ) : null}
                <div
                  className="w-14 h-14 rounded items-center justify-center mb-3"
                  style={{ display: person.photoUrl ? "none" : "flex", background: "var(--boeing-blue)" }}
                >
                  <span className="text-white font-bold text-xl">{person.initial}</span>
                </div>

                <h3
                  className="font-semibold text-center text-[15px] flex items-center gap-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {person.name}
                  {person.linkedinUrl && (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--boeing-cyan)" }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </h3>
                <p className="text-[13px] leading-snug text-center mt-1" style={{ color: "var(--text-secondary)" }}>{person.title}</p>
                <p className="text-xs text-center mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>{person.headline}</p>

                {person.seniority && (
                  <span
                    className="mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full"
                    style={{
                      background: "var(--boeing-ice)",
                      color: "var(--boeing-blue)",
                      border: "1px solid rgba(0, 51, 161, 0.18)",
                    }}
                  >
                    {person.seniority}
                  </span>
                )}

                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "var(--boeing-blue)" }}
                  >
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!loading && !externalLoading && filtered.length === 0 && !matchedJudge && (
        <div className="bh-card p-8 max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--boeing-ice)" }}>
              <UserPlus size={22} style={{ color: "var(--boeing-blue)" }} />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No contacts found</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Enter a contact manually to continue.</p>
          </div>
          <div className="space-y-3 text-left">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Name</label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="w-full px-4 py-2.5 rounded text-sm outline-none transition-colors"
                style={{ background: "var(--bg-input)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--boeing-blue)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 51, 161, 0.12)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none" }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Title</label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="e.g. Director of Air Operations"
                className="w-full px-4 py-2.5 rounded text-sm outline-none transition-colors"
                style={{ background: "var(--bg-input)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--boeing-blue)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 51, 161, 0.12)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none" }}
              />
            </div>
          </div>
          <button
            onClick={handleManualSubmit}
            disabled={!manualName.trim() || !manualTitle.trim()}
            className="btn-primary w-full"
          >
            Use this contact
          </button>
        </div>
      )}
    </div>
  )
}
