import { useState, useId } from "react";

import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { SECTIONS } from "@/config/site";

export function Faq() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  const items = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
    { q: t.faq.q7, a: t.faq.a7 },
    { q: t.faq.q8, a: t.faq.a8 },
    { q: t.faq.q9, a: t.faq.a9 },
    { q: t.faq.q10, a: t.faq.a10 },
    { q: t.faq.q11, a: t.faq.a11 },
    { q: t.faq.q12, a: t.faq.a12 },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <Section id={SECTIONS.faq} labelledBy="faq-heading">
      <SectionHeading
        id="faq-heading"
        eyebrow={t.faq.eyebrow}
        title={t.faq.title}
        description={t.faq.description}
      />

      <div className="mt-14 max-w-3xl">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const questionId = `${baseId}-q-${index}`;
          const answerId = `${baseId}-a-${index}`;

          return (
            <div
              key={questionId}
              className="border-b border-hairline first:border-t"
            >
              <h3 className="font-sans text-base font-normal">
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => handleToggle(index)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                    "hover:text-gold-deep"
                  )}
                >
                  <span
                    className={cn(
                      "pr-2 text-sm leading-snug tracking-wide transition-colors sm:text-base",
                      isOpen ? "text-foreground" : "text-foreground/90"
                    )}
                  >
                    {item.q}
                  </span>
                  <span
                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center text-gold"
                    aria-hidden="true"
                  >
                    <span className="absolute h-px w-3 bg-current transition-transform duration-300" />
                    <span
                      className={cn(
                        "absolute h-3 w-px bg-current transition-transform duration-300",
                        isOpen && "rotate-90 scale-0"
                      )}
                    />
                  </span>
                </button>
              </h3>
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 pt-1 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
