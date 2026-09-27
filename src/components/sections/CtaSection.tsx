import Image from "next/image";
import { getTranslations } from "next-intl/server";
import mark from "@/../public/brand/different-mark-white.png";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { RouteLine } from "@/components/motion/RouteLine";
import { ButtonLink } from "@/components/ui/ButtonLink";

export async function CtaSection() {
  const t = await getTranslations("cta");
  return (
    <section aria-labelledby="cta-title" className="px-2 pb-2 md:px-3 md:pb-3">
      <div className="on-dark grain relative isolate overflow-hidden rounded-[1.75rem] bg-ink text-white md:rounded-[2.5rem]">
        <div aria-hidden="true" className="absolute -bottom-40 start-1/3 -z-10 h-[30rem] w-[30rem] rounded-full bg-teal/25 blur-[140px]" />
        <RouteLine tone="light" className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-40 w-full opacity-40 md:h-56" />

        <div className="shell relative grid gap-12 py-24 md:py-36 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <p className="t-label mb-8 flex items-center gap-3 text-white/60">
              <span className="h-px w-10 bg-teal" />
              {t("kicker")}
            </p>
            <Lines as="h2" id="cta-title" lines={t.raw("title") as string[]} accentIndex={1} accentClass="text-teal" className="t-display" />
          </div>
          <Reveal delay={0.2} className="flex flex-col items-start gap-8 lg:col-span-3">
            <p className="t-lead text-white/75">{t("body")}</p>
            <ButtonLink href="/contact" variant="teal" className="!min-h-14 !text-base">{t("button")}</ButtonLink>
          </Reveal>
        </div>

        <Image
          src={mark}
          alt=""
          aria-hidden="true"
          sizes="320px"
          className="pointer-events-none absolute -end-10 -top-10 -z-10 w-48 rotate-12 opacity-[0.08] motion-safe:animate-[spin_60s_linear_infinite] md:w-80"
        />
      </div>
    </section>
  );
}
