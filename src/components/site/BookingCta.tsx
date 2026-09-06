import { SECTIONS } from "@/config/site";
import { useT } from "@/i18n";
import { Button, siteButtonVariants } from "./Button";
import type { VariantProps } from "class-variance-authority";

type Variants = VariantProps<typeof siteButtonVariants>;

/**
 * The single booking entry point used across the site. Every booking CTA
 * scrolls to the on-page booking section, where the Setmore integration
 * lives. No fake booking flow is ever rendered.
 */
export function BookingCta({
  variant = "outline",
  size = "md",
  className,
  label,
  onNavigate,
}: Variants & {
  className?: string;
  label?: string;
  onNavigate?: () => void;
}) {
  const t = useT();

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
      {label ?? t.common.bookNow}
    </Button>
  );
}
