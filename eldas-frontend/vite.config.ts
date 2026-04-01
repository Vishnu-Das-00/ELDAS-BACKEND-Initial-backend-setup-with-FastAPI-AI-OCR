import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) return "charts";
            if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) return "forms";
            if (id.includes("@tanstack/react-query") || id.includes("axios")) return "data";
            if (id.includes("lucide-react")) return "icons";
            return "vendor";
          }

          if (
            id.includes("teacher-dashboard-page") ||
            id.includes("teacher-classroom-page") ||
            id.includes("teacher-tests-page") ||
            id.includes("teacher-test-detail-page")
          ) {
            return "teacher-pages";
          }
          if (
            id.includes("student-dashboard-page") ||
            id.includes("student-classroom-detail-page") ||
            id.includes("student-test-detail-page")
          ) {
            return "student-page";
          }
          if (id.includes("parent-dashboard-page")) return "parent-page";
          if (id.includes("notifications-page")) return "notifications-page";

          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
