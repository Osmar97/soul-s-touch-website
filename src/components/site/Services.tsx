import { BookingCta } from "@/components/site/BookingCta";
import { formatNok } from "@/config/booking";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type Treatment = {
  number: string;
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  options: { duration: string; price: string }[];
  signature?: boolean;
};

/** Curated editorial treatment menu. Prices are always shown in NOK. */
export function Services() {
  const t = useT();

  const split = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const treatments: Treatment[] = [
    {
      number: "01",
      name: t.services.oneName,
      tagline: t.services.oneTagline,
      description: t.services.oneDescription,
      includes: split(t.services.oneIncludes),
      options: [{ duration: "90 min", price: formatNok(550) }],
      signature: true,
    },
    {
      number: "02",
      name: t.services.twoName,
      tagline: t.services.twoTagline,
      description: t.services.twoDescription,
      includes: split(t.services.twoIncludes),
      options: [
        { duration: "30 min", price: formatNok(350) },
        { duration: "45 min", price: formatNok(450) },
      ],
    },
    {
      number: "03",
      name: t.services.threeName,
      tagline: t.services.threeTagline,
      description: t.services.threeDescription,
      includes: split(t.services.threeIncludes),
      options: [{ duration: "30 min", price: formatNok(300) }],
    },
  ];

  const addOns = [
    { name: t.addOns.oneName, price: formatNok(80) },
    { name: t.addOns.twoName, price: formatNok(80) },
    { name: t.addOns.threeName, price: formatNok(80) },
  ];

  return (
    <section
      id={SECTIONS.services}
      aria-labelledby="services-heading"
      className="bg-muted py-24 md:py-32 lg:py-40"
    >
      <div className="container-luxe">
        <div className="max-w-2xl">
          <span className="label-luxe text-gold-deep">{t.services.eyebrow}</span>
          <h2
            id="services-heading"
            className="mt-6 font-serif text-3xl leading-[1.12] text-foreground sm:text-4xl md:text-5xl"
          >
            {t.services.title}
          </h2>
          <span className="rule-gold mt-8 block" aria-hidden="true" />
          <p className="mt-8 text-sm leading-[1.95] text-muted-foreground sm:text-base">
            {t.services.intro}
          </p>
        </div>

        <ul className="mt-16 grid gap-px border-t border-gold/25 md:mt-20 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <li
              key={treatment.number}
              className={cn(
                "flex flex-col border-b border-gold/25 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0",
                treatment.signature && "bg-background/60 lg:px-10",
              )}
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="font-serif text-4xl leading-none text-gold-deep/70 sm:text-5xl">
                  {treatment.number}
                </span>
                {treatment.signature ? (
                  <span className="label-luxe border border-gold/40 px-3 py-1.5 text-gold-deep">
                    {t.services.signature}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-7 font-serif text-2xl leading-snug text-foreground sm:text-[1.75rem]">
                {treatment.name}
              </h3>
              <p className="mt-3 font-serif text-lg italic leading-snug text-muted-foreground">
                {treatment.tagline}
              </p>

              <dl className="mt-8 border-t border-gold/20">
                {treatment.options.map((option) => (
                  <div
                    key={option.duration}
                    className="flex items-baseline justify-between gap-4 border-b border-gold/20 py-3.5"
                  >
                    <dt className="label-luxe text-muted-foreground">{option.duration}</dt>
                    <dd className="font-serif text-xl text-foreground">{option.price}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 text-sm leading-[1.95] text-muted-foreground">
                {treatment.description}
              </p>

              {treatment.includes.length > 0 ? (
                <div className="mt-7">
                  <h4 className="label-luxe text-foreground">{t.services.includesLabel}</h4>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    {treatment.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span aria-hidden="true" className="h-px w-3 bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-auto pt-10">
                <BookingCta
                  variant="outline"
                  label={t.services.book}
                  service={treatment.name}
                  className="w-full sm:w-auto lg:w-full"
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 border-t border-gold/25 pt-10 md:mt-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <h3 className="label-luxe text-foreground">{t.addOns.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t.addOns.intro}
              </p>
            </div>
            <ul className="text-sm">
              {addOns.map((addOn) => (
                <li
                  key={addOn.name}
                  className="flex items-baseline justify-between gap-6 border-b border-gold/15 py-3.5 text-muted-foreground last:border-b-0"
                >
                  <span>{addOn.name}</span>
                  <span className="shrink-0 text-foreground">{addOn.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
