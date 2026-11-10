/** Client care guidelines: before, during, boundaries and privacy — plain lists. */
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";

import { SectionHeading } from "./SectionHeading";

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

  const states = [
    { index: "01", title: t.clientExperience.pressureTitle, body: t.clientExperience.pressureBody },
    {
      index: "02",
      title: t.clientExperience.communicateTitle,
      body: t.clientExperience.communicateBody,
    },
    { index: "03", title: t.clientExperience.pauseTitle, body: t.clientExperience.pauseBody },
  ];

  return (
    <section
      id={SECTIONS.clientExperience}
      aria-labelledby="client-experience-heading"
      className="pb-20 md:pb-28 lg:pb-36"
    >
      {/* Scroll track — its height is the storytelling distance. */}
      <div className="pt-20 md:pt-28 lg:pt-36">
        <div>
          <div className="container-luxe grid w-full gap-14 md:grid-cols-[45fr_55fr] md:gap-10 lg:gap-16 xl:gap-24">
            {/* ── LEFT — the editorial anchor, never moves ─────────────── */}
            <div>
              <SectionHeading
                id="client-experience-heading"
                eyebrow={t.clientExperience.eyebrow}
                title={t.clientExperience.title}
                className="max-w-md"
              />

              <div className="mt-10 lg:mt-12">
                <h3 className="font-serif text-xl leading-snug text-foreground sm:text-2xl">
                  {t.clientExperience.beforeTitle}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t.clientExperience.beforeIntro}
                </p>
                <span className="label-luxe mt-6 block text-foreground">
                  {t.clientExperience.beforePlease}
                </span>
                <ul className="mt-4 border-t border-gold/20">
                  {beforeItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-4 border-b border-gold/20 py-3 text-[0.8125rem] leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── RIGHT — the storytelling column ──────────────────────── */}
            <div className="min-w-0">
              <h3 className="font-serif text-xl leading-snug text-foreground sm:text-2xl">
                {t.clientExperience.duringTitle}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {t.clientExperience.duringIntro}
              </p>

              <div className="mt-8 lg:mt-10">
                <ol className="border-t border-gold/20">
                  {states.map((state) => (
                    <li key={state.index} className="border-b border-gold/20 py-7">
                      <div className="flex items-center gap-5">
                        <span className="label-luxe text-gold-deep">{state.index}</span>
                        <span className="h-px flex-1 bg-gold/25" aria-hidden="true" />
                      </div>

                      <div className="mt-5 border-l border-gold/40 pl-5 sm:pl-6">
                        <h4 className="font-serif text-2xl leading-snug text-foreground sm:text-3xl">
                          {state.title}
                        </h4>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                          {state.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Professional boundaries + privacy — normal document flow ──── */}
      <div className="container-luxe mt-16 border-t border-gold/20 pt-16 md:mt-20 md:pt-20">
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
            <h3 className="label-luxe text-foreground">{t.clientExperience.privacyTitle}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t.clientExperience.privacyBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
