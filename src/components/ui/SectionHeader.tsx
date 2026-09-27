import type { ReactNode } from "react";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Editorial section opener: numbered kicker on a hairline, a big headline and an
 * optional intro set off to the side on large screens.
 */
export function SectionHeader({
  index,
  kicker,
  title,
  intro,
  action,
  tone = "light",
  id,
  as = "h2",
}: {
  index: string;
  kicker: string;
  title: string | string[];
  intro?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  id?: string;
  as?: "h1" | "h2";
}) {
  const muted = tone === "dark" ? "text-white/60" : "text-ink-3";
  return (
    <header className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className={`flex items-center gap-4 border-t pt-4 lg:col-span-12 ${tone === "dark" ? "border-white/20" : "hairline"}`}>
        <span className={`t-label tabular-nums ${muted}`}>{index}</span>
        <span className="t-label">{kicker}</span>
      </div>
      <Lines
        as={as}
        onLoad={as === "h1"}
        lines={Array.isArray(title) ? title : [title]}
        className={`${as === "h1" ? "t-h1" : "t-h2"} lg:col-span-8 [text-wrap:balance]`}
        id={id}
      />
      {(intro || action) && (
        <Reveal delay={0.15} onLoad={as === "h1"} className="flex flex-col items-start justify-end gap-6 lg:col-span-4">
          {intro ? <p className={`t-lead max-w-md ${tone === "dark" ? "text-white/75" : "text-ink-2"}`}>{intro}</p> : null}
          {action}
        </Reveal>
      )}
    </header>
  );
}
