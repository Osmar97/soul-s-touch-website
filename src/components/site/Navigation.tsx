import { useEffect, useState } from "react";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { BookingCta } from "./BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export function Navigation() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: `#${SECTIONS.about}`, label: t.nav.about },
    { href: `#${SECTIONS.services}`, label: t.nav.services },
    { href: `#${SECTIONS.howItWorks}`, label: t.nav.howItWorks },
    { href: `#${SECTIONS.reviews}`, label: t.nav.reviews },
    { href: `#${SECTIONS.faq}`, label: t.nav.faq },
    { href: `#${SECTIONS.contact}`, label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || open ? "border-b border-border bg-background/95 backdrop-blur-sm" : "",
      )}
    >
      <a
        href="#main"
        className="label-luxe sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-background focus:px-4 focus:py-2"
      >
        {t.nav.skipToContent}
      </a>

      <div className="container-luxe flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label={`${t.brand.name} ${t.brand.by}`} className="shrink-0">
          <Wordmark className="items-start" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="label-luxe text-muted-foreground transition-colors duration-300 hover:text-gold-deep"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <LanguageSwitcher />
          <BookingCta size="sm" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.nav.close : t.nav.open}
          className="label-luxe flex cursor-pointer items-center gap-3 lg:hidden"
        >
          <span aria-hidden="true" className="flex h-3 w-6 flex-col justify-between">
            <span
              className={cn(
                "block h-px w-full bg-foreground transition-transform duration-300",
                open && "translate-y-[5.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-full bg-foreground transition-transform duration-300",
                open && "-translate-y-[5.5px] -rotate-45",
              )}
            />
          </span>
          <span className="sr-only sm:not-sr-only">{open ? t.nav.close : t.nav.menu}</span>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-border bg-background lg:hidden"
      >
        <nav aria-label="Primary mobile" className="container-luxe py-8">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href} className="border-b border-border/60 last:border-b-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-serif text-2xl text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <BookingCta size="sm" onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </div>
    </header>
  );
}
