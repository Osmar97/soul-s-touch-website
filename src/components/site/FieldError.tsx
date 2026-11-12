import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Quiet inline field message: icon + text (never colour alone), linked to its
 * field through aria-describedby. `tone="ink"` is for dark sections.
 */
export function FieldError({
  id,
  message,
  tone = "light",
}: {
  id: string;
  message?: string | undefined;
  tone?: "light" | "ink";
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      className={cn(
        "mt-2 flex items-start gap-1.5 text-xs italic leading-relaxed",
        tone === "ink" ? "text-gold-soft" : "text-destructive",
      )}
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 not-italic" />
      <span>{message}</span>
    </p>
  );
}

/** Field classes: gold underline accent when invalid, no red boxes. */
export function invalidClass(invalid: boolean, tone: "light" | "ink" = "light") {
  return invalid ? (tone === "ink" ? "border-gold-soft" : "border-destructive/70") : "";
}
