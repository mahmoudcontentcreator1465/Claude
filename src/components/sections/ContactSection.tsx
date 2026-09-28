import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPublishedServices } from "@/lib/content";
import { deliveryConfigured } from "@/lib/contact-delivery";
import { site, whatsappHref } from "@/content/site";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { ContactPoints } from "@/components/layout/ContactPoints";
import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowBadge } from "@/components/ui/ButtonLink";
import { WhatsApp } from "@/components/ui/Icons";

/**
 * Contact block. The form is shown only once email delivery is configured (see README);
 * until then the page leads with WhatsApp, so no visitor ever fills in a form that can't send.
 */
export async function ContactSection({ index = "05", as = "h2" }: { index?: string; as?: "h1" | "h2" }) {
  const t = await getTranslations("contact");
  const locale = (await getLocale()) as Locale;
  const wa = whatsappHref(t("whatsappPrefill"));
  const formLive = deliveryConfigured();
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
          <Lines as={as} onLoad={as === "h1"} id="contact-title" lines={[t("title")]} className={`${as === "h1" ? "t-h1" : "t-h2"} [text-wrap:balance]`} />
          <Reveal delay={0.1} onLoad={as === "h1"}>
            <p className="t-lead mt-6 max-w-md text-ink-2">{t("body")}</p>
          </Reveal>
          {formLive ? (
            <Reveal delay={0.2} onLoad={as === "h1"} className="mt-10">
              <ContactPoints />
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.1} onLoad={as === "h1"} className="lg:col-span-7">
          {formLive ? (
            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:p-8 md:p-10">
              <ContactForm serviceOptions={options} />
            </div>
          ) : wa ? (
            <div className="flex h-full flex-col justify-between gap-10 rounded-[1.75rem] bg-white p-6 ring-1 ring-line sm:p-10">
              <div>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-soft text-teal-ink">
                  <WhatsApp width={26} height={26} />
                </span>
                <h3 className="t-h3 mt-8">{t("whatsappTitle")}</h3>
                <p className="t-lead mt-3 max-w-md text-ink-2">{t("whatsappBody")}</p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-teal !min-h-14">
                  <span>{t("whatsappCta")}</span>
                  <ArrowBadge />
                </a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw text-lg font-medium text-ink-2" dir="ltr">
                  {site.whatsapp.value}
                </a>
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
