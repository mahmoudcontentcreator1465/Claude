import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getServices, isDraft } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "@/components/ui/Icons";

/**
 * Typography-led service index. Rows fill with teal from the reading-start side
 * on hover; the description is always visible on touch screens.
 * Renders nothing when no service is visible (all unconfirmed on the live site).
 */
export async function ServicesSection({ index = "04", as = "h2" }: { index?: string; as?: "h1" | "h2" }) {
  const t = await getTranslations("services");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const list = getServices();
  if (list.length === 0) return null;

  return (
    <section id="services" aria-labelledby="services-title" className={`shell ${as === "h1" ? "pb-24 pt-32 md:pb-36 md:pt-44" : "py-24 md:py-36"}`}>
      <SectionHeader index={index} kicker={t("kicker")} title={t("title")} intro={t("body")} id="services-title" as={as} />
      <ol className="mt-14 border-t border-ink md:mt-20">
        {list.map((s, i) => (
          <Reveal as="li" key={s.id} delay={Math.min(i, 4) * 0.05} className="group relative isolate overflow-hidden border-b hairline">
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-teal transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100 rtl:origin-right"
            />
            <div className="grid gap-3 py-7 md:grid-cols-12 md:items-center md:gap-6 md:py-9 md:ps-2">
              <span className="t-label tabular-nums text-ink-3 transition-colors group-hover:text-ink md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 rtl:leading-[1.35] rtl:tracking-normal rtl:group-hover:-translate-x-3 md:col-span-6">
                {s.title[locale]}
              </h3>
              <p className="max-w-md text-ink-2 transition-colors group-hover:text-ink md:col-span-4">{s.description[locale]}</p>
              <span className="hidden justify-end md:col-span-1 md:flex">
                {isDraft(s.status) ? (
                  <Badge>{tc("draft")}</Badge>
                ) : (
                  <span className="flip-rtl inline-flex opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight width={28} height={28} />
                  </span>
                )}
              </span>
              {isDraft(s.status) ? (
                <span className="md:hidden">
                  <Badge>{tc("draft")}</Badge>
                </span>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
