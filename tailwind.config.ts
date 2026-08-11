import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0033A1",
          hover: "#113C65",
          deep: "#0A2240",
          sky: "#005896",
          cyan: "#0078B8",
          ice: "#E3EFFA",
        },
        surface: {
          bg: "#FFFFFF",
          muted: "#F3F4F5",
          card: "#FFFFFF",
          border: "#E9EBED",
        },
        txt: {
          primary: "#253746",
          secondary: "#515F6B",
          muted: "#66737E",
        },
      },
      fontFamily: {
        display: ['"IBM Plex Sans"', '"Source Sans 3"', "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        ui: ['Ubuntu', '"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        serif: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
        pill: "3.125rem",
      },
      maxWidth: {
        content: "72.5rem",
      },
      boxShadow: {
        btn: "2px 7px 13px 2px rgba(0,0,0,0.18)",
        card: "0 2px 12px rgba(10,34,64,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config
