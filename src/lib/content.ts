import "server-only";
import type { Locale } from "@/i18n/routing";
import { clients } from "@/content/clients";
import { services } from "@/content/services";
import type { Client, ContentStatus, Service } from "@/content/types";

/**
 * Drafts (pending clients, unconfirmed services, placeholder case studies) are shown:
 * - in development,
 * - on Vercel *Preview* deployments, so the site can be reviewed before content is confirmed,
 * - anywhere SHOW_DRAFT_CONTENT=true.
 * They are never shown on Vercel Production. SHOW_DRAFT_CONTENT=false hides them everywhere.
 */
export const showDrafts =
  process.env.SHOW_DRAFT_CONTENT === "false"
    ? false
    : process.env.VERCEL_ENV === "production"
      ? process.env.SHOW_DRAFT_CONTENT === "true"
      : process.env.SHOW_DRAFT_CONTENT === "true" ||
        process.env.NODE_ENV === "development" ||
        process.env.VERCEL_ENV === "preview";

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
