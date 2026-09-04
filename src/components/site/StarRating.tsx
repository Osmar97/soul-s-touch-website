import { cn } from "@/lib/utils";

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5", className)}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M12 3.2l2.6 5.5 5.9.8-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6L3.5 9.5l5.9-.8z" />
    </svg>
  );
}

export function StarRating({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-gold-deep", className)}
      aria-label={`${rounded} ${label}`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= rounded} />
      ))}
    </span>
  );
}
