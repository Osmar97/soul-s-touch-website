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
    { href: `#${SECTIONS.about}`, label: t.nav.experience },
    { href: `#${SECTIONS.services}`, label: t.nav.services },
    { href: `#${SECTIONS.reviews}`, label: t.nav.reviews },
    { href: `#${SECTIONS.faq}`, label: t.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
      menuButtonRef.current?.focus();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out",
        scrolled
          ? "border-b border-gold/15 bg-background/85 backdrop-blur-md"
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
          scrolled ? "h-16" : "h-24",
        )}
      >
        <a href="#top" aria-label={`${t.brand.name} ${t.brand.by}`} className="shrink-0">
          <Wordmark className="items-start" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10 xl:gap-14">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="label-luxe relative inline-flex min-h-11 items-center text-muted-foreground transition-colors duration-300 after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-500 hover:text-foreground hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-8 lg:flex">
          <LanguageSwitcher />
          <BookingCta size="sm" />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.nav.open}
          className="label-luxe flex min-h-11 min-w-11 cursor-pointer items-center justify-end gap-3 text-foreground lg:hidden"
        >
          <span aria-hidden="true" className="flex h-2.5 w-6 flex-col justify-between">
            <span className="block h-px w-full bg-foreground" />
            <span className="block h-px w-4/5 bg-foreground" />
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
        className="fixed inset-0 z-50 flex flex-col bg-ink text-ink-foreground lg:hidden"
      >
        <div className="container-luxe flex h-24 items-center justify-between">
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
          className="container-luxe flex flex-1 flex-col justify-center"
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

        <div className="container-luxe flex items-center justify-between gap-4 pb-12">
          <LanguageSwitcher tone="onInk" />
          <BookingCta variant="onInk" size="sm" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
