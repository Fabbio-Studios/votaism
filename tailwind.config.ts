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
        brand: {
          dark: "#386641",
          primary: "#6A994E",
          light: "#A7C957",
          cream: "#F2E8CF",
          red: "#BC4749",
        },
        surface: {
          light: "#FAF7EE",
          card: "#FFFFFF",
          cream: "#F2E8CF",
          dark: "#1C3321",
        }
      },
      fontFamily: {
        sans: ["var(--font-inclusive-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
        data: ["var(--font-inter)", "monospace", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 8px -2px rgba(56, 102, 65, 0.08), 0 1px 4px -1px rgba(56, 102, 65, 0.04)",
        card: "0 4px 16px -4px rgba(56, 102, 65, 0.10), 0 2px 6px -2px rgba(56, 102, 65, 0.05)",
        highlight: "0 0 0 2px #6A994E, 0 8px 24px -4px rgba(106, 153, 78, 0.25)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      }
    },
  },
  plugins: [],
};

export default config;

