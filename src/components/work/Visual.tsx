import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import type { CaseStudyVisual } from "@/content/types";
import { DestinationArt } from "@/components/art/DestinationArt";

/** Renders any case-study visual (illustration, image, video or embed) filling its box. */
export function Visual({
  visual,
  locale,
  sizes,
  priority,
  placeholderLabel,
}: {
  visual: CaseStudyVisual;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  placeholderLabel: string;
}) {
  switch (visual.kind) {
    case "art":
      return <DestinationArt variant={visual.variant} label={placeholderLabel} className="h-full w-full" />;
    case "image":
      return (
        <Image
          src={visual.image}
          alt={visual.alt[locale]}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="object-cover"
        />
      );
    case "video":
      return (
        <video
          className="h-full w-full object-cover"
          src={visual.src}
          poster={visual.poster?.src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={visual.alt[locale]}
        />
      );
    case "embed":
      return (
        <iframe
          src={visual.url}
          title={visual.title[locale]}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          className="h-full w-full border-0"
        />
      );
  }
}
