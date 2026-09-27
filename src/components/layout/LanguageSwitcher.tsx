"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * EN / AR segmented switch. Keeps the visitor on the same page, and next-intl
 * stores the choice in the NEXT_LOCALE cookie so it's remembered next visit.
 */
export function LanguageSwitcher({
  labels,
  ariaLabel,
  tone = "light",
  onNavigate,
}: {
  labels: Record<Locale, { short: string; long: string }>;
  ariaLabel: string;
  tone?: "light" | "dark";
  onNavigate?: () => void;
}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const base = tone === "dark" ? "border-white/25" : "border-line-strong";
  return (
    <nav aria-label={ariaLabel} className={`relative inline-flex rounded-full border p-1 ${base}`}>
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            onClick={onNavigate}
            scroll={false}
            className={`relative z-10 grid h-8 min-w-10 place-items-center rounded-full px-3 text-xs font-bold tracking-[0.08em] transition-colors duration-300 ${
              active
                ? tone === "dark"
                  ? "bg-white text-ink"
                  : "bg-ink text-white"
                : tone === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-ink-2 hover:text-ink"
            }`}
          >
            {labels[l].short}
            <span className="sr-only"> {labels[l].long}</span>
          </Link>
        );
      })}
    </nav>
  );
}
