import type { Request, Response } from "express"

interface ApolloPersonResult {
  id: string
  name: string
  title: string
  headline: string
  initial: string
  linkedinUrl?: string
  photoUrl?: string
  seniority?: string
}

export async function companyContactsHandler(req: Request, res: Response): Promise<void> {
  const { companyName, companyDomain } = req.body as { companyName: string; companyDomain?: string }

  if (!companyName) {
    res.status(400).json({ error: "Missing companyName" })
    return
  }

  if (!process.env.APOLLO_API_KEY) {
    res.json({ contacts: [], message: "Apollo API key not configured" })
    return
  }

  try {
    const response = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": process.env.APOLLO_API_KEY,
      },
      body: JSON.stringify({
        q_organization_name: companyName,
        ...(companyDomain ? { q_organization_domains: companyDomain } : {}),
        person_seniorities: ["c_suite", "vp", "director", "founder"],
        page: 1,
        per_page: 6,
      }),
    })

    if (!response.ok) {
      console.error("Apollo API error:", response.status, await response.text())
      res.json({ contacts: [], message: "Apollo search failed" })
      return
    }

    const data = (await response.json()) as {
      people?: Array<{
        id: string
        first_name?: string
        last_name?: string
        name?: string
        title?: string
        headline?: string
        linkedin_url?: string
        photo_url?: string
        seniority?: string
      }>
    }

    const contacts: ApolloPersonResult[] = (data.people || []).map((p) => {
      const fullName = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim()
      return {
        id: `apollo-${p.id}`,
        name: fullName,
        title: p.title || "Executive",
        headline: p.headline || `${p.title || "Executive"} at ${companyName}`,
        initial: fullName.charAt(0).toUpperCase(),
        linkedinUrl: p.linkedin_url || undefined,
        photoUrl: p.photo_url || undefined,
        seniority: p.seniority || undefined,
      }
    })

    res.json({ contacts })
  } catch (err) {
    console.error("Apollo handler error:", err)
    res.json({ contacts: [], message: "Apollo request failed" })
  }
}
