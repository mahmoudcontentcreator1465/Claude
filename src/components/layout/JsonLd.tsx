import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { site } from "@/content/site";
import { localizedUrl, siteUrl } from "@/lib/seo";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no content can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const sameAs = site.socials.filter((s) => !s.placeholder && s.href).map((s) => s.href);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl()}/#organization`,
        name: "Different",
        alternateName: "Different Marketing Agency",
        url: localizedUrl(locale, ""),
        logo: `${siteUrl()}/brand/different-logo-dark.png`,
        description: t("description"),
        knowsAbout: ["Travel marketing", "Tourism marketing", "Creative campaigns", "Content creation"],
        ...(site.email.placeholder ? {} : { email: site.email.value }),
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}
