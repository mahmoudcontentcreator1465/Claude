import type { CSSProperties, ElementType } from "react";

/**
 * Headline whose lines rise from behind a mask, one after another.
 * `onLoad` plays on page load with a CSS animation (no JavaScript needed, so the
 * hero text paints as early as possible); otherwise it plays when scrolled into view.
 */
export function Lines({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  onLoad = false,
  delay = 0,
  accentIndex,
  accentClass = "text-teal-display",
  id,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  onLoad?: boolean;
  delay?: number;
  /** Index of a line to set in the brand accent. */
  accentIndex?: number;
  /** Accent colour: deep teal on light backgrounds (AA large), bright teal on dark. */
  accentClass?: string;
  id?: string;
}) {
  const style = { "--d": `${delay}s` } as CSSProperties;
  return (
    <Tag
      id={id}
      className={`${onLoad ? "load-lines" : ""} ${className ?? ""}`}
      style={style}
      {...(onLoad ? {} : { "data-reveal": "lines" })}
    >
      {lines.map((line, i) => (
        <span key={i} className="line block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span
            className={`block ${i === accentIndex ? accentClass : ""} ${lineClassName ?? ""}`}
            style={{ "--i": i } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
