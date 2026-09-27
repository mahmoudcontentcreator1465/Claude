import type { ReactNode } from "react";

/** Visible marker for draft, pending or placeholder content. */
export function Badge({ children, tone = "draft" }: { children: ReactNode; tone?: "draft" | "neutral" | "teal" }) {
  const tones = {
    draft: "bg-sun/90 text-ink",
    neutral: "bg-mist text-ink-2",
    teal: "bg-teal-soft text-teal-ink",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.1em] rtl:tracking-normal ${tones[tone]}`}>
      {tone === "draft" ? <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
