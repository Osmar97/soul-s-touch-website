import { SITE } from "@/config/site";

/**
 * Booking integration point.
 *
 * Bookings are handled entirely by Setmore — availability, blocking dates,
 * blocking times, closing periods and pausing online bookings are all managed
 * in Setmore, never on this website. Set VITE_SETMORE_BOOKING_URL (preferred)
 * or VITE_SETMORE_URL to the public Setmore booking page. Until it is set,
 * `isBookingConfigured` is false and the booking section shows a calm
 * "coming soon" state — never a broken embed or a simulated booking flow.
 */
const rawBookingUrl = (
  (import.meta.env["VITE_SETMORE_BOOKING_URL"] as string | undefined) ??
  (import.meta.env["VITE_SETMORE_URL"] as string | undefined)
)?.trim();

export const BOOKING_URL: string | null = rawBookingUrl ? rawBookingUrl : null;

export const isBookingConfigured = BOOKING_URL !== null;

/** Consistent NOK price formatting across the site. */
export function formatNok(amount: number): string {
  return `${amount} NOK`;
}

/**
 * WhatsApp deep link for the "can't find a time" contact option. Returns null
 * until SITE.whatsapp holds a real number (international format, digits only
 * or with a leading + — punctuation is stripped).
 */
export function buildWhatsAppUrl(message?: string): string | null {
  const digits = SITE.whatsapp.replace(/[^\d]/g, "");
  if (!digits) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const isWhatsAppConfigured = SITE.whatsapp.replace(/[^\d]/g, "") !== "";
