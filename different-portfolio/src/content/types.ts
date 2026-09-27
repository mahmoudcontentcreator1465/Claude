import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/routing";

/** A value written separately for each language. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Publishing state shared by every content type.
 * - `published`: visible everywhere.
 * - `draft`: visible only when draft content is enabled (dev, or SHOW_DRAFT_CONTENT=true),
 *   always with a visible "Draft" marker.
 * - `pending`: supplied but waiting on a decision from Different (e.g. the client list is
 *   not finalized yet). Treated like `draft` for visibility.
 */
export type ContentStatus = "published" | "draft" | "pending";

export type ServiceId =
  | "social-media-management"
  | "content-creation"
  | "creative-campaigns"
  | "photo-video-production"
  | "branding-identity"
  | "performance-marketing"
  | "digital-strategy"
  | "travel-tourism-marketing";

export interface Service {
  id: ServiceId;
  order: number;
  /** Stays `draft` until Different confirms it offers this service. */
  status: ContentStatus;
  title: Localized;
  description: Localized;
}

export interface ClientLogo {
  /** Statically imported file, so width/height and aspect ratio come from the original. */
  image: StaticImageData;
  /**
   * How the file behaves on a card:
   * - `artwork`: the file has its own background baked in (JPEG, badge, photo); it is
   *   shown whole, never cropped, inside a frame of the same shape.
   * - `transparent-on-light`: transparent file with dark marks; sits on a light card.
   * - `transparent-on-dark`: transparent file with light marks; sits on a dark card.
   */
  treatment: "artwork" | "transparent-on-light" | "transparent-on-dark";
}

export interface Client {
  id: string;
  slug: string;
  /** Names exactly as the client writes them. Arabic falls back to English when absent. */
  name: { en: string; ar?: string };
  logo: ClientLogo;
  logoAlt?: ClientLogo;
  services: ServiceId[];
  featured: boolean;
  /** Lower numbers come first. */
  order: number;
  /** Slugs of case studies in content/case-studies. */
  caseStudies: string[];
  status: ContentStatus;
  /** Original upload path under src/assets/clients, kept for traceability. */
  source: string;
}

export type CaseStudyVisual =
  | { kind: "art"; variant: ArtVariant; caption?: Localized }
  | { kind: "image"; image: StaticImageData; alt: Localized; caption?: Localized }
  | { kind: "video"; src: string; poster?: StaticImageData; alt: Localized; caption?: Localized }
  | { kind: "embed"; url: string; title: Localized; caption?: Localized };

export type ArtVariant = "coast" | "desert" | "city" | "route" | "oasis";

export interface GalleryItem {
  visual: CaseStudyVisual;
  /** Layout hint for the gallery grid. */
  size: "full" | "wide" | "tall" | "square";
}

export interface CaseStudy {
  slug: string;
  status: ContentStatus;
  /** Id from content/clients. Leave null until the project is confirmed. */
  clientId: string | null;
  order: number;
  featured: boolean;
  year?: string;
  title: Localized;
  projectType: Localized;
  services: ServiceId[];
  summary: Localized;
  cover: CaseStudyVisual;
  overview: Localized;
  challenge: Localized;
  approach: Localized;
  deliverables: Localized<string[]>;
  gallery: GalleryItem[];
  /**
   * Only verified figures supplied by Different. The section is not rendered at all
   * while this is undefined or empty.
   */
  results?: { value: string; label: Localized; source?: string }[];
  /** Fields still waiting on real material. Shown in the draft banner. */
  missing?: string[];
}
