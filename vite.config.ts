import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/execute': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/result': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/challenge': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
