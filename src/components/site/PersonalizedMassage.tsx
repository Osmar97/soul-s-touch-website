import { PERSONALIZED_MASSAGE } from "@/config/personalized";
import { SECTIONS } from "@/config/site";
import { useReveal } from "@/hooks/use-reveal";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

import { BookingCta } from "./BookingCta";
import { ButtonLink } from "./Button";

/**
 * PERSONALISED MASSAGE — a deliberately separate, rectangular editorial
 * feature block. It is not part of the treatment menu: no invented price,
 * duration or inclusions, just structure, brand imagery and a booking CTA.
 *
 * Commercial details come from `@/config/personalized` and only render once
 * the client has supplied them.
 */
export function PersonalizedMassage() {
  const t = useT();
  const revealRef = useReveal<HTMLElement>();
  const config = PERSONALIZED_MASSAGE;
  const hasDetails = config.details.length > 0;

  return (
    <section
      id={SECTIONS.personalized}
      aria-labelledby="personalized-heading"
      className="bg-ink py-20 text-ink-foreground md:py-28 lg:py-32"
    >
      <div className="container-luxe">
        <div
          ref={revealRef}
          className="reveal grid border border-gold/30 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
        >
          {/* Strong image area */}
          <div className="relative min-h-[62vw] overflow-hidden bg-beige sm:min-h-[46vw] lg:min-h-[32rem]">
            <img
              src={config.image}
              alt={t.personalized.imageAlt}
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                config.imagePosition,
              )}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px bg-gold/40"
            />
          </div>

          {/* Editorial copy */}
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-16 xl:px-16">
            <span className="label-luxe text-gold-soft">{t.personalized.eyebrow}</span>

            <h2
              id="personalized-heading"
              className="mt-6 font-serif text-3xl leading-[1.12] text-ink-foreground sm:text-4xl"
            >
              {t.personalized.title}
            </h2>

            <span className="rule-gold mt-7 block" aria-hidden="true" />

            <p className="mt-7 max-w-lg text-sm leading-[1.95] text-ink-foreground/70">
              {t.personalized.body}
            </p>

            {hasDetails ? (
              <dl className="mt-9 border-t border-ink-foreground/15">
                {config.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-baseline justify-between gap-6 border-b border-ink-foreground/15 py-3.5"
                  >
                    <dt className="label-luxe text-ink-foreground/60">{detail.label}</dt>
                    <dd className="font-serif text-xl text-ink-foreground">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {config.note ? (
              <p className="mt-7 text-sm leading-relaxed text-ink-foreground/60">
                {config.note}
              </p>
            ) : null}

            <div className="mt-10">
              {config.bookingUrl ? (
                <ButtonLink
                  href={config.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="onInk"
                >
                  {t.personalized.cta}
                </ButtonLink>
              ) : (
                <BookingCta variant="onInk" label={t.personalized.cta} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
