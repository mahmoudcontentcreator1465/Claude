import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CaseStudy } from "@/content/types";
import { clientName, getClient, isDraft } from "@/lib/content";
import { services } from "@/content/services";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Visual } from "./Visual";

export async function ProjectCard({
  study,
  locale,
  aspect = "aspect-[4/5]",
  size = "md",
  priority,
}: {
  study: CaseStudy;
  locale: Locale;
  aspect?: string;
  size?: "lg" | "md";
  priority?: boolean;
}) {
  const t = await getTranslations("work");
  const tc = await getTranslations("common");
  const ts = await getTranslations("caseStudy");
  const client = getClient(study.clientId);
  const name = client ? clientName(client, locale) : t("clientTbc");
  const serviceNames = study.services
    .map((id) => services.find((s) => s.id === id)?.title[locale])
    .filter(Boolean) as string[];

  return (
    <article className="group relative">
      <Link href={`/work/${study.slug}`} className="block" data-cursor={t("view")}>
        <MaskReveal className={`relative overflow-hidden rounded-card bg-mist ${aspect}`}>
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
            <Visual
              visual={study.cover}
              locale={locale}
              sizes={size === "lg" ? "(min-width: 1024px) 90vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
              priority={priority}
              placeholderLabel={t("placeholderVisual")}
            />
          </div>
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <span className="flex flex-wrap gap-1.5">
              {isDraft(study.status) ? <Badge>{tc("draft")}</Badge> : null}
            </span>
            <span className="grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="flip-rtl inline-flex"><ArrowUpRight /></span>
            </span>
          </div>
        </MaskReveal>

        <div className="mt-5 grid gap-3 md:mt-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-3">
            <span className="font-semibold text-ink">{name}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/30" />
            <span>{study.projectType[locale]}</span>
          </p>
          <h3 className={size === "lg" ? "t-h2" : "t-h3"}>
            <span className="link-draw">{study.title[locale]}</span>
          </h3>
          {serviceNames.length ? (
            <ul className="flex flex-wrap gap-1.5" aria-label={ts("services")}>
              {serviceNames.map((s) => (
                <li key={s} className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium text-ink-2">
                  {s}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
