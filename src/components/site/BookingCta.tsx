import { BOOKING_URL, isBookingConfigured } from "@/config/booking";
import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import { Button, ButtonLink, siteButtonVariants } from "./Button";
import type { VariantProps } from "class-variance-authority";

type Variants = VariantProps<typeof siteButtonVariants>;

/**
 * The single booking entry point. When VITE_SETMORE_URL is configured it opens
 * the Setmore page; otherwise it scrolls to the booking section. No fake
 * booking flow is ever rendered.
 */
export function BookingCta({
  variant = "outline",
  size = "md",
  className,
  label,
  onNavigate,
}: Variants & { className?: string; label?: string; onNavigate?: () => void }) {
  const t = useT();
  const text = label ?? t.common.bookNow;

  if (isBookingConfigured && BOOKING_URL) {
    return (
      <ButtonLink
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        size={size}
        className={className}
        onClick={onNavigate}
      >
        {text}
      </ButtonLink>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        onNavigate?.();
        document
          .getElementById(SECTIONS.booking)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {text}
    </Button>
  );
}
