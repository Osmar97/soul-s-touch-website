import { useT } from "@/i18n";

/** Full-bleed ink statement — the visual pause between sections. */
export function BrandStatement() {
  const t = useT();

  return (
    <section
      aria-labelledby="statement-heading"
      className="bg-ink py-28 text-ink-foreground md:py-36 lg:py-44"
    >
      <div className="container-luxe">
        <span className="rule-gold block" aria-hidden="true" />
        <h2
          id="statement-heading"
          className="mt-12 max-w-4xl font-serif text-[2.1rem] leading-[1.15] text-ink-foreground sm:text-5xl lg:text-6xl"
        >
          <span className="block">{t.statement.lineOne}</span>
          <span className="mt-3 block text-ink-foreground/55">{t.statement.lineTwo}</span>
        </h2>
        <p className="label-luxe mt-14 text-gold-soft">{t.statement.support}</p>
      </div>
    </section>
  );
}
