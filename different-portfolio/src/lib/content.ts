import "server-only";
import type { Locale } from "@/i18n/routing";
import { caseStudies } from "@/content/case-studies";
import { clients } from "@/content/clients";
import { services } from "@/content/services";
import type { CaseStudy, Client, ContentStatus, Service } from "@/content/types";

/** Drafts are shown in development, and in any deployment with SHOW_DRAFT_CONTENT=true. */
export const showDrafts =
  process.env.SHOW_DRAFT_CONTENT === "true" || process.env.NODE_ENV === "development";

export const isVisible = (status: ContentStatus) => status === "published" || showDrafts;
export const isDraft = (status: ContentStatus) => status !== "published";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export function getClients(): Client[] {
  return clients.filter((c) => isVisible(c.status)).sort(byOrder);
}

export function getClient(id: string | null): Client | undefined {
  if (!id) return undefined;
  return getClients().find((c) => c.id === id);
}

export function clientName(client: Client, locale: Locale): string {
  return (client.name[locale] ?? client.name.en ?? client.name.ar)!;
}

export function getServices(): Service[] {
  return services.filter((s) => isVisible(s.status)).sort(byOrder);
}

export function getPublishedServices(): Service[] {
  return services.filter((s) => s.status === "published").sort(byOrder);
}

export function getCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => isVisible(c.status)).sort(byOrder);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((c) => c.slug === slug);
}

export function getRelatedCaseStudies(current: CaseStudy, limit = 2): CaseStudy[] {
  const others = getCaseStudies().filter((c) => c.slug !== current.slug);
  const scored = others
    .map((c) => ({
      c,
      score:
        (c.clientId && c.clientId === current.clientId ? 3 : 0) +
        c.services.filter((s) => current.services.includes(s)).length,
    }))
    .sort((a, b) => b.score - a.score || a.c.order - b.c.order);
  return scored.slice(0, limit).map((s) => s.c);
}
