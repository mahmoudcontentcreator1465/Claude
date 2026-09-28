import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Path without locale, e.g. "" for home or "/clients". */
export function localizedUrl(locale: Locale, path: string): string {
  return `${siteUrl()}/${locale}${path}`;
}

export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
      "x-default": localizedUrl(routing.defaultLocale, path),
    },
  };
}

export async function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
  noindex?: boolean;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const desc = description ?? t("description");
  return {
    title: title ?? { absolute: t("defaultTitle") },
    description: desc,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "Different",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      url: localizedUrl(locale, path),
      title: title ?? t("defaultTitle"),
      description: desc,
      images: [{ url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: t("defaultTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? t("defaultTitle"),
      description: desc,
      images: [`/og/og-${locale}.png`],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
