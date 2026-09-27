"use client";

import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ArrowBadge } from "@/components/ui/ButtonLink";
import { Close, Menu } from "@/components/ui/Icons";
import { LanguageSwitcher } from "./LanguageSwitcher";

export interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  items: NavItem[];
  cta: string;
  logo: ReactNode;
  logoLight: ReactNode;
  labels: {
    home: string;
    openMenu: string;
    closeMenu: string;
    mainNav: string;
    language: string;
    languages: Record<Locale, { short: string; long: string }>;
  };
  footerNote: ReactNode;
}

const EASE = [0.76, 0, 0.24, 1] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ items, cta, logo, logoLight, labels, footerNote }: HeaderProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 240 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel) return;
      // Keep focus inside the open menu.
      const focusables = panel.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);


  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
      >
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled && !open ? "border-b border-line bg-paper/80 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent"
          }`}
        >
          <div className="shell flex h-18 items-center justify-between gap-6 md:h-20">
            <Link href="/" aria-label={labels.home} className="relative z-10 -m-2 block p-2">
              <span className="block w-[118px] md:w-[136px]">{logo}</span>
            </Link>

            <nav aria-label={labels.mainNav} className="hidden lg:block">
              <ul className="flex items-center gap-0.5 xl:gap-1">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group relative inline-flex h-10 items-center rounded-full px-3 text-[0.9375rem] xl:px-4 font-medium transition-colors ${
                          active ? "text-ink" : "text-ink-2 hover:text-ink"
                        }`}
                      >
                        {active ? (
                          <m.span
                            layoutId="nav-active"
                            className="absolute inset-0 -z-10 rounded-full bg-white shadow-[inset_0_0_0_1px_var(--color-line)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        ) : null}
                        <span className="link-draw" data-active={active}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <LanguageSwitcher labels={labels.languages} ariaLabel={labels.language} />
              </div>
              <Link href="/contact" className="btn btn-teal hidden !min-h-11 md:inline-flex">
                <span>{cta}</span>
                <ArrowBadge />
              </Link>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? labels.closeMenu : labels.openMenu}
                className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition-transform active:scale-95 lg:hidden"
              >
                {open ? <Close /> : <Menu className="flip-rtl" />}
              </button>
            </div>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {open ? (
          <m.div
            key="menu"
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labels.mainNav}
            className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-white lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.75rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.5rem)" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
          >
            <div className="shell flex h-18 shrink-0 items-center justify-between md:h-20">
              <Link href="/" aria-label={labels.home} className="block w-[118px] md:w-[136px]" onClick={() => setOpen(false)}>
                {logoLight}
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label={labels.closeMenu}
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
              >
                <Close />
              </button>
            </div>
            <nav aria-label={labels.mainNav} className="shell flex flex-1 flex-col justify-center py-8">
              <ul className="space-y-1">
                {items.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href} className="overflow-hidden">
                      <m.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.18 + i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-4 py-1.5 font-[family-name:var(--font-display)] text-[clamp(2.25rem,10vw,4rem)] font-bold leading-[1.1] tracking-[-0.03em] rtl:tracking-normal"
                        >
                          <span className="t-label w-8 shrink-0 tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                          <span className={active ? "text-teal" : "transition-colors group-hover:text-teal"}>{item.label}</span>
                        </Link>
                      </m.div>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <m.div
              className="shell flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-white/15 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.5 }}
            >
              <LanguageSwitcher labels={labels.languages} ariaLabel={labels.language} tone="dark" onNavigate={() => setOpen(false)} />
              <Link href="/contact" className="btn btn-teal" onClick={() => setOpen(false)}>
                <span>{cta}</span>
                <ArrowBadge />
              </Link>
              <div className="w-full text-sm text-white/60">{footerNote}</div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
