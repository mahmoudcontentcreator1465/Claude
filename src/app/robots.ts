import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments on Vercel should never be indexed.
  const isPreview = process.env.VERCEL_ENV === "preview";
  return {
    rules: isPreview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
