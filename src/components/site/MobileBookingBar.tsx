import { useEffect, useState } from "react";

import { BookingCta } from "./BookingCta";
import { cn } from "@/lib/utils";

/**
 * Discreet persistent booking CTA for small screens. Hidden over the hero so
 * the first screen stays calm; fades in once the visitor starts reading.
 */
export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-background/90 px-5 py-3 backdrop-blur-md transition-all duration-500 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <BookingCta size="sm" className="w-full" />
    </div>
  );
}
