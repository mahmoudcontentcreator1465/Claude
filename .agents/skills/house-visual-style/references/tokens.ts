/**
 * House visual style tokens.
 * Art direction lives in ../SKILL.md — this file is only the machine-readable half.
 */

export const palette = {
  paper: "#F2F1ED",
  paperLift: "#FAF9F6",
  white: "#FFFFFF",
  ink: "#111111",
  inkSoft: "#6B6B6B",
  grid: "rgba(0,0,0,0.06)",
  gridOnDark: "rgba(255,255,255,0.07)",
  darkField: "#0B0B0F",
} as const;

/** Pick exactly one per piece. Two accents breaks the style. */
export const accents = {
  red: "#E8112D",
  indigo: "#4A47E5",
  green: "#00A550",
  yellow: "#F2E205",
  teal: "#00BFA6",
  navy: "#1B2A6B",
} as const;

export type Accent = keyof typeof accents;

export const type = {
  statement: {
    fontFamily: '"Inter Tight", "Neue Haas Grotesk Display", Archivo, sans-serif',
    fontWeight: 800,
    letterSpacing: "-0.025em",
    lineHeight: 1.0,
    color: palette.ink,
  },
  /** The one emotional word inside the statement. */
  emphasis: {
    fontFamily: '"Instrument Serif", "Playfair Display", "EB Garamond", serif',
    fontStyle: "italic",
    fontWeight: 400,
    letterSpacing: "-0.01em",
  },
  support: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 450,
    letterSpacing: "0em",
    lineHeight: 1.4,
    color: palette.inkSoft,
  },
  /** Arabic has no true italic — shift weight and color instead of slanting. */
  statementAr: {
    fontFamily: '"IBM Plex Sans Arabic", Almarai, sans-serif',
    fontWeight: 700,
    letterSpacing: "0em",
    lineHeight: 1.5,
    color: palette.ink,
  },
} as const;

export const shadow = {
  /** Object floating above the page. */
  float: "0 24px 48px rgba(0,0,0,0.12)",
  /** Tight contact shadow where the object nears the paper. */
  contact: "0 2px 6px rgba(0,0,0,0.10)",
  /** Raised card or panel. */
  card: "0 12px 32px rgba(0,0,0,0.08)",
} as const;

/** Frame-safe inset, as a fraction of the shorter edge. */
export const safeInset = 0.08;

export const easing = {
  /** easeOutQuint — the default for everything. */
  standard: [0.22, 1, 0.36, 1] as const,
  /** Slightly softer, for long camera moves. */
  drift: [0.33, 1, 0.68, 1] as const,
};

/** Remotion spring config: settles firmly, never bouncy. */
export const springConfig = { damping: 200, stiffness: 100, mass: 1 } as const;

export const timing = {
  fps: 30,
  /** Entrance animation length, in frames. */
  entranceFrames: 21,
  /** Per-word stagger for kinetic type, in frames. */
  wordStaggerFrames: 4,
  /** Full cycle of the object float, in frames. */
  floatPeriodFrames: 90,
  /** Float amplitude in px. */
  floatAmplitude: 8,
  /** Soft cut length, in frames. */
  dissolveFrames: 8,
  /** Continuous camera push across a shot. */
  cameraPush: { from: 1.0, to: 1.06 },
} as const;

/**
 * The faint engineering grid. Size is the cell in px; it should be felt, not read.
 * Pass `onDark` for the near-black field variant.
 */
export const gridBackground = (size = 40, onDark = false) => {
  const line = onDark ? palette.gridOnDark : palette.grid;
  return {
    backgroundColor: onDark ? palette.darkField : palette.paper,
    backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  };
};

/** Soft white blow-out at frame center, used under floating objects. */
export const radialGlow = (strength = 0.9) =>
  `radial-gradient(60% 45% at 50% 42%, rgba(255,255,255,${strength}) 0%, rgba(255,255,255,0) 70%)`;

/** 2–4% grain keeps the paper from looking sterile. */
export const grainOpacity = 0.03;

export const canvas = {
  vertical: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
  wide: { width: 1920, height: 1080 },
} as const;
