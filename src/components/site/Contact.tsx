import { ButtonLink } from "./Button";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { buildWhatsAppUrl } from "@/config/booking";
import { SECTIONS, SITE } from "@/config/site";
import { useT } from "@/i18n";

function externalUrl(value: string): string | null {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function Contact() {
  const t = useT();
  const whatsappUrl = buildWhatsAppUrl(t.contact.whatsappMessage);
  const instagramUrl = externalUrl(SITE.instagram);
  const phoneHref = SITE.phone.replace(/[^\d+]/g, "");

  const contacts = [
    SITE.phone
      ? { label: t.contact.phone, value: SITE.phone, href: `tel:${phoneHref}`, external: false }
      : null,
    whatsappUrl
      ? { label: t.contact.whatsapp, value: SITE.phone, href: whatsappUrl, external: true }
      : null,
    SITE.email
      ? { label: t.contact.email, value: SITE.email, href: `mailto:${SITE.email}`, external: false }
      : null,
    instagramUrl
      ? {
          label: t.contact.instagram,
          value: SITE.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@").replace(/\/$/, ""),
          href: instagramUrl,
          external: true,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <Section
      id={SECTIONS.contact}
      tone="ink"
      labelledBy="contact-heading"
      className="border-t border-gold/30"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:gap-24">
        <div>
          <SectionHeading
            id="contact-heading"
            tone="onInk"
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            description={t.contact.description}
          />

          {whatsappUrl ? (
            <ButtonLink
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="onInk"
              size="lg"
              className="mt-10 w-full sm:w-auto"
            >
              {t.contact.whatsappCta}
            </ButtonLink>
          ) : null}
        </div>

        <dl className="border-t border-ink-foreground/15 lg:border-t-0">
          {contacts.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 border-b border-ink-foreground/15 py-6 sm:grid-cols-[8rem_1fr] sm:items-baseline"
            >
              <dt className="label-luxe text-gold-soft">{item.label}</dt>
              <dd className="min-w-0">
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="break-words font-serif text-xl text-ink-foreground transition-colors duration-300 hover:text-gold-soft"
                >
                  {item.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-24 border-t border-gold/30 pt-16 text-center md:mt-32 md:pt-20">
        <p className="font-serif text-3xl leading-tight text-ink-foreground sm:text-4xl md:text-5xl">
          {t.contact.homeTitle}
        </p>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-[1.9] text-ink-foreground/65 sm:text-base">
          {t.contact.homeBody}
        </p>
      </div>
    </Section>
  );
}