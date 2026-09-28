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
  /**
   * Optional visual enlargement for files that sit on a large transparent canvas.
   * Only empty transparent margin is ever clipped; the artwork itself is never cropped.
   */
  zoom?: number;
}

export interface Client {
  id: string;
  slug: string;
  /**
   * Names exactly as they appear on the client's own logo. Either language may be
   * missing (never invent a transliteration); the other one is shown instead.
   */
  name: { en: string; ar?: string } | { en?: string; ar: string };
  /** Open questions for Different (spelling, duplicates…). Internal only, never rendered. */
  openQuestion?: string;
  logo: ClientLogo;
  logoAlt?: ClientLogo;
  services: ServiceId[];
  featured: boolean;
  /** Lower numbers come first. */
  order: number;
  status: ContentStatus;
  /** Original upload path under src/assets/clients, kept for traceability. */
  source: string;
}

/** Illustration variants used by the hero postcards and the 404 page. */
export type ArtVariant = "coast" | "desert" | "city" | "route" | "oasis";
