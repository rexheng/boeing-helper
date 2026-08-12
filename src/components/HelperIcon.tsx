interface HelperIconProps {
  variant?: "blue" | "white"
  className?: string
  size?: number
}

/** Boeing Helper H mark — used for favicon-scale chrome and compact branding. */
export function HelperIcon({ variant = "blue", className = "", size = 28 }: HelperIconProps) {
  const src =
    variant === "white" ? "/images/helper-icon-white.png" : "/images/helper-icon.png"

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, display: "block", objectFit: "contain" }}
      decoding="async"
      aria-hidden="true"
    />
  )
}
