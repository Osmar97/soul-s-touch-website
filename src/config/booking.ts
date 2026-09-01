/**
 * Booking integration point.
 *
 * Bookings are handled by Setmore. Set VITE_SETMORE_URL in the environment to
 * the public Setmore booking page (or embeddable booking URL). Until it is set,
 * `isBookingConfigured` is false and CTAs must fall back to contact copy —
 * never simulate a booking flow.
 */
const rawBookingUrl = (import.meta.env["VITE_SETMORE_URL"] as string | undefined)?.trim();

export const BOOKING_URL: string | null = rawBookingUrl ? rawBookingUrl : null;

export const isBookingConfigured = BOOKING_URL !== null;

/** Consistent NOK price formatting across the site. */
export function formatNok(amount: number): string {
  return `${amount} NOK`;
}

/**
 * Setmore booking URL, optionally preselecting a service when the configured
 * booking page supports a service parameter. No custom booking flow is built.
 */
export function buildBookingUrl(service?: string): string | null {
  if (!BOOKING_URL) return null;
  if (!service) return BOOKING_URL;
  try {
    const url = new URL(BOOKING_URL);
    url.searchParams.set("service", service);
    return url.toString();
  } catch {
    return BOOKING_URL;
  }
}
