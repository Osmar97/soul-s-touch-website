import { cn } from "@/lib/utils";

/**
 * Brand lockup. A client logo file will replace the typographic mark:
 * import logo from "@/assets/souls-touch.svg" and swap the inner markup —
 * the surrounding layout does not change.
 *
 * `size="lg"` gives the header a more confident, hospitality-scale presence.
 */
export function Wordmark({
  className,
  tone = "default",
  size = "md",
  as: Tag = "span",
}: {
  className?: string;
  tone?: "default" | "onInk";
  size?: "md" | "lg";
  as?: "span" | "div";
}) {
  const large = size === "lg";

  return (
    <Tag
      className={cn(
        "inline-flex flex-col items-center leading-none",
        tone === "onInk" ? "text-ink-foreground" : "text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "font-serif uppercase",
          large
            ? "text-[1.05rem] tracking-[0.2em] xl:text-[1.2rem] xl:tracking-[0.22em]"
            : "text-[1.05rem] tracking-[0.28em] sm:text-[1.15rem]",
        )}
      >
        Soul&rsquo;s Touch
      </span>
      <span
        className={cn(
          "label-luxe mt-1.5",
          large ? "text-[0.5rem] xl:text-[0.5625rem]" : "text-[0.55rem]",
          tone === "onInk" ? "text-gold-soft" : "text-gold-deep",
        )}
      >
        by Dani
      </span>
    </Tag>
  );
}
