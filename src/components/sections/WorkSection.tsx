import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCaseStudies } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProjectCard } from "@/components/work/ProjectCard";

/**
 * Editorial portfolio grid: one wide lead project, then an offset two-column
 * rhythm so the page never reads as a uniform card grid.
 */
export async function WorkSection({ index = "02", featuredOnly = false, as = "h2" }: { index?: string; featuredOnly?: boolean; as?: "h1" | "h2" }) {
  const t = await getTranslations("work");
  const locale = (await getLocale()) as Locale;
  const all = getCaseStudies();
  const studies = featuredOnly ? all.filter((s) => s.featured) : all;
  const [lead, ...rest] = studies;

  return (
    <section id="work" aria-labelledby="work-title" className={`shell ${as === "h1" ? "pb-24 pt-32 md:pb-36 md:pt-44" : "py-24 md:py-36"}`}>
      <SectionHeader
        index={index}
        kicker={t("kicker")}
        title={t("title")}
        intro={t("body")}
        id="work-title"
        as={as}
        action={featuredOnly && all.length > studies.length ? <ButtonLink href="/work" variant="light">{t("viewAll")}</ButtonLink> : undefined}
      />

      {!lead ? (
        <Reveal className="mt-14 grid gap-6 rounded-card bg-white p-8 ring-1 ring-line md:mt-20 md:grid-cols-2 md:p-14">
          <h3 className="t-h2">{t("emptyTitle")}</h3>
          <div className="flex flex-col items-start justify-end gap-6">
            <p className="t-lead text-ink-2">{t("empty")}</p>
            <ButtonLink href="/contact" variant="teal">{t("emptyCta")}</ButtonLink>
          </div>
        </Reveal>
      ) : (
        <div className="mt-14 md:mt-20">
          <ProjectCard study={lead} locale={locale} aspect="aspect-[4/5] md:aspect-[16/8]" size="lg" />
          {rest.length ? (
            <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-x-8">
              {rest.map((s, i) => (
                <div
                  key={s.slug}
                  className={rest.length === 1 ? "md:col-span-7 md:col-start-6" : i % 2 === 0 ? "md:col-span-6" : "md:col-span-5 md:col-start-8 md:mt-40"}
                >
                  <ProjectCard study={s} locale={locale} aspect={i % 2 === 0 ? "aspect-[4/5]" : "aspect-[4/5] md:aspect-[3/4]"} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
