import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { AboutSection } from "@/components/sections/AboutSection";
import { WordBand } from "@/components/sections/WordBand";
import { CtaSection } from "@/components/sections/CtaSection";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale: locale as Locale, path: "/about", title: t("about"), description: t("aboutDescription") });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AboutSection index="01" showLink={false} as="h1" />
      <WordBand />
      <div className="pt-24 md:pt-36" />
      <CtaSection />
    </>
  );
}
