interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  tone?: "light" | "dark"
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
}: SectionHeaderProps) {
  const onDark = tone === "dark"

  return (
    <div className={`mb-10 md:mb-14 ${align === "center" ? "text-center mx-auto" : ""}`}>
      {eyebrow && (
        <p className={`system-badge mb-4 ${onDark ? "" : "system-badge--dark"}`}>{eyebrow}</p>
      )}
      <h2
        className={align === "center" ? "mx-auto" : ""}
        style={{ color: onDark ? "#fff" : undefined, maxWidth: "20ch" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-lg leading-relaxed ${align === "center" ? "mx-auto" : ""}`}
          style={{
            color: onDark ? "rgba(255,255,255,0.82)" : "var(--text-secondary)",
            maxWidth: "58ch",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
