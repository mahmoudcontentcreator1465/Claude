import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ContactPoints } from "./ContactPoints";
import type { NavItem } from "./Header";

export async function Footer({ items, languages }: { items: NavItem[]; languages: Record<Locale, { short: string; long: string }> }) {
  const t = await getTranslations("footer");
  const ta = await getTranslations("a11y");
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-white">
      <div className="shell grid gap-14 pb-10 pt-20 md:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" aria-label={ta("home")} className="inline-block w-[160px] md:w-[190px]">
            <Logo variant="white" />
          </Link>
          <p className="mt-6 max-w-sm text-lg text-white/70">{t("description")}</p>
        </div>

        <nav aria-label={ta("footerNav")} className="lg:col-span-3">
          <h2 className="t-label text-white/50">{t("navTitle")}</h2>
          <ul className="mt-5 space-y-2.5">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw text-lg font-medium text-white/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8 lg:col-span-4">
          <div>
            <h2 className="t-label mb-5 text-white/50">{t("contactTitle")}</h2>
            <ContactPoints tone="dark" compact />
          </div>
          <div>
            <h2 className="t-label mb-3 text-white/50">{t("languageTitle")}</h2>
            <LanguageSwitcher labels={languages} ariaLabel={ta("language")} tone="dark" />
          </div>
        </div>
      </div>

      {/* Oversized wordmark-scale sign-off; decorative. */}
      <div aria-hidden="true" className="shell select-none">
        <svg viewBox="0 0 1000 190" className="-mb-[3%] block w-full" role="presentation">
          <text x="0" y="178" direction="ltr" textLength="990" lengthAdjust="spacingAndGlyphs" fill="rgb(255 255 255 / 0.06)" fontFamily="var(--font-jakarta)" fontWeight="800" fontSize="236" letterSpacing="-12">
            different
          </text>
        </svg>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year })}</p>
          <p dir="ltr">Different Marketing Agency</p>
        </div>
      </div>
    </footer>
  );
}
