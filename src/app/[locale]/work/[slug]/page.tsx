import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { clientName, getCaseStudies, getCaseStudy, getClient, isDraft } from "@/lib/content";
import { localizedUrl, pageMetadata, siteUrl } from "@/lib/seo";
import { CaseStudyView } from "@/components/work/CaseStudyView";
import { JsonLd } from "@/components/layout/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getCaseStudies().map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({
    locale: locale as Locale,
    path: `/work/${slug}`,
    title: study.title[locale as Locale],
    description: study.summary[locale as Locale],
    noindex: isDraft(study.status),
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const loc = locale as Locale;
  const client = getClient(study.clientId);

  return (
    <>
      <CaseStudyView study={study} locale={loc} />
      {!isDraft(study.status) ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: study.title[loc],
            description: study.summary[loc],
            url: localizedUrl(loc, `/work/${slug}`),
            inLanguage: loc,
            creator: { "@id": `${siteUrl()}/#organization` },
            ...(client ? { sourceOrganization: { "@type": "Organization", name: clientName(client, loc) } } : {}),
            ...(study.year ? { dateCreated: study.year } : {}),
          }}
        />
      ) : null}
    </>
  );
}
