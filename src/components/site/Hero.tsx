import { BookingCta } from "@/components/site/BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import soulBg from "@/assets/SoulBG.png";

/**
 * Full-screen cinematic hero — inspired by tranquil luxury wellness and Jannata Resort.
 * Uses SoulBG.png as the high-impact visual centerpiece with intelligent cropping,
 * a 3-stop photographic overlay, dominant editorial serif typography, minimal CTAs,
 * and a seamless cinematic fade into the warm ivory Brand Philosophy section.
 */
export function Hero() {
  const t = useT();

  return (
    <section
      id={SECTIONS.hero}
      aria-label={t.brand.name}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden bg-ink md:h-screen md:min-h-[720px]"
    >
      {/* 1. Cinematic Full-Screen Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={soulBg}
          alt={t.hero.imageAlt}
          width={1536}
          height={1024}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-[72%_center] sm:object-[64%_center] md:object-[58%_center] lg:object-center animate-hero-scale transition-transform"
        />

        {/* 2. Multi-stop photographic gradient overlay */}
        {/* Horizontal balance: 55% left for typography legibility -> 25% center -> 20% right to let the table and warm window glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/20 max-md:from-black/75 max-md:via-black/45 max-md:to-black/30"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.40) 38%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.20) 100%)",
          }}
        />

        {/* Mobile vertical reinforcement scrim: guarantees high contrast on tall narrow viewports */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 md:hidden"
        />
      </div>

      {/* 3. Hero Content — Positioned Left / Center-Left */}
      <div className="container-luxe relative z-10 flex h-full w-full flex-col justify-center pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28">
        <div className="max-w-xl xl:max-w-2xl text-left">
          {/* Eyebrow */}
          <div className="rise-in">
            <span className="label-luxe inline-block text-[0.6875rem] tracking-[0.28em] text-gold-soft sm:text-xs">
              {t.hero.eyebrow}
            </span>
          </div>

          {/* Dominant Editorial Headline (72-96px desktop, 0.98 line-height, tight tracking) */}
          <h1 className="rise-in mt-6 sm:mt-7 font-serif text-[2.75rem] font-light leading-[0.98] tracking-[-0.02em] text-[#FAF8F5] sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] [animation-delay:180ms]">
            <span className="block">{t.hero.titleLineOne}</span>
            <span className="block mt-1 sm:mt-2 text-white/95">{t.hero.titleLineTwo}</span>
            <span className="block mt-1 sm:mt-2 text-white/90">{t.hero.titleLineThree}</span>
          </h1>

          {/* Subtle champagne gold divider rule */}
          <span
            className="rise-in mt-7 sm:mt-8 block h-px w-12 sm:w-16 bg-gold/70 [animation-delay:280ms]"
            aria-hidden="true"
          />

          {/* Supporting Text */}
          <p className="rise-in mt-6 sm:mt-7 max-w-[480px] font-sans text-sm font-light leading-[1.8] text-white/80 sm:text-base sm:leading-[1.85] [animation-delay:380ms]">
            {t.hero.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="rise-in mt-9 sm:mt-11 flex flex-wrap items-center gap-5 sm:gap-7 [animation-delay:500ms]">
            <BookingCta
              label={t.hero.ctaPrimary}
              className="rounded-none border border-gold bg-gold px-7 py-3.5 sm:px-9 sm:py-4 text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink transition-all duration-300 hover:border-gold-soft hover:bg-gold-soft hover:text-ink shadow-sm"
            />

            <a
              href={`#${SECTIONS.homeExperience}`}
              className="label-luxe group relative inline-flex min-h-11 items-center text-white/90 transition-colors duration-300 hover:text-gold-soft"
            >
              <span>{t.hero.ctaSecondary}</span>
              <span
                className="absolute bottom-1.5 left-0 h-px w-full bg-white/40 transition-all duration-300 group-hover:bg-gold"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Cinematic bottom fade: dissolves the hero photography seamlessly into the warm ivory Brand Philosophy section */}
      <div
        aria-hidden="true"
        className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[150px] sm:h-[180px] lg:h-[220px]"
      />

      {/* 5. Minimal Bottom Scroll Indicator — repositioned upward for clear visibility above the fade */}
      <a
        href={`#${SECTIONS.about}`}
        aria-label={t.hero.scroll}
        className="rise-in group absolute bottom-10 sm:bottom-14 md:bottom-16 lg:bottom-20 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2.5 cursor-pointer text-white/70 transition-colors duration-300 hover:text-gold-soft [animation-delay:700ms]"
      >
        <span className="label-luxe text-[0.5625rem] tracking-[0.28em] uppercase transition-colors duration-300 group-hover:text-gold-soft">
          {t.hero.scroll}
        </span>
        <span className="scroll-hint-line" aria-hidden="true" />
      </a>
    </section>
  );
}
