import { buildBookingUrl, isBookingConfigured } from "@/config/booking";
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
  service,
  onNavigate,
}: Variants & {
  className?: string;
  label?: string;
  /** Optional service name to preselect on the Setmore booking page. */
  service?: string;
  onNavigate?: () => void;
}) {
  const t = useT();
  const text = label ?? t.common.bookNow;
  const href = buildBookingUrl(service);

  if (isBookingConfigured && href) {
    return (
      <ButtonLink
        href={href}
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
