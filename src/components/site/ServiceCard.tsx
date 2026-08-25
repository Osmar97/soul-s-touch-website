import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ServiceCard({
  name,
  duration,
  price,
  description,
  tone = "default",
  className,
  children,
}: {
  name: string;
  duration?: string;
  price?: string;
  description?: ReactNode;
  tone?: "default" | "onInk";
  className?: string;
  children?: ReactNode;
}) {
  const onInk = tone === "onInk";

  return (
    <article
      className={cn(
        "flex h-full flex-col border-t pt-8",
        onInk ? "border-ink-foreground/15" : "border-border",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3
          className={cn(
            "font-serif text-2xl leading-snug",
            onInk ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {name}
        </h3>
        {price ? <span className="label-luxe shrink-0 text-gold-deep">{price}</span> : null}
      </div>

      {duration ? (
        <span
          className={cn(
            "label-luxe mt-3",
            onInk ? "text-ink-foreground/50" : "text-muted-foreground",
          )}
        >
          {duration}
        </span>
      ) : null}

      {description ? (
        <p
          className={cn(
            "mt-5 text-sm leading-relaxed",
            onInk ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-6">{children}</div> : null}
    </article>
  );
}
