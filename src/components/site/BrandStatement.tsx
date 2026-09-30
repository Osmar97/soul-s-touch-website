import heroMassage from "@/assets/hero-massage.jpg";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

/**
 * "Take your moment" — the editorial split that breaks up the page rhythm.
 *
 * Light photography on the left, calm copy on the right, so the section
 * contrasts with the darker hero and the ink bands around it. Stacks
 * image-then-text on mobile.
 */
export function BrandStatement() {
  const t = useT();

  return (
    <section
      id={SECTIONS.statement}
      aria-labelledby="statement-heading"
      className="bg-background"
    >
      <div className="grid lg:grid-cols-[52fr_48fr]">
        {/* Light-toned photography — cropped to the linen so it reads bright */}
        <div className="relative order-1 min-h-[78vw] overflow-hidden bg-beige sm:min-h-[56vw] lg:min-h-[40rem] xl:min-h-[44rem]">
          <img
            src={heroMassage}
            alt={t.statement.imageAlt}
            width={1024}
            height={1408}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_74%] brightness-[1.08] saturate-[0.95]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-gold/40"
          />
        </div>

        {/* Copy */}
        <div className="order-2 flex items-center px-6 py-20 sm:px-10 sm:py-24 lg:px-14 lg:py-28 xl:px-20">
          <div className="max-w-xl">
            <span className="label-luxe text-gold-deep">{t.statement.eyebrow}</span>

            <h2
              id="statement-heading"
              className="mt-7 font-serif text-[2rem] leading-[1.15] text-foreground sm:text-4xl lg:text-[2.75rem] xl:text-5xl"
            >
              <span className="block">{t.statement.lineOne}</span>
              <span className="mt-3 block text-muted-foreground">{t.statement.lineTwo}</span>
            </h2>

            <span className="rule-gold mt-8 block" aria-hidden="true" />

            <p className="mt-8 max-w-md text-sm leading-[1.95] text-muted-foreground sm:text-base">
              {t.statement.support}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
