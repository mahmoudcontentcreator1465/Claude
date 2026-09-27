import Image from "next/image";
import type { Client } from "@/content/types";
import { Badge } from "@/components/ui/Badge";

/**
 * Neutral card that frames a client logo without altering it: no cropping, no
 * stretching, no recolouring. Files with a baked-in background are shown whole
 * (`object-contain`) so their original aspect ratio and edges are preserved.
 */
export function LogoCard({
  client,
  name,
  badge,
  sizes = "(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 45vw",
  priority = false,
}: {
  client: Client;
  name: string;
  badge?: string;
  sizes?: string;
  /** Load eagerly with high priority (first row above the fold). */
  priority?: boolean;
}) {
  const { image, treatment, zoom } = client.logo;
  const surface =
    treatment === "transparent-on-dark" ? "bg-ink" : treatment === "transparent-on-light" ? "bg-white" : "bg-white";
  const pad = treatment === "artwork" ? "p-0" : "p-[16%]";

  return (
    <figure className="group">
      <div
        className={`relative aspect-square overflow-hidden rounded-card ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_40px_-30px_rgba(17,17,17,.5)] ${surface}`}
      >
        <div className={`absolute inset-0 ${pad}`}>
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={`${name} logo`}
              fill
              sizes={sizes}
              priority={priority}
              className="object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              style={zoom ? { scale: String(zoom) } : undefined}
            />
          </div>
        </div>
        {badge ? (
          <span className="absolute start-2.5 top-2.5">
            <Badge>{badge}</Badge>
          </span>
        ) : null}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-2 px-1 text-sm font-medium text-ink-2">
        <span className="truncate">{name}</span>
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 scale-0 rounded-full bg-teal transition-transform duration-500 group-hover:scale-100" />
      </figcaption>
    </figure>
  );
}
