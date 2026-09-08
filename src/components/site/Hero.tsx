import { BookingCta } from "@/components/site/BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import heroImage from "@/assets/hero-massage.jpg";

/** Hero — the only H1 on the site. */
export function Hero() {
  const t = useT();

  return (
    <section className="relative overflow-hidden">
      <div className="container-luxe grid items-center gap-14 pt-32 pb-20 lg:min-h-screen lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pt-28 lg:pb-24">
        <div className="rise-in max-w-xl">
          <span className="label-luxe text-gold-deep">{t.hero.eyebrow}</span>

          <h1 className="mt-8 font-serif text-[2.6rem] leading-[1.05] text-foreground sm:text-6xl lg:text-[4.25rem]">
            <span className="block">{t.hero.titleLineOne}</span>
            <span className="mt-2 block text-muted-foreground">{t.hero.titleLineTwo}</span>
          </h1>

          <span className="rule-gold mt-10" aria-hidden="true" />

          <p className="mt-8 max-w-md text-sm leading-[1.9] text-muted-foreground sm:text-base">
            {t.hero.subtitle}
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <BookingCta variant="solid" size="lg" />
            <a
              href={`#${SECTIONS.about}`}
              className="label-luxe inline-flex min-h-11 items-center border-b border-gold/40 text-foreground transition-colors duration-300 hover:border-gold hover:text-gold-deep"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="rise-in relative mt-4 lg:mt-0 lg:h-[80vh]">
          <img
            src={heroImage}
            alt={t.hero.imageAlt}
            width={1024}
            height={1408}
            fetchPriority="high"
            className="h-[46vh] w-full object-cover sm:h-[58vh] lg:h-full"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-gold/15"
          />
        </div>
      </div>

      <div className="container-luxe hidden pb-12 lg:block">
        <div className="flex items-center gap-4">
          <span className="scroll-hint-line" aria-hidden="true" />
          <span className="label-luxe text-muted-foreground">{t.hero.scroll}</span>
        </div>
      </div>
    </section>
  );
}
