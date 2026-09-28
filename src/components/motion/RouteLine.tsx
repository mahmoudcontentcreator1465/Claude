"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/**
 * The "Different Directions" motif: a route that splits into three, like the
 * arrows in the logo. It draws itself as the section scrolls through the viewport.
 */
export function RouteLine({
  className,
  tone = "ink",
  onLoad = false,
}: {
  className?: string;
  tone?: "ink" | "light";
  /** Draw once on mount instead of following the scroll. */
  onLoad?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 40%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const stroke = tone === "ink" ? "var(--color-ink)" : "var(--color-white)";
  const drawn = reduce ? { pathLength: 1 } : onLoad ? undefined : { pathLength: progress };
  const load = onLoad && !reduce
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 2.2, ease: [0.65, 0, 0.35, 1] as const, delay: 0.9 } }
    : {};

  return (
    <div ref={ref} className={className} aria-hidden="true">
    <svg
      viewBox="0 0 1200 220"
      fill="none"
      preserveAspectRatio="none"
      className="flip-rtl h-full w-full"
    >
      <m.path d="M0 170 C 260 170 360 170 520 150" stroke={stroke} strokeWidth="1.5" style={drawn} {...load} vectorEffect="non-scaling-stroke" />
      <m.path d="M520 150 C 700 125 820 40 1200 30" stroke={stroke} strokeWidth="1.5" style={drawn} {...load} vectorEffect="non-scaling-stroke" />
      <m.path d="M520 150 C 760 140 940 110 1200 112" stroke="var(--color-teal)" strokeWidth="3" style={drawn} {...load} vectorEffect="non-scaling-stroke" />
      <m.path d="M520 150 C 720 170 900 205 1200 200" stroke={stroke} strokeWidth="1.5" strokeDasharray="6 8" style={drawn} {...load} vectorEffect="non-scaling-stroke" />
      <circle cx="520" cy="150" r="6" fill="var(--color-teal)" />
    </svg>
    </div>
  );
}
