import { cn } from "@/lib/utils";

export function ReviewCard({
  quote,
  author,
  rating,
  date,
  tone = "default",
  className,
}: {
  quote: string;
  author: string;
  rating?: number;
  date?: string;
  tone?: "default" | "onInk";
  className?: string;
}) {
  const onInk = tone === "onInk";

  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between border-t pt-8",
        onInk ? "border-ink-foreground/15" : "border-border",
        className,
      )}
    >
      {typeof rating === "number" ? (
        <p
          className="label-luxe mb-5 text-gold-deep"
          aria-label={`${rating} out of 5`}
          title={`${rating} / 5`}
        >
          <span aria-hidden="true">
            {"\u2022 ".repeat(Math.max(0, Math.min(5, Math.round(rating)))).trim()}
          </span>
        </p>
      ) : null}

      <blockquote
        className={cn(
          "font-serif text-xl leading-relaxed",
          onInk ? "text-ink-foreground" : "text-foreground",
        )}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      <figcaption
        className={cn(
          "label-luxe mt-7",
          onInk ? "text-ink-foreground/50" : "text-muted-foreground",
        )}
      >
        {author}
        {date ? <span className="ml-3 opacity-60">{date}</span> : null}
      </figcaption>
    </figure>
  );
}
