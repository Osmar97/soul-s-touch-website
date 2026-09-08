import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";
import { SECTIONS, SITE } from "@/config/site";
import { buildWhatsAppUrl } from "@/config/booking";
import { useT } from "@/i18n";

export function Footer() {
  const t = useT();
  const whatsappUrl = buildWhatsAppUrl(t.contact.whatsappMessage);
  const instagramUrl = SITE.instagram
    ? /^https?:\/\//i.test(SITE.instagram)
      ? SITE.instagram
      : `https://${SITE.instagram}`
    : null;

  const links = [
    { href: "#top", label: t.nav.home },
    { href: `#${SECTIONS.about}`, label: t.nav.experience },
    { href: `#${SECTIONS.services}`, label: t.nav.services },
    { href: `#${SECTIONS.reviews}`, label: t.nav.reviews },
    { href: `#${SECTIONS.faq}`, label: t.nav.faq },
    { href: `#${SECTIONS.booking}`, label: t.nav.book },
  ];

  const contactLinks = [
    SITE.phone
      ? { href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}`, label: t.contact.phone, external: false }
      : null,
    whatsappUrl
      ? { href: whatsappUrl, label: t.contact.whatsapp, external: true }
      : null,
    SITE.email
      ? { href: `mailto:${SITE.email}`, label: t.contact.email, external: false }
      : null,
    instagramUrl
      ? { href: instagramUrl, label: t.contact.instagram, external: true }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <footer className="border-t border-gold/30 bg-ink text-ink-foreground">
      <div className="container-luxe pt-14 pb-28 md:py-18 lg:pb-18">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-16 lg:gap-24">
          <Wordmark tone="onInk" className="items-start" />

          <nav aria-label={t.footer.navigation}>
            <p className="label-luxe mb-5 text-gold-soft">{t.footer.navigation}</p>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-xs text-ink-foreground/60 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-luxe mb-5 text-gold-soft">{t.footer.contact}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3 md:max-w-48">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="inline-flex min-h-11 items-center text-xs text-ink-foreground/60 transition-colors duration-300 hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-ink-foreground/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-ink-foreground/40">
            &copy; {SITE.fullName}
          </p>
          <LanguageSwitcher tone="onInk" />
        </div>
      </div>
    </footer>
  );
}
