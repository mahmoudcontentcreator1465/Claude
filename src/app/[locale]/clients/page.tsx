import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { CtaSection } from "@/components/sections/CtaSection";

export async function generateMetadata({ params }: PageProps<"/[locale]/clients">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale: locale as Locale, path: "/clients", title: t("clients"), description: t("clientsDescription") });
}

export default async function ClientsPage({ params }: PageProps<"/[locale]/clients">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ClientsSection index="01" as="h1" />
      <CtaSection />
    </>
  );
}
