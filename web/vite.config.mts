import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { redwood } from "rwsdk/vite"
import { defineConfig } from "vite"

export default defineConfig({
  environments: {
    ssr: {},
  },
  plugins: [redwood(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
