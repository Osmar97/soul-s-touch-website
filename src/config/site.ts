/**
 * Single source of truth for brand + local business details.
 * Update here — never hardcode these values in components.
 */
const phone = "+351 962 848 629";
const configuredWhatsApp = (import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined)?.trim();
const configuredEmail = (import.meta.env["VITE_CONTACT_EMAIL"] as string | undefined)?.trim();
const configuredInstagram = (import.meta.env["VITE_INSTAGRAM_URL"] as string | undefined)?.trim();

export const SITE = {
  name: "Soul's Touch",
  fullName: "Soul's Touch by Dani",
  city: "Lisbon",
  region: "Lisboa",
  country: "PT",
  serviceArea: "Lisbon and surrounding areas",
  email: configuredEmail ?? "",
  phone,
  instagram: configuredInstagram ?? "",
  whatsapp: configuredWhatsApp ?? phone,
} as const;

/** In-page section anchors — used by nav, footer and the page shell. */
export const SECTIONS = {
  about: "about",
  homeExperience: "home-experience",
  services: "services",
  howItWorks: "how-it-works",
  clientExperience: "client-experience",
  reviews: "reviews",
  faq: "faq",
  booking: "booking",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];
