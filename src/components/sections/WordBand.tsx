import Image from "next/image";
import { getTranslations } from "next-intl/server";
import mark from "@/../public/brand/different-mark-white.png";

/** Black editorial band with the brand's vocabulary drifting past. */
function Row({ words, hidden }: { words: string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {words.map((w) => (
        <li key={w} className="flex items-center">
          <span className="px-6 font-[family-name:var(--font-display)] text-[clamp(2.25rem,6vw,5.5rem)] font-extrabold leading-[1.15] tracking-[-0.04em] text-white rtl:tracking-normal md:px-10">
            {w}
          </span>
          <Image src={mark} alt="" className="h-9 w-9 md:h-14 md:w-14" sizes="56px" />
        </li>
      ))}
    </ul>
  );
}

export async function WordBand() {
  const t = await getTranslations("band");
  const words = t.raw("words") as string[];
  return (
    <section aria-label={words.join(", ")} className="marquee on-dark overflow-hidden bg-ink py-6 md:py-9" style={{ ["--marquee-duration" as string]: "48s" }}>
      <div className="marquee-track flex w-max">
        <Row words={words} />
        <Row words={words} hidden />
      </div>
    </section>
  );
}
