import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CtaSection } from "@/components/sections/CtaSection";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale: locale as Locale, path: "/services", title: t("services"), description: t("servicesDescription") });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Unconfirmed services never produce a public page.
  if (getServices().length === 0) notFound();
  return (
    <>
      <ServicesSection index="01" as="h1" />
      <CtaSection />
    </>
  );
}
