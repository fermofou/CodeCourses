import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/execute": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/result": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/challenge": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/challenge/, "/challenge"),
      },
      "/user": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/leaderboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/problems": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/problems/, "/problems"),
      },
      "/rewards": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "api/challenge": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
