import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Section shell: semantic landmark, generous negative space, optional ink tone.
 */
export function Section({
  id,
  tone = "default",
  className,
  children,
  labelledBy,
}: {
  id: string;
  tone?: "default" | "ink" | "muted";
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-20 md:py-28 lg:py-36",
        tone === "ink" && "bg-ink text-ink-foreground",
        tone === "muted" && "bg-muted",
        className,
      )}
    >
      <div className="container-luxe">{children}</div>
    </section>
  );
}
