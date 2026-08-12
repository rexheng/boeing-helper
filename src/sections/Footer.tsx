import { HelperLogo } from "../components/HelperLogo"

const footerLinks = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Trust", href: "#trust" },
  { label: "Access", href: "#access" },
  { label: "FAQ", href: "#faq" },
]

export function Footer() {
  return (
    <footer style={{ background: "var(--boeing-navy)", color: "#fff" }}>
      <div className="constrain py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <HelperLogo variant="white" height={36} />
            <p className="mt-3 max-w-sm text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Meeting and biography preparation for Boeing engagement teams.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Footer">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-ui text-sm"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.62)" }}
        >
          <p
            className="font-ui uppercase"
            style={{ color: "var(--boeing-cyan-bright)", letterSpacing: "0.12em" }}
          >
            Internal Use Only
          </p>
          <p>&copy; 2026 Boeing Helper</p>
        </div>
      </div>
    </footer>
  )
}
