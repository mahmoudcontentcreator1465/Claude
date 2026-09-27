import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { clientName, getClients, getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { WordBand } from "@/components/sections/WordBand";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { LogoMarquee } from "@/components/clients/LogoMarquee";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale: locale as Locale, path: "" });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (await getLocale()) as Locale;
  const tcl = await getTranslations("clients");
  const clients = getClients();
  const names = Object.fromEntries(clients.map((c) => [c.id, clientName(c, loc)]));
  const hasServices = getServices().length > 0;

  // Section numbers follow what's actually shown, so there are never gaps.
  let n = 0;
  const next = () => String(++n).padStart(2, "0");

  return (
    <>
      <Hero />
      <WordBand />
      <AboutSection index={next()} />
      <WorkSection index={next()} featuredOnly />
      {clients.length >= 6 ? <LogoMarquee clients={clients} names={names} label={tcl("marqueeLabel")} /> : null}
      <ClientsSection index={next()} limit={10} />
      {hasServices ? <ServicesSection index={next()} /> : null}
      <CtaSection />
      <ContactSection index={next()} />
    </>
  );
}
