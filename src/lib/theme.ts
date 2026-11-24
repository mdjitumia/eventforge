import type { CSSProperties } from "react";
import type { Theme } from "./types";

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.padEnd(6, "0").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const ch = (hex: string) => hexToRgb(hex).join(" ");
const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const FONTS: Record<Theme["font"], { label: string; heading: string; body: string }> = {
  modern: { label: "Modern Sans", heading: `"Trebuchet MS", "Segoe UI", system-ui, sans-serif`, body: `Inter, "Segoe UI", system-ui, sans-serif` },
  elegant: { label: "Elegant Serif", heading: `Georgia, "Times New Roman", serif`, body: `Inter, "Segoe UI", system-ui, sans-serif` },
  tech: { label: "Tech Mono", heading: `ui-monospace, SFMono-Regular, Consolas, monospace`, body: `Inter, "Segoe UI", system-ui, sans-serif` },
  friendly: { label: "Friendly Rounded", heading: `ui-rounded, "Nunito", "Trebuchet MS", sans-serif`, body: `ui-rounded, "Nunito", "Segoe UI", sans-serif` },
};

export const RADII: Record<Theme["radius"], string> = { sharp: "4px", soft: "14px", round: "26px" };

export const PRESETS: { name: string; primary: string; secondary: string; accent: string }[] = [
  { name: "Ocean", primary: "#0e9bb8", secondary: "#6d5cf0", accent: "#e0892b" },
  { name: "Forest", primary: "#2e8b57", secondary: "#0f766e", accent: "#d97706" },
  { name: "Sunset", primary: "#ef6a4c", secondary: "#d6457a", accent: "#f59e0b" },
  { name: "Royal", primary: "#4f46e5", secondary: "#7c3aed", accent: "#06b6d4" },
  { name: "Slate", primary: "#334155", secondary: "#0ea5e9", accent: "#f59e0b" },
  { name: "Crimson", primary: "#c81e4a", secondary: "#9333ea", accent: "#f59e0b" },
];

export function themeVars(t: Theme): CSSProperties {
  const dark = t.mode === "dark";
  const f = FONTS[t.font] ?? FONTS.modern;
  const vars: Record<string, string> = {
    "--s-bg": dark ? ch("#070b14") : ch("#f6f8fc"),
    "--s-bg2": dark ? ch("#0c1322") : ch("#eaeff7"),
    "--s-surface": dark ? ch("#111a2b") : ch("#ffffff"),
    "--s-fg": dark ? ch("#e7edf7") : ch("#0b1322"),
    "--s-muted": dark ? ch("#97a4bb") : ch("#51607a"),
    "--s-primary": ch(t.primary),
    "--s-ink": luminance(t.primary) > 0.45 ? ch("#0b1322") : ch("#ffffff"),
    "--s-secondary": ch(t.secondary),
    "--s-accent": ch(t.accent),
    "--s-font-h": f.heading,
    "--s-font-b": f.body,
    "--s-radius": RADII[t.radius] ?? RADII.soft,
  };
  return { ...vars, fontFamily: f.body } as CSSProperties;
}
