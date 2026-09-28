"use client";

import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitContact } from "@/app/actions/contact";
import { contactSchema, fieldErrors, type ContactField, type ContactState } from "@/lib/contact-schema";
import { ArrowBadge } from "@/components/ui/ButtonLink";
import { Alert, Check } from "@/components/ui/Icons";

const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm({ serviceOptions }: { serviceOptions: string[] }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<Partial<Record<ContactField, string>>>({});
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors = { ...serverErrors, ...clientErrors };

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      startedAt.current = Date.now();
    }
    if (state.status !== "idle" && state.status !== "invalid") statusRef.current?.focus();
  }, [state]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const stamp = e.currentTarget.elements.namedItem("startedAt");
    if (stamp instanceof HTMLInputElement) stamp.value = String(startedAt.current);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      e.preventDefault();
      const errs = fieldErrors(parsed.error);
      setClientErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else {
      setClientErrors({});
    }
  }

  const clearError = (field: ContactField) =>
    setClientErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const statusMessage: Record<string, { tone: "ok" | "warn" | "err"; text: string }> = {
    success: { tone: "ok", text: t("status.success") },
    "not-configured": { tone: "warn", text: t("status.notConfigured") },
    "rate-limited": { tone: "warn", text: t("status.rateLimited") },
    spam: { tone: "err", text: t("status.spam") },
    error: { tone: "err", text: t("status.error") },
  };
  const status = statusMessage[state.status];

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
      <input type="hidden" name="startedAt" defaultValue="0" />
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label>
          {t("form.honeypot")}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field name="name" label={t("form.name")} error={errors.name && t(`errors.${errors.name}`)} required requiredLabel={t("form.required")}>
        {(p) => <input {...p} type="text" autoComplete="name" onInput={() => clearError("name")} />}
      </Field>
      <Field name="company" label={t("form.company")} error={errors.company && t(`errors.${errors.company}`)} required requiredLabel={t("form.required")}>
        {(p) => <input {...p} type="text" autoComplete="organization" onInput={() => clearError("company")} />}
      </Field>
      <Field name="email" label={t("form.email")} error={errors.email && t(`errors.${errors.email}`)} required requiredLabel={t("form.required")}>
        {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" dir="ltr" onInput={() => clearError("email")} />}
      </Field>
      <Field name="phone" label={t("form.phone")} optionalLabel={t("form.optional")} error={errors.phone && t(`errors.${errors.phone}`)}>
        {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" onInput={() => clearError("phone")} />}
      </Field>
      <Field name="service" label={t("form.service")} optionalLabel={t("form.optional")} className="sm:col-span-2">
        {(p) => (
          <select {...p} defaultValue="" className={`${p.className} appearance-none bg-[length:1rem] bg-no-repeat pe-10 [background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] [background-position:right_1rem_center] rtl:[background-position:left_1rem_center]`}>
            <option value="">{t("form.servicePlaceholder")}</option>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
            <option value={t("form.serviceNotSure")}>{t("form.serviceNotSure")}</option>
            <option value={t("form.serviceOther")}>{t("form.serviceOther")}</option>
          </select>
        )}
      </Field>
      <Field
        name="message"
        label={t("form.message")}
        hint={t("form.messageHint")}
        error={errors.message && t(`errors.${errors.message}`)}
        required
        requiredLabel={t("form.required")}
        className="sm:col-span-2"
      >
        {(p) => <textarea {...p} rows={5} onInput={() => clearError("message")} className={`${p.className} min-h-36 resize-y py-4`} />}
      </Field>

      {turnstileKey ? (
        <div className="sm:col-span-2">
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={turnstileKey} data-language={locale} />
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={pending} className="btn btn-teal !min-h-14 self-start disabled:cursor-wait disabled:opacity-70">
          <span>{pending ? t("form.sending") : t("form.submit")}</span>
          <ArrowBadge />
        </button>
        {Object.keys(errors).length ? (
          <p role="alert" className="text-sm font-medium text-[#B42318]">
            {t("errors.summary")}
          </p>
        ) : null}
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none sm:col-span-2">
        {status ? (
          <div
            role={status.tone === "ok" ? "status" : "alert"}
            className={`flex items-start gap-3 rounded-2xl p-4 text-sm font-medium leading-relaxed ${
              status.tone === "ok" ? "bg-teal-soft text-teal-ink" : status.tone === "warn" ? "bg-[#FDF3DC] text-[#7A4B00]" : "bg-[#FDECEA] text-[#B42318]"
            }`}
          >
            <span className="mt-0.5 shrink-0">{status.tone === "ok" ? <Check /> : <Alert />}</span>
            <p>{status.text}</p>
          </div>
        ) : null}
      </div>
    </form>
  );
}

type ControlProps = {
  id: string;
  name: string;
  className: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
  "aria-required"?: true;
};

function Field({
  name,
  label,
  hint,
  error,
  required,
  requiredLabel,
  optionalLabel,
  className,
  children,
}: {
  name: ContactField;
  label: string;
  hint?: string;
  error?: string | false;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = `contact-${name}`;
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-semibold">
        <span>
          {label}
          {required ? (
            <span aria-hidden="true" className="text-teal-ink">
              {" "}*
            </span>
          ) : null}
          {required && requiredLabel ? <span className="sr-only"> ({requiredLabel})</span> : null}
        </span>
        {optionalLabel ? <span className="text-xs font-normal text-ink-3">{optionalLabel}</span> : null}
      </label>
      {children({
        id,
        name,
        className: `w-full rounded-2xl border bg-white px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-ink focus:shadow-[0_0_0_4px_rgba(26,188,156,.25)] ${
          name === "message" ? "" : "h-14"
        } ${error ? "border-[#B42318]" : "border-line-strong"}`,
        ...(error ? { "aria-invalid": true as const } : {}),
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
        ...(required ? { "aria-required": true as const } : {}),
      })}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-[#B42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
