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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink">
      <a
        href="#main"
        className="label-luxe sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-background focus:px-4 focus:py-2"
      >
        {t.nav.skipToContent}
      </a>

      <div className="container-luxe flex h-20 items-center justify-between gap-4 lg:h-24 xl:gap-8">
        <a href="#top" aria-label={`${t.brand.name} ${t.brand.by}`} className="shrink-0">
          <Wordmark tone="onInk" size="lg" className="items-start" />
        </a>

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-4 xl:gap-4 2xl:gap-7">
            {links.map((link) => {
              const active = isActive(link.section);
              return (
                <li key={link.section}>
                  <a
                    href={link.href}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center whitespace-nowrap font-sans text-[0.625rem] font-normal uppercase tracking-[0.16em] transition-colors duration-300 after:absolute after:bottom-2 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-500 after:ease-out xl:text-[0.6875rem] xl:tracking-[0.18em]",
                      active
                        ? "text-gold-soft after:w-full"
                        : "text-white/70 after:w-0 hover:text-white hover:after:w-full",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
          <LanguageSwitcher tone="onInk" className="hidden xl:flex" />
          <BookingCta
            variant="onInk"
            size="sm"
            label={t.common.bookNow}
            className="whitespace-nowrap px-4 tracking-[0.2em] transition-all duration-300 hover:border-gold hover:bg-gold/15 xl:px-5"
          />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.nav.open}
          className="label-luxe flex min-h-11 min-w-11 cursor-pointer items-center justify-end gap-3 text-white transition-colors duration-300 lg:hidden"
        >
          <span aria-hidden="true" className="flex h-2.5 w-6 flex-col justify-between">
            <span className="block h-px w-full bg-white" />
            <span className="block h-px w-4/5 bg-white" />
          </span>
          <span className="sr-only sm:not-sr-only">{t.nav.menu}</span>
        </button>
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
          <Wordmark tone="onInk" size="lg" className="items-start" />
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
