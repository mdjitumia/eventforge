import type { Config } from "tailwindcss";

const ch = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        site: {
          bg: ch("--s-bg"),
          bg2: ch("--s-bg2"),
          surface: ch("--s-surface"),
          fg: ch("--s-fg"),
          muted: ch("--s-muted"),
          primary: ch("--s-primary"),
          ink: ch("--s-ink"),
          secondary: ch("--s-secondary"),
          accent: ch("--s-accent"),
        },
      },
      fontFamily: {
        heading: ["var(--s-font-h)"],
        body: ["var(--s-font-b)"],
      },
      borderRadius: { site: "var(--s-radius)" },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: { fadeUp: "fadeUp .35s ease both" },
    },
  },
  plugins: [],
} satisfies Config;
