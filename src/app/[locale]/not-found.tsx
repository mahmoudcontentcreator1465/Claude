import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DestinationArt } from "@/components/art/DestinationArt";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="shell grid min-h-[90svh] items-center gap-12 pb-20 pt-32 md:grid-cols-12">
      <div className="md:col-span-7">
        <p className="t-label mb-6 text-ink-3">404</p>
        <h1 className="t-h1">{t("title")}</h1>
        <p className="t-lead mt-6 max-w-md text-ink-2">{t("body")}</p>
        <ButtonLink href="/" className="mt-10">{t("button")}</ButtonLink>
      </div>
      <div className="md:col-span-4 md:col-start-9">
        <div className="overflow-hidden rounded-card ring-1 ring-line">
          <DestinationArt variant="route" className="block aspect-[4/5] w-full" />
        </div>
      </div>
    </section>
  );
}
