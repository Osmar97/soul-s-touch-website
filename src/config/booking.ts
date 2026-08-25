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
