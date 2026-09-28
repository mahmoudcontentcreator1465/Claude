import { getTranslations } from "next-intl/server";
import { emailHref, site, whatsappHref } from "@/content/site";

function Row({ label, value, href, muted }: { label: string; value: string; href: string; muted: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`t-label ${muted}`}>{label}</span>
      <a
        href={href}
        className="link-draw self-start text-lg font-medium"
        dir="ltr"
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {value}
      </a>
    </div>
  );
}

/** Email / WhatsApp / socials. Placeholder details (not supplied yet) are simply not shown. */
export async function ContactPoints({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const t = await getTranslations("contact");
  const muted = tone === "dark" ? "text-white/55" : "text-ink-3";
  const mail = emailHref();
  const wa = whatsappHref(t("whatsappPrefill"));
  const socials = site.socials.filter((s) => !s.placeholder && s.href);

  return (
    <div className={`grid gap-6 ${compact ? "" : "sm:grid-cols-2"}`}>
      {mail ? <Row label={t("emailLabel")} value={site.email.value} href={mail} muted={muted} /> : null}
      {wa ? <Row label={t("whatsappLabel")} value={site.whatsapp.value} href={wa} muted={muted} /> : null}
      {socials.length ? (
        <div className={`flex flex-col gap-2 ${compact ? "" : "sm:col-span-2"}`}>
          <span className={`t-label ${muted}`}>{t("socialLabel")}</span>
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors ${tone === "dark" ? "border-white/25 hover:bg-white hover:text-ink" : "border-line-strong hover:bg-ink hover:text-white"}`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
