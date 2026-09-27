"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Re-scans after each client-side navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    window.__revealReady = true;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
