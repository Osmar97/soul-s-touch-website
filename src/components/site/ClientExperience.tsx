import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

/**
 * Client care guidelines: before, during, boundaries and privacy.
 * Designed to feel calm and reassuring rather than like legal terms.
 */
export function ClientExperience() {
  const t = useT();

  const beforeItems = [
    t.clientExperience.beforeItem1,
    t.clientExperience.beforeItem2,
    t.clientExperience.beforeItem3,
    t.clientExperience.beforeItem4,
    t.clientExperience.beforeItem5,
    t.clientExperience.beforeItem6,
    t.clientExperience.beforeItem7,
  ];

  const highlights = [
    {
      title: t.clientExperience.pressureTitle,
      body: t.clientExperience.pressureBody,
    },
    {
      title: t.clientExperience.communicateTitle,
      body: t.clientExperience.communicateBody,
    },
    {
      title: t.clientExperience.pauseTitle,
      body: t.clientExperience.pauseBody,
    },
  ];

  return (
    <section
      id={SECTIONS.clientExperience}
      aria-labelledby="client-experience-heading"
      className="py-24 md:py-32 lg:py-40"
    >
      <div className="container-luxe">
        <SectionHeading
          id="client-experience-heading"
          eyebrow={t.clientExperience.eyebrow}
          title={t.clientExperience.title}
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Before your massage */}
          <div>
            <h3 className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              {t.clientExperience.beforeTitle}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.clientExperience.beforeIntro}
            </p>
            <span className="label-luxe mt-8 block text-foreground">
              {t.clientExperience.beforePlease}
            </span>
            <ul className="mt-5 border-t border-gold/20">
              {beforeItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-b border-gold/20 py-4 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-4 shrink-0 bg-gold"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* During your massage */}
          <div>
            <h3 className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
              {t.clientExperience.duringTitle}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.clientExperience.duringIntro}
            </p>
            <dl className="mt-8 grid gap-6">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="border-l border-gold/40 pl-5"
                >
                  <dt className="label-luxe text-foreground">
                    {highlight.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {highlight.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Professional boundaries + privacy */}
        <div className="mt-20 border-t border-gold/20 pt-16 md:mt-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <h3 className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
                {t.clientExperience.boundariesTitle}
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-[1.95] text-muted-foreground">
                {t.clientExperience.boundariesBody}
              </p>
            </div>

            <div className="bg-muted/50 px-6 py-8 md:px-8">
              <h4 className="label-luxe text-foreground">
                {t.clientExperience.privacyTitle}
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t.clientExperience.privacyBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
