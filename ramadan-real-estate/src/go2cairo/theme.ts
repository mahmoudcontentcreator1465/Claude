/**
 * Go2Cairo look (from the airport edit): Nile-night navy, sand cards and a
 * sun-orange accent. Token names mirror ../hajj/theme so scenes can swap.
 */
export { font } from "../theme";

export const C = {
  night: "#0A2A43",
  night2: "#11446A",
  sand: "#F6E8CB",
  sandDeep: "#E8D2A4",
  navy: "#0A1F33",
  muted: "#6E5C43",
  sun: "#FF6A2B",
} as const;

/** Surfaces: the card is night, the things on it are sand. */
export const paper = { base: C.night, lift: C.sand, white: C.sand } as const;

/** Ink for content sitting on sand. */
export const ink = { full: C.navy, soft: C.muted } as const;

export const accent = {
  base: C.sun,
  deep: C.night2,
  light: C.sun,
} as const;

export const tan = {
  base: C.sandDeep,
  fill: C.sandDeep,
  fillDeep: "#D9BE88",
} as const;

/** Dot pattern for the night card, as in the airport backdrop. */
export const dots = (size = 34, alpha = 0.1) =>
  `radial-gradient(circle, rgba(246,232,203,${alpha}) 1.6px, transparent 1.8px) 0 0 / ${size}px ${size}px`;
