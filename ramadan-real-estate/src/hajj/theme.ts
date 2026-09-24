/**
 * Hajj reel palette — beige and brown only, separate from the house red style.
 * Same token names as ../theme so the Hajj scenes read the same way.
 */
export { font } from "../theme";

export const paper = {
  base: "#F1E6D3",
  lift: "#F8F0E3",
  white: "#FFFAF1",
} as const;

export const ink = {
  full: "#3A2718",
  soft: "#8A6E55",
  faint: "rgba(58,39,24,0.30)",
} as const;

/** The accent family: caramel brown in its shades. */
export const accent = {
  base: "#9C5B2E",
  deep: "#6E3D1C",
  dark: "#4A2812",
  light: "#C88A55",
  wash: "rgba(156,91,46,0.08)",
  glow: "rgba(156,91,46,0.22)",
} as const;

/** Soft tan for lines, frames and the star pattern. */
export const tan = {
  base: "#C9A273",
  line: "rgba(138,94,52,0.22)",
  fill: "#E6D6BD",
  fillDeep: "#D9C3A2",
} as const;

export const shadow = {
  float: "0 40px 80px rgba(74,40,18,0.18), 0 6px 16px rgba(74,40,18,0.10)",
  card: "0 18px 40px rgba(74,40,18,0.12)",
  contact: "0 2px 8px rgba(74,40,18,0.10)",
} as const;

/** Eight-point star (khatam) tile, used instead of the grid. */
export const starTile = (size = 64, opacity = 0.16) => {
  const h = size / 2;
  const s = size * 0.36;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><g fill='none' stroke='#8A5E34' stroke-opacity='${opacity}' stroke-width='1.3'><rect x='${h - s / 2}' y='${h - s / 2}' width='${s}' height='${s}'/><rect x='${h - s / 2}' y='${h - s / 2}' width='${s}' height='${s}' transform='rotate(45 ${h} ${h})'/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
