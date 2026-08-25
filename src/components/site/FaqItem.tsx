import { useId, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Accessible disclosure — no dependency, keyboard operable, announced state.
 */
export function FaqItem({
  question,
  answer,
  defaultOpen = false,
  className,
}: {
  question: string;
  answer: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = `${panelId}-button`;

  return (
    <div className={cn("border-b border-border", className)}>
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-serif text-lg leading-snug text-foreground sm:text-xl">
            {question}
          </span>
          <span
            aria-hidden="true"
            className="relative mt-1 h-3 w-3 shrink-0 text-gold-deep"
          >
            <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
            <span
              className={cn(
                "absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300",
                open && "scale-y-0",
              )}
            />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <div className="pb-7 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {answer}
        </div>
      </div>
    </div>
  );
}
