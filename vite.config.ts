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
      "/api/leaderboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leaderboard/, "/leaderboard"),
      },
      "/claim": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/execute": {
        target: "http://142.93.10.227:8080",
        changeOrigin: true,
      },
      "/result": {
        target: "http://142.93.10.227:8080",
        changeOrigin: true,
      },
      "/health": {
        target: "http://142.93.10.227:8080",
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
      "/api/problems": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/problems/, "/problems"),
      },
      "/api/rewards": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rewards/, "/rewards"),
      },
      "api/challenge": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/api/badges": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/badges/, "/badges"),
      },
      "/api/admin/users": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin\/users/, "/admin/users"),
      },
      "/api/admin/users/:id": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/admin\/users\/(.*)/, "/admin/updateUser/$1"),
      },
      "/admin/user/:id/badges": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/admin\/user\/(.*)\/badges/, "/admin/user/$1/badges"),
      },
      "/api/admin/claims": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, "/admin"),
      },
      "/api/myRewards": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myRewards/, "/myRewards"),
      },
    },
  },
});
