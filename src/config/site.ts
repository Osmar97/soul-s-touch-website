/**
 * Single source of truth for brand + local business details.
 * Update here — never hardcode these values in components.
 */
export const SITE = {
  name: "Soul's Touch",
  fullName: "Soul's Touch by Dani",
  city: "Lisbon",
  region: "Lisboa",
  country: "PT",
  serviceArea: "Lisbon and surrounding areas",
  email: "",
  phone: "",
  instagram: "",
  whatsapp: "",
} as const;

/** In-page section anchors — used by nav, footer and the page shell. */
export const SECTIONS = {
  about: "about",
  homeExperience: "home-experience",
  services: "services",
  howItWorks: "how-it-works",
  reviews: "reviews",
  faq: "faq",
  booking: "booking",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];
