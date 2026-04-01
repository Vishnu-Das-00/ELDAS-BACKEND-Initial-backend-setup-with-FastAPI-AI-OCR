import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        mist: "#ecf4f4",
        tide: "#0f766e",
        sunrise: "#f59e0b",
        coral: "#ef6c57",
        lagoon: "#0b4f54",
      },
      boxShadow: {
        panel: "0 18px 60px -28px rgba(12, 45, 58, 0.35)",
      },
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Manrope", "sans-serif"],
      },
      backgroundImage: {
        "eldas-grid":
          "radial-gradient(circle at top left, rgba(15,118,110,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(245,158,11,0.18), transparent 25%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
