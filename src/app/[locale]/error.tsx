"use client";

import { useEffect } from "react";

// Error boundaries can't read server translations, so the copy is bundled here.
const copy = {
  en: { title: "Something went off route.", body: "An unexpected error stopped this page from loading.", retry: "Try again" },
  ar: { title: "حاجة خرجت عن الطريق.", body: "حصل خطأ غير متوقع ومنع الصفحة إنها تفتح.", retry: "جرّب تاني" },
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const lang = typeof document !== "undefined" && document.documentElement.lang === "ar" ? "ar" : "en";
  const t = copy[lang];
  return (
    <section className="shell grid min-h-[80svh] content-center gap-6 pb-20 pt-32">
      <h1 className="t-h1 max-w-3xl">{t.title}</h1>
      <p className="t-lead max-w-md text-ink-2">{t.body}</p>
      <button type="button" onClick={reset} className="btn mt-4 self-start justify-self-start">
        <span>{t.retry}</span>
      </button>
    </section>
  );
}
