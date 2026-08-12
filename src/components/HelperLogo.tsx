interface HelperLogoProps {
  variant?: "blue" | "white"
  className?: string
  height?: number
}

/** Boeing Helper wordmark lockup — user-provided brand art. */
export function HelperLogo({ variant = "blue", className = "", height = 28 }: HelperLogoProps) {
  const src =
    variant === "white"
      ? "/images/boeing-helper-logo-white.png"
      : "/images/boeing-helper-logo.png"

  return (
    <img
      src={src}
      alt="Boeing Helper"
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
      decoding="async"
    />
  )
}
