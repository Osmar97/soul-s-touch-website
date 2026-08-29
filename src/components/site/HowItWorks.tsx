import { BookingCta } from "@/components/site/BookingCta";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

/** Four-step process on ink, numbered and minimal. */
export function HowItWorks() {
  const t = useT();

  const steps = [
    { n: "01", title: t.howItWorks.stepOneTitle, body: t.howItWorks.stepOneBody },
    { n: "02", title: t.howItWorks.stepTwoTitle, body: t.howItWorks.stepTwoBody },
    { n: "03", title: t.howItWorks.stepThreeTitle, body: t.howItWorks.stepThreeBody },
    { n: "04", title: t.howItWorks.stepFourTitle, body: t.howItWorks.stepFourBody },
  ];

  return (
    <section
      id={SECTIONS.howItWorks}
      aria-labelledby="how-heading"
      className="bg-ink py-24 text-ink-foreground md:py-32 lg:py-40"
    >
      <div className="container-luxe">
        <span className="label-luxe text-gold-soft">{t.howItWorks.eyebrow}</span>
        <h2
          id="how-heading"
          className="mt-6 max-w-xl font-serif text-3xl leading-[1.12] text-ink-foreground sm:text-4xl md:text-5xl"
        >
          {t.howItWorks.title}
        </h2>
        <span className="rule-gold mt-8 block" aria-hidden="true" />

        <ol className="mt-16 grid gap-px border-t border-ink-foreground/15 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="border-b border-ink-foreground/15 py-10 md:border-b-0 md:pr-10 lg:py-12"
            >
              <span className="label-luxe text-gold-soft">{step.n}</span>
              <h3 className="mt-6 font-serif text-2xl leading-snug text-ink-foreground">
                {step.title}
              </h3>
              <p className="mt-4 max-w-xs text-sm leading-[1.9] text-ink-foreground/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <BookingCta variant="onInk" />
        </div>
      </div>
    </section>
  );
}
