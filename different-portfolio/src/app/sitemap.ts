import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCaseStudies, getServices } from "@/lib/content";
import { localizedUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/clients",
    "/work",
    "/contact",
    ...(getServices().some((s) => s.status === "published") ? ["/services"] : []),
    ...getCaseStudies()
      .filter((s) => s.status === "published")
      .map((s) => `/work/${s.slug}`),
  ];
  const now = new Date();
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.startsWith("/work/") ? 0.7 : 0.8,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])) },
    })),
  );
}
