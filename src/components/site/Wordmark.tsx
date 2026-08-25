import { cn } from "@/lib/utils";

/**
 * Brand lockup. A client logo file will replace the typographic mark:
 * import logo from "@/assets/souls-touch.svg" and swap the inner markup —
 * the surrounding layout does not change.
 */
export function Wordmark({
  className,
  tone = "default",
  as: Tag = "span",
}: {
  className?: string;
  tone?: "default" | "onInk";
  as?: "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "inline-flex flex-col items-center leading-none",
        tone === "onInk" ? "text-ink-foreground" : "text-foreground",
        className,
      )}
    >
      <span className="font-serif text-[1.05rem] tracking-[0.28em] uppercase sm:text-[1.15rem]">
        Soul&rsquo;s Touch
      </span>
      <span className="label-luxe mt-1.5 text-[0.55rem] text-gold-deep">by Dani</span>
    </Tag>
  );
}
