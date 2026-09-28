import type { CSSProperties, ReactNode } from "react";

/**
 * Fades and lifts content into place. Pure CSS driven by one shared
 * IntersectionObserver (RevealObserver), so it adds no per-element JavaScript.
 * `onLoad` plays immediately on page load (for above-the-fold content).
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as: Tag = "div",
  onLoad = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
  onLoad?: boolean;
}) {
  const style = { "--d": `${delay}s`, "--ry": `${y}px` } as CSSProperties;
  return onLoad ? (
    <Tag className={`load-fade ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  ) : (
    <Tag data-reveal="fade" className={className} style={style}>
      {children}
    </Tag>
  );
}
