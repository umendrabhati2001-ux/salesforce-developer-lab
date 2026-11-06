import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#030712",
          card: "#080e1e",
          surface: "#0e172a",
          border: "#1e293b",
          cyan: "#00F0FF",
          blue: "#0176D3",
          cloud: "#00A1E0",
          violet: "#6366F1",
          purple: "#8B5CF6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 25px -4px rgba(0, 240, 255, 0.45)",
        "neon-blue": "0 0 25px -4px rgba(1, 118, 211, 0.55)",
        "neon-violet": "0 0 25px -4px rgba(99, 102, 241, 0.45)",
        "neon-emerald": "0 0 25px -4px rgba(16, 185, 129, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
