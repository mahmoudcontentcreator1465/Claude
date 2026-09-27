import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

/** Points toward reading direction; wrap in .flip-rtl for RTL. */
export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);

export const Menu = (p: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M3 8h18M3 16h12" />
  </svg>
);

export const Close = (p: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
    <path d="M9 9.5c.3 1.9 1.7 3.8 3.9 4.6l1.3-1.1 1.8.8c-.2 1-1 1.7-2.1 1.6-3-.3-5.9-3.2-6.1-6.1 0-1.1.6-1.9 1.6-2.1l.8 1.8z" strokeWidth="1.3" />
  </svg>
);

export const Check = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const Alert = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </svg>
);
