import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const siteButtonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-none border text-[0.6875rem] uppercase tracking-[0.24em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "border-primary bg-primary text-primary-foreground hover:bg-ink",
        outline: "border-gold/60 bg-transparent text-foreground hover:border-gold hover:bg-gold/10",
        ghost: "border-transparent bg-transparent text-foreground hover:text-gold-deep",
        onInk:
          "border-gold/50 bg-transparent text-ink-foreground hover:border-gold hover:bg-gold/15",
      },
      size: {
        sm: "px-5 py-2.5",
        md: "px-7 py-3.5",
        lg: "px-9 py-4",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

type Variants = VariantProps<typeof siteButtonVariants>;

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & Variants) {
  return (
    <button
      type="button"
      className={cn(siteButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & Variants) {
  return <a className={cn(siteButtonVariants({ variant, size }), className)} {...props} />;
}
