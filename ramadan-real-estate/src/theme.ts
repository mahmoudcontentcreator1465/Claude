/**
 * House visual style — white & red identity.
 * Derived from .agents/skills/house-visual-style. One accent family only: red.
 */

export const paper = {
  base: "#F5F3F0",
  lift: "#FCFBF9",
  white: "#FFFFFF",
} as const;

export const ink = {
  full: "#14100F",
  soft: "#6E6461",
  faint: "rgba(20,16,15,0.30)",
} as const;

/** The single accent family. Red in its shades — nothing else. */
export const red = {
  base: "#E01A2B",
  deep: "#A50F1E",
  dark: "#6B0713",
  light: "#FF5A67",
  wash: "rgba(224,26,43,0.08)",
  glow: "rgba(224,26,43,0.22)",
  marker: "rgba(224,26,43,0.26)",
} as const;

export const gridLine = "rgba(20,16,15,0.055)";

export const shadow = {
  float: "0 40px 80px rgba(20,16,15,0.16), 0 6px 16px rgba(20,16,15,0.10)",
  card: "0 18px 40px rgba(20,16,15,0.10)",
  contact: "0 2px 8px rgba(20,16,15,0.10)",
} as const;

export const font = {
  ar: "PlexArabic",
  /** The user's chosen Arabic display face. Single weight — never faux-bold it. */
  arDisplay: "Liftaswash",
  display: "InterTight",
  serif: "InstrumentSerif",
} as const;

/** 1080x1920 canvas. */
export const canvas = { width: 1080, height: 1920 } as const;

/** Safe inset in px, ~8% of the short edge. */
export const inset = 86;

/** The faint engineering grid — felt, not read. */
export const gridBackground = (size = 40) => ({
  backgroundColor: paper.base,
  backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
});

/** Soft white blow-out behind the focal object. */
export const radialGlow =
  "radial-gradient(58% 42% at 50% 40%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 72%)";

/** easeOutQuint — the default for everything in this style. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const timing = {
  fps: 30,
  entrance: 21,
  stagger: 4,
} as const;
