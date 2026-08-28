import { BookingCta } from "@/components/site/BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

/** Mobile/home massage explanation with the elegant "includes" list. */
export function HomeExperience() {
  const t = useT();

  const includes = [
    t.homeExperience.itemTable,
    t.homeExperience.itemLinens,
    t.homeExperience.itemTowel,
    t.homeExperience.itemOils,
    t.homeExperience.itemSetup,
  ];

  return (
    <section
      id={SECTIONS.homeExperience}
      aria-labelledby="home-experience-heading"
      className="py-24 md:py-32 lg:py-40"
    >
      <div className="container-luxe grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-24">
        <div className="max-w-xl">
          <span className="label-luxe text-gold-deep">{t.homeExperience.eyebrow}</span>
          <h2
            id="home-experience-heading"
            className="mt-6 font-serif text-3xl leading-[1.12] text-foreground sm:text-4xl md:text-5xl"
          >
            <span className="block">{t.homeExperience.titleLineOne}</span>
            <span className="mt-2 block text-muted-foreground">
              {t.homeExperience.titleLineTwo}
            </span>
          </h2>
          <span className="rule-gold mt-8 block" aria-hidden="true" />
          <p className="mt-8 text-sm leading-[1.95] text-muted-foreground sm:text-base">
            {t.homeExperience.body}
          </p>
          <div className="mt-10">
            <BookingCta variant="outline" />
          </div>
        </div>

        <div>
          <h3 className="label-luxe text-foreground">{t.homeExperience.includesTitle}</h3>
          <ul className="mt-8 border-t border-gold/20">
            {includes.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-5 border-b border-gold/20 py-5 font-serif text-xl text-foreground sm:text-2xl"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-6 shrink-0 bg-gold sm:w-8"
                />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
