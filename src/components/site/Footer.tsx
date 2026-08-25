import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { SECTIONS, SITE } from "@/config/site";
import { useT } from "@/i18n";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  const links = [
    { href: `#${SECTIONS.services}`, label: t.nav.services },
    { href: `#${SECTIONS.howItWorks}`, label: t.nav.howItWorks },
    { href: `#${SECTIONS.faq}`, label: t.nav.faq },
    { href: `#${SECTIONS.contact}`, label: t.nav.contact },
  ];

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-luxe py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark tone="onInk" className="items-start" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-foreground/60">
              {t.footer.serviceArea}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="label-luxe text-ink-foreground/60 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitcher tone="onInk" />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-luxe text-ink-foreground/40">
            &copy; {year} {SITE.fullName}. {t.footer.rights}
          </p>
          <p className="label-luxe text-ink-foreground/40">
            {SITE.city}, {SITE.region}
          </p>
        </div>
      </div>
    </footer>
  );
}
