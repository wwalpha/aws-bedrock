import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@auth": path.resolve(__dirname, "src/auth"),
      "@store": path.resolve(__dirname, "src/stores"),
      "@": path.resolve(__dirname, "./src")
    }
  }
})
