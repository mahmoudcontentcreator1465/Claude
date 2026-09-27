import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPublishedServices } from "@/lib/content";
import { site, whatsappHref } from "@/content/site";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { ContactPoints } from "@/components/layout/ContactPoints";
import { ContactForm } from "@/components/contact/ContactForm";
import { Badge } from "@/components/ui/Badge";
import { WhatsApp } from "@/components/ui/Icons";

export async function ContactSection({ index = "05", as = "h2" }: { index?: string; as?: "h1" | "h2" }) {
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const wa = whatsappHref();
  // Only confirmed services are offered in the form.
  const options = getPublishedServices().map((s) => s.title[locale]);

  return (
    <section id="contact" aria-labelledby="contact-title" className={`shell ${as === "h1" ? "pb-24 pt-32 md:pb-32 md:pt-44" : "py-24 md:py-36"}`}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="mb-8 flex items-center gap-4 border-t hairline pt-4">
            <span className="t-label tabular-nums text-ink-3">{index}</span>
            <span className="t-label">{t("kicker")}</span>
          </div>
          <Lines as={as} id="contact-title" lines={[t("title")]} className={`${as === "h1" ? "t-h1" : "t-h2"} [text-wrap:balance]`} />
          <Reveal delay={0.1}>
            <p className="t-lead mt-6 max-w-md text-ink-2">{t("body")}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 space-y-8">
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                <span>{t("whatsappCta")}</span>
                <span className="btn-icon"><WhatsApp /></span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-3 rounded-full border border-dashed border-line-strong px-5 py-3 text-sm text-ink-3" title={tc("placeholderNote")}>
                <WhatsApp /> {t("whatsappCta")} <Badge>{tc("tbc")}</Badge>
                <span className="sr-only">{site.whatsapp.value}</span>
              </span>
            )}
            <ContactPoints />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:p-8 md:p-10">
            <ContactForm serviceOptions={options} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
