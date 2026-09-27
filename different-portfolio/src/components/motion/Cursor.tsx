"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A trailing ring that follows the pointer and grows over elements with
 * [data-cursor]. Mouse/trackpad only, never with reduced motion, and the native
 * cursor always stays visible.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target ? target.dataset.cursor || "" : null);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const active = label !== null;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <m.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.7rem] font-semibold uppercase tracking-[0.12em]"
        animate={{
          width: active ? 92 : 28,
          height: active ? 92 : 28,
          backgroundColor: active ? "rgba(26,188,156,1)" : "rgba(26,188,156,0)",
          borderColor: active ? "rgba(26,188,156,1)" : "rgba(17,17,17,0.45)",
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        {active && label ? <span className="text-ink">{label}</span> : null}
      </m.div>
    </m.div>
  );
}
