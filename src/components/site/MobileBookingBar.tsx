import { useEffect, useState } from "react";

import { BookingCta } from "./BookingCta";
import { cn } from "@/lib/utils";

/**
 * Discreet persistent booking CTA for small screens. Hidden over the hero so
 * the first screen stays calm; fades in once the visitor starts reading.
 */
export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);
  const [typing, setTyping] = useState(false);

  // Hide while a form field is focused so the bar never covers inputs,
  // inline errors or the submit button (mobile keyboards shrink the view).
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select");
    const onIn = (e: FocusEvent) => setTyping(isField(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-background/90 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-all duration-500 lg:hidden",
        visible && !typing ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <BookingCta size="sm" className="w-full" />
    </div>
  );
}
