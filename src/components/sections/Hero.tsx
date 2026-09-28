import { getTranslations } from "next-intl/server";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { RouteLine } from "@/components/motion/RouteLine";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowDown } from "@/components/ui/Icons";
import { HeroPostcards } from "./HeroPostcards";

export async function Hero() {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const lines = t.raw("lines") as string[];
  const cards = t.raw("cards") as string[];

  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28">
      {/* Soft teal glow behind the art, the only gradient on the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute -end-40 top-10 h-[38rem] w-[38rem] rounded-full bg-teal/15 blur-[120px]" />

      <div className="shell relative grid flex-1 grid-cols-1 items-center gap-10 pb-6 lg:grid-cols-12 lg:gap-6">
        <div className="relative z-10 lg:col-span-8">
          <Reveal y={12} onLoad>
            <p className="t-label mb-6 flex items-center gap-3 text-ink-2 md:mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
              </span>
              {t("eyebrow")}
            </p>
          </Reveal>
          <Lines as="h1" id="hero-title" lines={lines} onLoad delay={0.15} accentIndex={2} className="t-display" />
        </div>

        <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-sm lg:col-span-4 lg:me-0 lg:ms-auto lg:max-w-[24rem]">
          <HeroPostcards labels={cards} ariaLabel={t("artLabel")} />
        </div>
      </div>

      <div className="shell relative z-10 grid gap-8 pb-10 md:pb-14 lg:grid-cols-12 lg:items-end">
        <Reveal onLoad delay={0.7} className="lg:col-span-5">
          <p className="t-lead max-w-xl text-ink-2">{t("body")}</p>
        </Reveal>
        <Reveal onLoad delay={0.85} className="flex flex-wrap items-center gap-3 lg:col-span-4">
          <ButtonLink href="/contact">{t("primary")}</ButtonLink>
          <ButtonLink href="/clients" variant="light">{t("secondary")}</ButtonLink>
        </Reveal>
        <Reveal onLoad delay={1} className="hidden items-end justify-end gap-6 lg:col-span-3 lg:flex">
          <p className="max-w-[12rem] text-end text-sm font-medium text-ink-3">{t("aside")}</p>
          <a href="#after-hero" className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line-strong transition-colors hover:bg-ink hover:text-white" aria-label={tc("scroll")}>
            <ArrowDown className="motion-safe:animate-bounce" />
          </a>
        </Reveal>
      </div>

      <RouteLine onLoad className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-50 md:h-32" />
      <span id="after-hero" className="absolute bottom-0" />
    </section>
  );
}
