interface HelperLogoProps {
  variant?: "blue" | "white"
  className?: string
  height?: number
}

/** Boeing Helper wordmark lockup (official mark + stacked BOEING / HELPER). */
export function HelperLogo({ variant = "blue", className = "", height = 28 }: HelperLogoProps) {
  const src =
    variant === "white"
      ? "/images/boeing-helper-logo-white.svg"
      : "/images/boeing-helper-logo.svg"

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
