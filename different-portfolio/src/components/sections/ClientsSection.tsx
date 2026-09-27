import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { clientName, getClients, isDraft } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogoCard } from "@/components/clients/LogoCard";

export async function ClientsSection({ index = "03", limit, as = "h2" }: { index?: string; limit?: number; as?: "h1" | "h2" }) {
  const t = await getTranslations("clients");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const all = getClients();
  const shown = limit ? all.filter((c) => c.featured).slice(0, limit) : all;
  const hasMore = limit ? all.length > shown.length : false;

  return (
    <section id="clients" aria-labelledby="clients-title" className={`shell ${as === "h1" ? "pb-24 pt-32 md:pb-36 md:pt-44" : "py-24 md:py-36"}`}>
      <SectionHeader
        index={index}
        kicker={t("kicker")}
        title={t("title")}
        intro={t("body")}
        id="clients-title"
        as={as}
        action={all.length ? <span className="t-label text-ink-3">{t("count", { count: all.length })}</span> : undefined}
      />

      {shown.length === 0 ? (
        <Reveal className="mt-14 grid place-items-center rounded-card border border-dashed border-line-strong px-6 py-20 text-center">
          <p className="t-lead max-w-md text-ink-2">{t("empty")}</p>
        </Reveal>
      ) : (
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:mt-20 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((c, i) => (
            // On the clients page the first rows are above the fold: animate them with CSS on load
            // rather than waiting for the scroll observer, so they paint (and count for LCP) immediately.
            <Reveal as="li" key={c.id} delay={(as === "h1" && i < 10 ? 0.25 : 0) + (i % 5) * 0.06} onLoad={as === "h1" && i < 10}>
              <LogoCard
                client={c}
                name={clientName(c, locale)}
                priority={as === "h1" && i < 5}
                badge={isDraft(c.status) ? (c.status === "pending" ? tc("pending") : tc("draft")) : undefined}
              />
            </Reveal>
          ))}
        </ul>
      )}

      {hasMore ? (
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/clients" variant="light">{t("viewAll")}</ButtonLink>
        </div>
      ) : null}
    </section>
  );
}
