import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { alexandria, jakarta, plexArabic } from "@/lib/fonts";
import { getServices, hasUnpublishedContent, showDrafts } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Cursor } from "@/components/motion/Cursor";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { Header, type NavItem } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { OrganizationJsonLd } from "@/components/layout/JsonLd";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: "Different",
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#F5F7F6",
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("nav");
  const ta = await getTranslations("a11y");
  const tl = await getTranslations("lang");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  // Only the namespaces client components actually read are sent to the browser.
  const messages = await getMessages();
  const clientMessages = { contact: messages.contact };

  const hasServices = getServices().length > 0;
  const items: NavItem[] = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/clients", label: t("clients") },
    ...(hasServices ? [{ href: "/services", label: t("services") }] : []),
    { href: "/contact", label: t("contact") },
  ];
  const languages: Record<Locale, { short: string; long: string }> = {
    en: { short: tl("en"), long: tl("enLong") },
    ar: { short: tl("ar"), long: tl("arLong") },
  };

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={localeDirection[locale]}
      className={`${jakarta.variable} ${alexandria.variable} ${plexArabic.variable}`}
    >
      <head>
        {/* Enables scroll reveals only when JS runs; falls back to fully visible content if it never starts. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove('js')},4000)",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="fixed start-4 top-4 z-[70] -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-white transition-transform focus:translate-y-0"
        >
          {ta("skip")}
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <Header
              items={items}
              cta={t("cta")}
              logo={<Logo variant="dark" priority />}
              logoLight={<Logo variant="white" />}
              footerNote={tf("description")}
              labels={{
                home: ta("home"),
                openMenu: ta("openMenu"),
                closeMenu: ta("closeMenu"),
                mainNav: ta("mainNav"),
                language: ta("language"),
                languages,
              }}
            />
            {showDrafts && hasUnpublishedContent() ? (
              <p
                title={tc("draftNotice")}
                className="fixed bottom-3 start-3 z-40 flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full border border-sun bg-white/95 py-1.5 pe-3 ps-1.5 text-xs font-medium text-ink-2 shadow-sm backdrop-blur"
              >
                <Badge>{tc("draft")}</Badge>
                <span className="sr-only sm:not-sr-only">{tc("previewShort")}</span>
              </p>
            ) : null}
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer items={items} languages={languages} />
            <Cursor />
            <RevealObserver />
          </MotionProvider>
        </NextIntlClientProvider>
        <OrganizationJsonLd locale={locale} />
      </body>
    </html>
  );
}
