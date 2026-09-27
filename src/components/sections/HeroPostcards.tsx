"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { DestinationArt } from "@/components/art/DestinationArt";
import type { ArtVariant } from "@/content/types";

const cards: { variant: ArtVariant; rotate: number; x: string; y: string; depth: number }[] = [
  { variant: "coast", rotate: -7, x: "0%", y: "6%", depth: 40 },
  { variant: "desert", rotate: 5, x: "34%", y: "0%", depth: 90 },
  { variant: "city", rotate: -2, x: "17%", y: "30%", depth: 140 },
];

/**
 * Three illustrated "postcards" fanned out and tied together by a teal route,
 * the brand's split-direction idea applied to travel. Purely decorative art
 * direction, not client work.
 */
export function HeroPostcards({ labels, ariaLabel }: { labels: string[]; ariaLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -cards[0].depth]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -cards[1].depth]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -cards[2].depth]);
  const ys = [y0, y1, y2];

  return (
    <div ref={ref} role="img" aria-label={ariaLabel} className="relative aspect-[5/6] w-full">
      {cards.map((c, i) => (
        <m.div
          key={c.variant}
          className="absolute w-[58%]"
          style={{ insetInlineStart: c.x, top: c.y, y: reduce ? 0 : ys[i], zIndex: i + 1 }}
        >
          <m.div
            initial={reduce ? false : { opacity: 0, y: 80, rotate: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate, scale: 1 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.14 }}
            whileHover={reduce ? undefined : { rotate: 0, scale: 1.03, transition: { duration: 0.5 } }}
            className="rounded-[1.1rem] bg-white p-2 shadow-[0_1px_0_rgba(17,17,17,.06),0_24px_48px_-28px_rgba(17,17,17,.45)] ring-1 ring-line"
          >
            <div className="overflow-hidden rounded-[0.8rem]">
              <DestinationArt variant={c.variant} className="block aspect-[4/5] w-full" />
            </div>
            <div className="flex items-center justify-between px-1.5 pb-0.5 pt-2.5">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] rtl:tracking-normal">{labels[i]}</span>
              <span className="h-2 w-2 rounded-full bg-teal" />
            </div>
          </m.div>
        </m.div>
      ))}

      {/* The route that ties the three destinations together. */}
      <svg viewBox="0 0 500 600" className="flip-rtl pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" aria-hidden="true">
        <m.path
          d="M60 420 C 120 330 150 560 230 470 S 330 220 420 150"
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1 0"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 1.1 }}
        />
        {[
          [60, 420],
          [230, 470],
          [420, 150],
        ].map(([cx, cy], i) => (
          <m.g
            key={i}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.2 + i * 0.5 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <circle cx={cx} cy={cy} r="11" fill="#fff" stroke="var(--color-ink)" strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r="4" fill="var(--color-teal)" />
          </m.g>
        ))}
      </svg>
    </div>
  );
}
