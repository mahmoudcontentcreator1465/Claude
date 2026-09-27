import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { CaseStudy, GalleryItem } from "@/content/types";
import { services } from "@/content/services";
import { clientName, getClient, getRelatedCaseStudies, isDraft } from "@/lib/content";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/Icons";
import { ProjectCard } from "./ProjectCard";
import { Visual } from "./Visual";

const gallerySpan: Record<GalleryItem["size"], string> = {
  full: "md:col-span-12 aspect-[4/5] md:aspect-[16/8]",
  wide: "md:col-span-8 aspect-[4/5] md:aspect-[16/10]",
  tall: "md:col-span-6 aspect-[4/5]",
  square: "md:col-span-4 aspect-square",
};

function TextBlock({ label, children, index }: { label: string; children: React.ReactNode; index: string }) {
return (
  <Reveal className="grid gap-6 border-t hairline pt-6 md:grid-cols-12 md:gap-10">
    <h2 className="t-label flex gap-3 text-ink-3 md:col-span-4">
      <span className="tabular-nums">{index}</span>
      <span className="text-ink">{label}</span>
    </h2>
    <div className="md:col-span-8">{children}</div>
  </Reveal>
);
}

export async function CaseStudyView({ study, locale }: { study: CaseStudy; locale: Locale }) {
  const t = await getTranslations("caseStudy");
  const tw = await getTranslations("work");
  const tc = await getTranslations("common");
  const client = getClient(study.clientId);
  const name = client ? clientName(client, locale) : tw("clientTbc");
  const serviceNames = study.services.map((id) => services.find((s) => s.id === id)?.title[locale]).filter(Boolean) as string[];
  const related = getRelatedCaseStudies(study);
  const draft = isDraft(study.status);

  return (
    <article>
      {draft ? (
        <div className="draft-stripes border-b border-sun/60 pt-20 md:pt-24">
          <div className="shell flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:gap-4">
            <Badge>{tc("draft")}</Badge>
            <p className="font-medium">{t("draftBanner")}</p>
            {study.missing?.length ? (
              <p className="text-ink-3 sm:ms-auto" dir="ltr">
                {t("missing")}: {study.missing.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <header className={`shell ${draft ? "pt-14" : "pt-32 md:pt-44"}`}>
        <Link href="/work" className="t-label inline-flex items-center gap-2 text-ink-3 hover:text-ink">
          <span className="flip-rtl inline-flex rotate-180"><ArrowRight width={14} height={14} /></span>
          {t("back")}
        </Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 flex items-center gap-4">
              {client ? (
                <span className="relative h-16 w-16 overflow-hidden rounded-xl bg-white ring-1 ring-line">
                  <Image src={client.logo.image} alt={`${name} logo`} fill sizes="64px" className="object-contain" />
                </span>
              ) : null}
              <span className="font-semibold">{name}</span>
            </div>
            <Lines as="h1" lines={[study.title[locale]]} onLoad className="t-h1 [text-wrap:balance]" />
          </div>
          <Reveal delay={0.3} className="self-end lg:col-span-4">
            <p className="t-lead text-ink-2">{study.summary[locale]}</p>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-6 border-y hairline py-6 md:grid-cols-4">
          <div>
            <dt className="t-label text-ink-3">{t("client")}</dt>
            <dd className="mt-2 font-semibold">{name}</dd>
          </div>
          <div>
            <dt className="t-label text-ink-3">{t("type")}</dt>
            <dd className="mt-2 font-semibold">{study.projectType[locale]}</dd>
          </div>
          <div className="col-span-2">
            <dt className="t-label text-ink-3">{t("services")}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {serviceNames.map((s) => (
                <span key={s} className="rounded-full border border-line-strong px-3 py-1 text-sm">{s}</span>
              ))}
            </dd>
          </div>
          {study.year ? (
            <div>
              <dt className="t-label text-ink-3">{t("year")}</dt>
              <dd className="mt-2 font-semibold tabular-nums">{study.year}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className="px-2 pt-10 md:px-3 md:pt-14">
        <MaskReveal className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-mist md:aspect-[16/8] md:rounded-[2.5rem]">
          <Visual visual={study.cover} locale={locale} sizes="100vw" priority placeholderLabel={tw("placeholderVisual")} />
        </MaskReveal>
      </div>

      <div className="shell space-y-16 py-24 md:space-y-24 md:py-36">
        <TextBlock index="01" label={t("overview")}>
          <p className="t-lead text-ink-2 [text-wrap:pretty]">{study.overview[locale]}</p>
        </TextBlock>
        <TextBlock index="02" label={t("challenge")}>
          <p className="t-lead text-ink-2 [text-wrap:pretty]">{study.challenge[locale]}</p>
        </TextBlock>
        <TextBlock index="03" label={t("approach")}>
          <p className="t-lead text-ink-2 [text-wrap:pretty]">{study.approach[locale]}</p>
        </TextBlock>
        <TextBlock index="04" label={t("deliverables")}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {study.deliverables[locale].map((d) => (
              <li key={d} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 font-medium ring-1 ring-line">
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal" />
                {d}
              </li>
            ))}
          </ul>
        </TextBlock>
      </div>

      {study.gallery.length ? (
        <section aria-labelledby="gallery-title" className="shell pb-24 md:pb-36">
          <h2 id="gallery-title" className="t-h2 mb-10 md:mb-14">{t("gallery")}</h2>
          <ul className="grid gap-4 md:grid-cols-12 md:gap-6">
            {study.gallery.map((g, i) => (
              <li key={i} className={gallerySpan[g.size]}>
                <MaskReveal delay={(i % 3) * 0.08} className="relative h-full overflow-hidden rounded-card bg-mist">
                  <Visual visual={g.visual} locale={locale} sizes="(min-width: 768px) 60vw, 100vw" placeholderLabel={tw("placeholderVisual")} />
                </MaskReveal>
                {g.visual.caption ? <p className="mt-3 text-sm text-ink-3">{g.visual.caption[locale]}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Rendered only with verified figures. */}
      {study.results?.length ? (
        <section aria-labelledby="results-title" className="on-dark bg-ink py-24 text-white md:py-32">
          <div className="shell">
            <h2 id="results-title" className="t-h2">{t("results")}</h2>
            <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {study.results.map((r) => (
                <div key={r.label.en} className="border-t border-white/20 pt-6">
                  <dt className="text-white/70">{r.label[locale]}</dt>
                  <dd className="t-h1 mt-3 text-teal" dir="ltr">{r.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 text-sm text-white/50">{t("resultsNote")}</p>
          </div>
        </section>
      ) : null}

      <section className="shell py-24 text-center md:py-32">
        <h2 className="t-h2 mx-auto max-w-3xl [text-wrap:balance]">{t("ctaTitle")}</h2>
        <ButtonLink href="/contact" variant="teal" className="mt-10">{t("ctaButton")}</ButtonLink>
      </section>

      {related.length ? (
        <section aria-labelledby="related-title" className="shell border-t hairline pb-24 pt-16 md:pb-36">
          <h2 id="related-title" className="t-h2 mb-12">{t("related")}</h2>
          <div className="grid gap-14 md:grid-cols-2 md:gap-8">
            {related.map((r) => (
              <ProjectCard key={r.slug} study={r} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
