import type { CSSProperties, ReactNode } from "react";

/** Wipes a visual open with a clip-path, with a slight settle-in scale (CSS only). */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div data-reveal="mask" className={className} style={{ "--d": `${delay}s` } as CSSProperties}>
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
