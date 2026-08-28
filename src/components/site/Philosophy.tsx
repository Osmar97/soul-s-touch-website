import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

/** Brand philosophy — editorial, brand-first, no biography. */
export function Philosophy() {
  const t = useT();

  return (
    <section
      id={SECTIONS.about}
      aria-labelledby="about-heading"
      className="py-24 md:py-32 lg:py-40"
    >
      <div className="container-luxe grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
        <div>
          <span className="label-luxe text-gold-deep">{t.philosophy.eyebrow}</span>
          <h2
            id="about-heading"
            className="mt-6 max-w-md font-serif text-3xl leading-[1.12] text-foreground sm:text-4xl md:text-5xl"
          >
            {t.philosophy.title}
          </h2>
          <span className="rule-gold mt-8 block" aria-hidden="true" />
        </div>

        <div className="max-w-xl">
          <blockquote className="font-serif text-2xl leading-[1.45] text-foreground sm:text-3xl">
            {t.philosophy.quote}
          </blockquote>
          <div className="mt-10 space-y-6 text-sm leading-[1.95] text-muted-foreground sm:text-base">
            <p>{t.philosophy.bodyOne}</p>
            <p>{t.philosophy.bodyTwo}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
