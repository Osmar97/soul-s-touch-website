import { BOOKING_URL, isBookingConfigured } from "@/config/booking";
import { useT } from "@/i18n";
import { ButtonLink } from "./Button";

/**
 * The single Setmore integration point. Setmore is the booking engine — it
 * owns availability, blocked dates, blocked times and temporary closures.
 * This component never builds availability, slots, calendars or payments;
 * it simply hands the visitor to the configured Setmore booking page inside
 * a branded frame, or shows a calm "coming soon" state until the URL exists.
 */
export function SetmoreBooking() {
  const t = useT();

  return (
    <div className="border border-gold/25 bg-background/5 px-6 py-12 text-center sm:px-12 sm:py-16">
      <p className="mx-auto max-w-md font-serif text-xl leading-relaxed text-ink-foreground sm:text-2xl">
        {t.booking.homeNote}
      </p>

      <span className="rule-gold mx-auto mt-8" aria-hidden="true" />

      <div className="mt-10">
        {isBookingConfigured && BOOKING_URL ? (
          <ButtonLink
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="onInk"
            size="lg"
          >
            {t.booking.cta}
          </ButtonLink>
        ) : (
          <p className="label-luxe text-ink-foreground/60">{t.booking.comingSoon}</p>
        )}
      </div>
    </div>
  );
}
