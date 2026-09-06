import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { SetmoreBooking } from "./SetmoreBooking";
import { Button, ButtonLink } from "./Button";
import { SECTIONS } from "@/config/site";
import { buildWhatsAppUrl } from "@/config/booking";
import { useT } from "@/i18n";

/**
 * Primary conversion section. Setmore is the booking engine; this section
 * frames it in the Soul's Touch brand and carries the practical booking
 * information (notice, cancellation, payment) plus a direct-contact option.
 */
export function Booking() {
  const t = useT();
  const whatsappUrl = buildWhatsAppUrl();

  const info = [
    { label: t.booking.noticeLabel, body: t.booking.noticeBody },
    { label: t.booking.cancellationLabel, body: t.booking.cancellationBody },
    { label: t.booking.paymentLabel, body: t.booking.paymentBody },
  ];

  return (
    <Section id={SECTIONS.booking} tone="ink" labelledBy="booking-heading">
      <SectionHeading
        id="booking-heading"
        tone="onInk"
        align="center"
        eyebrow={t.booking.eyebrow}
        title={t.booking.title}
        description={t.booking.description}
      />

      <p className="label-luxe mt-8 text-center text-gold-soft">{t.booking.reassurance}</p>

      <div className="mx-auto mt-14 max-w-3xl">
        <SetmoreBooking />

        <dl className="mt-14 grid gap-10 border-t border-ink-foreground/10 pt-10 sm:grid-cols-3 sm:gap-8">
          {info.map((item) => (
            <div key={item.label}>
              <dt className="label-luxe text-gold-soft">{item.label}</dt>
              <dd className="mt-4 text-sm leading-[1.9] text-ink-foreground/70">{item.body}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 text-center">
          <h3 className="font-serif text-2xl leading-snug text-ink-foreground sm:text-3xl">
            {t.booking.contactTitle}
          </h3>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-[1.9] text-ink-foreground/70">
            {t.booking.contactBody}
          </p>
          <div className="mt-9">
            {whatsappUrl ? (
              <ButtonLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="onInk"
              >
                {t.booking.contactCta}
              </ButtonLink>
            ) : (
              <Button
                variant="onInk"
                onClick={() =>
                  document
                    .getElementById(SECTIONS.contact)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {t.booking.contactCta}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
