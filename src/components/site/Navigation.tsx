import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { BookingCta } from "./BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  /** Anchor the link points at. */
  href: string;
  /** Id of the section observed for the active state. */
  section: string;
  label: string;
};

/**
 * Solid black luxury header with a larger brand lockup, an ivory / champagne
 * gold nav, and a scroll-aware active state.
 *
 * The active item is driven by a single IntersectionObserver watching a thin
 * horizontal band across the middle of the viewport — no scroll listeners, no
 * per-frame React updates, and it tracks the section correctly in both
 * directions.
 */
export function Navigation() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS.hero);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const links: NavItem[] = [
    { href: "#top", section: SECTIONS.hero, label: t.nav.home },
    { href: `#${SECTIONS.homeExperience}`, section: SECTIONS.homeExperience, label: t.nav.experience },
    { href: `#${SECTIONS.services}`, section: SECTIONS.services, label: t.nav.services },
    {
      href: `#${SECTIONS.clientExperience}`,
      section: SECTIONS.clientExperience,
      label: t.nav.guidelines,
    },
    { href: `#${SECTIONS.faq}`, section: SECTIONS.faq, label: t.nav.faq },
    { href: `#${SECTIONS.reviews}`, section: SECTIONS.reviews, label: t.nav.reviews },
  ];

  useEffect(() => {
    const observed = links
      .map((link) => document.getElementById(link.section))
      .filter((element): element is HTMLElement => element !== null);

    if (observed.length === 0 || typeof IntersectionObserver === "undefined") return;

    // A narrow band just above the middle of the viewport decides which
    // section currently owns the navigation.
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        if (entering.length === 0) return;
        entering.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        const next = entering[0]?.target.id;
        if (next) setActiveSection(next);
      },
      { rootMargin: "-42% 0px -54% 0px", threshold: 0 },
    );

    for (const element of observed) observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = menuButtonRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    closeButtonRef.current?.focus();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  const isActive = (section: string) => section === activeSection;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-ink-foreground/10 bg-ink transition-shadow duration-500",
        scrolled && "shadow-[0_1px_0_0_color-mix(in_oklab,var(--gold)_25%,transparent)]",
      )}
    >
      <a
        href="#main"
        className="label-luxe sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-background focus:px-4 focus:py-2"
      >
        {t.nav.skipToContent}
      </a>

      {/* Mobile bar */}
      <div className="container-luxe flex h-20 items-center justify-between gap-4 lg:hidden">
        <a href="#top" aria-label={`${t.brand.name} ${t.brand.by}`} className="shrink-0">
          <Wordmark tone="onInk" size="lg" className="items-start" />
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.nav.open}
          className="label-luxe flex min-h-11 min-w-11 cursor-pointer items-center justify-end gap-3 text-ink-foreground"
        >
          <span className="sr-only sm:not-sr-only">{t.nav.menu}</span>
          <span aria-hidden="true" className="flex h-2.5 w-6 flex-col justify-between">
            <span className="block h-px w-full bg-ink-foreground" />
            <span className="ml-auto block h-px w-4/5 bg-ink-foreground" />
          </span>
        </button>
      </div>

      {/* Desktop: centred crest above a ruled navigation row */}
      <div className="hidden lg:block">
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out",
            scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
          )}
          aria-hidden={scrolled}
        >
          <div className="min-h-0">
            <div className="relative flex items-center justify-center py-6">
              <a
                href="#top"
                tabIndex={scrolled ? -1 : 0}
                aria-label={`${t.brand.name} ${t.brand.by}`}
              >
                <Wordmark tone="onInk" size="xl" />
              </a>
              <LanguageSwitcher
                tone="onInk"
                className="absolute top-1/2 right-[var(--gutter,2.5rem)] -translate-y-1/2 pr-10"
              />
            </div>
          </div>
        </div>

        <div className="flex h-14 items-stretch border-t border-ink-foreground/15">
          <div className="flex w-48 shrink-0 items-center pl-10 xl:w-60">
            <a
              href="#top"
              tabIndex={scrolled ? 0 : -1}
              aria-hidden={!scrolled}
              className={cn(
                "transition-opacity duration-500",
                scrolled ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Wordmark tone="onInk" size="sm" className="items-start" />
            </a>
          </div>

          <nav aria-label="Primary" className="flex min-w-0 flex-1 justify-center">
            <ul className="flex items-stretch gap-7 xl:gap-10">
              {links.map((link) => {
                const active = isActive(link.section);
                return (
                  <li key={link.section} className="flex">
                    <a
                      href={link.href}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "relative inline-flex items-center whitespace-nowrap font-sans text-[0.75rem] font-light uppercase tracking-[0.2em] transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-px after:-translate-x-1/2 after:bg-gold after:transition-all after:duration-500",
                        active
                          ? "text-gold-soft after:w-full"
                          : "text-ink-foreground/75 after:w-0 hover:text-ink-foreground",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={`#${SECTIONS.booking}`}
            className="group flex w-48 shrink-0 items-center justify-center gap-3 border-l border-ink-foreground/15 font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-ink-foreground transition-colors duration-300 hover:text-gold-soft xl:w-60"
          >
            {t.nav.book}
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rotate-45 border-t border-r border-current transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>

      {/* Full-screen mobile overlay */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-ink-foreground lg:hidden"
      >
        <div className="container-luxe flex h-24 shrink-0 items-center justify-between">
          <Wordmark tone="onInk" size="xl" className="items-start" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t.nav.close}
            className="label-luxe min-h-11 cursor-pointer text-ink-foreground/70 transition-colors hover:text-gold"
          >
            {t.nav.close}
          </button>
        </div>

        <nav
          aria-label="Primary mobile"
          className="container-luxe my-auto flex flex-col justify-center py-8"
        >
          <ul className="flex flex-col gap-1">
            {[...links, { href: `#${SECTIONS.booking}`, section: SECTIONS.booking, label: t.nav.book }].map(
              (link) => (
                <li key={link.section}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.section) ? "true" : undefined}
                    className={cn(
                      "block border-l py-3 pl-5 font-serif text-3xl transition-colors duration-300",
                      isActive(link.section)
                        ? "border-gold text-gold"
                        : "border-transparent text-ink-foreground hover:text-gold",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="container-luxe flex shrink-0 items-center justify-between gap-4 pb-12 pb-[calc(3rem+env(safe-area-inset-bottom))]">
          <LanguageSwitcher tone="onInk" />
          <BookingCta variant="onInk" size="sm" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
