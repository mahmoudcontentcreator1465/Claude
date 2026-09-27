import { getTranslations } from "next-intl/server";
import { emailHref, site, whatsappHref } from "@/content/site";
import { Badge } from "@/components/ui/Badge";

function Row({ label, value, href, placeholder, muted, tbc }: { label: string; value: string; href?: string; placeholder?: boolean; muted: string; tbc: string }) {
return (
  <div className="flex flex-col gap-1">
    <span className={`t-label ${muted}`}>{label}</span>
    <span className="flex flex-wrap items-center gap-2">
      {href ? (
        <a href={href} className="link-draw text-lg font-semibold" dir="ltr" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {value}
        </a>
      ) : (
        <span className={`text-lg font-semibold ${placeholder ? muted : ""}`} dir="ltr">
          {value}
        </span>
      )}
      {placeholder ? <Badge tone="draft">{tbc}</Badge> : null}
    </span>
  </div>
);
}

/** Email / WhatsApp / socials, rendering placeholders visibly and without dead links. */
export async function ContactPoints({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const muted = tone === "dark" ? "text-white/55" : "text-ink-3";
  const mail = emailHref();
  const wa = whatsappHref();

  return (
    <div className={`grid gap-6 ${compact ? "" : "sm:grid-cols-2"}`}>
      <Row label={t("emailLabel")} value={site.email.value} href={mail} placeholder={site.email.placeholder} muted={muted} tbc={tc("tbc")} />
      <Row label={t("whatsappLabel")} value={site.whatsapp.value} href={wa} placeholder={site.whatsapp.placeholder} muted={muted} tbc={tc("tbc")} />
      <div className={`flex flex-col gap-2 ${compact ? "" : "sm:col-span-2"}`}>
        <span className={`t-label ${muted}`}>{t("socialLabel")}</span>
        <ul className="flex flex-wrap gap-2">
          {site.socials.map((s) => (
            <li key={s.id}>
              {s.placeholder || !s.href ? (
                <span
                  className={`inline-flex h-9 items-center gap-2 rounded-full border border-dashed px-3.5 text-sm ${tone === "dark" ? "border-white/25 text-white/55" : "border-line-strong text-ink-3"}`}
                  title={tc("placeholderNote")}
                >
                  {s.label}
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider">{tc("tbc")}</span>
                </span>
              ) : (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors ${tone === "dark" ? "border-white/25 hover:bg-white hover:text-ink" : "border-line-strong hover:bg-ink hover:text-white"}`}
                >
                  {s.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
