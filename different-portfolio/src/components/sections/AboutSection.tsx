import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";

type Principle = { title: string; body: string };

export async function AboutSection({ index = "01", showLink = true, as = "h2" }: { index?: string; showLink?: boolean; as?: "h1" | "h2" }) {
  const t = await getTranslations("about");
  const principles = t.raw("principles") as Principle[];
  // Keep heading levels sequential whether this section opens the page (h1) or sits inside it (h2).
  const Sub = as === "h1" ? "h2" : "h3";
  const Item = as === "h1" ? "h3" : "h4";

  return (
    <section id="about" aria-labelledby="about-title" className={`shell ${as === "h1" ? "pb-24 pt-32 md:pb-36 md:pt-44" : "py-24 md:py-36"}`}>
      <SectionHeader index={index} kicker={t("kicker")} title={t.raw("title") as string[]} id="about-title" as={as} />

      <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12">
        <Reveal onLoad={as === "h1"} delay={as === "h1" ? 0.2 : 0} className="lg:col-span-6 lg:col-start-1">
          <p className="t-h3 font-semibold [text-wrap:pretty]">{t("lead")}</p>
        </Reveal>
        <Reveal onLoad={as === "h1"} delay={as === "h1" ? 0.3 : 0.1} className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8">
          <p className="t-lead text-ink-2 [text-wrap:pretty]">{t("body")}</p>
          {showLink ? (
            <ButtonLink href="/about" variant="light" className="self-start">
              {t("more")}
            </ButtonLink>
          ) : null}
        </Reveal>
      </div>

      <div className="mt-20 md:mt-28">
        <Sub className="t-label mb-6 text-ink-3">{t("principlesTitle")}</Sub>
        <ol className="grid border-t hairline md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 0.08}
              className="group relative border-b hairline py-8 md:border-b-0 md:py-10 md:pe-10 md:[&:not(:first-child)]:border-s md:[&:not(:first-child)]:ps-10"
            >
              {/* Each principle is one branch of the logo's three arrows. */}
              <span className="mb-10 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-sm font-bold tabular-nums transition-colors duration-500 group-hover:border-teal group-hover:bg-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`h-px flex-1 origin-[inline-start] bg-ink/20 ${i === 1 ? "!bg-teal !h-[2px]" : ""}`} />
              </span>
              <Item className="t-h3">{p.title}</Item>
              <p className="mt-4 max-w-sm text-ink-2">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
