import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { BookingCta } from "./BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Minimal luxury header: transparent while the hero is in view, quietly
 * solidifying on scroll. The mobile menu opens as a full-screen overlay.
 */
export function Navigation() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "#top", label: t.nav.home },
    { href: `#${SECTIONS.homeExperience}`, label: t.nav.experience },
    { href: `#${SECTIONS.services}`, label: t.nav.services },
    { href: `#${SECTIONS.clientExperience}`, label: t.nav.guidelines },
    { href: `#${SECTIONS.faq}`, label: t.nav.faq },
    { href: `#${SECTIONS.reviews}`, label: t.nav.reviews },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out",
        scrolled
          ? "border-b border-gold/15 bg-background/90 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="label-luxe sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-background focus:px-4 focus:py-2"
      >
        {t.nav.skipToContent}
      </a>

      <div
        className={cn(
          "container-luxe flex items-center justify-between gap-8 transition-all duration-700 ease-out",
          scrolled ? "h-16 lg:h-20" : "h-20 lg:h-28",
        )}
      >
        <a href="#top" aria-label={`${t.brand.name} ${t.brand.by}`} className="shrink-0">
          <Wordmark tone={scrolled ? "default" : "onInk"} className="items-start" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 xl:gap-11">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={cn(
                    "label-luxe relative inline-flex min-h-11 items-center transition-all duration-300 after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full",
                    scrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/80 hover:text-white hover:opacity-100",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          <LanguageSwitcher tone={scrolled ? "default" : "onInk"} />
          <BookingCta
            variant={scrolled ? "outline" : "onInk"}
            size="sm"
            label={t.common.bookNow}
            className={cn(
              "rounded-none border-gold/60 text-[0.6875rem] uppercase tracking-[0.24em] transition-all duration-300",
              !scrolled && "border-gold/60 text-white/95 hover:border-gold hover:bg-gold/15 hover:text-white",
            )}
          />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.nav.open}
          className={cn(
            "label-luxe flex min-h-11 min-w-11 cursor-pointer items-center justify-end gap-3 transition-colors duration-300 lg:hidden",
            scrolled ? "text-foreground" : "text-white",
          )}
        >
          <span aria-hidden="true" className="flex h-2.5 w-6 flex-col justify-between">
            <span
              className={cn(
                "block h-px w-full transition-colors duration-300",
                scrolled ? "bg-foreground" : "bg-white",
              )}
            />
            <span
              className={cn(
                "block h-px w-4/5 transition-colors duration-300",
                scrolled ? "bg-foreground" : "bg-white",
              )}
            />
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
          <Wordmark tone="onInk" className="items-start" />
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
            {[...links, { href: `#${SECTIONS.booking}`, label: t.nav.book }].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-serif text-3xl text-ink-foreground transition-colors duration-300 hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
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
