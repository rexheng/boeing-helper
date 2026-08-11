import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1", "5173-i4eda1t3fdz696bb045re-1023b92c.us2.manus.computer", /.+\.manus\.computer$/],
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
