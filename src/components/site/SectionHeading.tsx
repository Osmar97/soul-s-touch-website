import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  as: Tag = "h2",
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "onInk";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const onInk = tone === "onInk";

  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className={cn("label-luxe mb-5", onInk ? "text-gold-soft" : "text-gold-deep")}>
          {eyebrow}
        </span>
      ) : null}
      <Tag
        id={id}
        className={cn(
          "font-serif text-3xl leading-[1.12] sm:text-4xl md:text-5xl",
          onInk ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </Tag>
      <span className={cn("rule-gold mt-7", align === "center" && "mx-auto")} aria-hidden="true" />
      {description ? (
        <p
          className={cn(
            "mt-7 text-sm leading-relaxed sm:text-base",
            onInk ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
