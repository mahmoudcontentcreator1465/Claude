import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { WorkSection } from "@/components/sections/WorkSection";
import { CtaSection } from "@/components/sections/CtaSection";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale: locale as Locale, path: "/work", title: t("work"), description: t("workDescription") });
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <WorkSection index="01" as="h1" />
      <CtaSection />
    </>
  );
}
