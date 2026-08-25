export const en = {
  meta: {
    title: "Soul's Touch by Dani — Home Massage in Lisbon",
    description:
      "Soul's Touch by Dani is a mobile massage service in Lisbon. Dani comes to your home with table, linens, towels and oils — everything for a calm, professional treatment.",
  },
  nav: {
    about: "About",
    services: "Services",
    howItWorks: "How it works",
    reviews: "Reviews",
    faq: "FAQ",
    contact: "Contact",
    book: "Book a session",
    menu: "Menu",
    close: "Close menu",
    open: "Open menu",
    skipToContent: "Skip to content",
  },
  brand: {
    name: "Soul's Touch",
    by: "by Dani",
    tagline: "Home massage in Lisbon",
  },
  hero: {
    eyebrow: "Mobile massage · Lisbon",
    title: "Massage, brought to your home",
    subtitle:
      "Dani travels to you with the massage table, fresh linens, towels and oils. You simply choose the room.",
  },
  common: {
    readMore: "Read more",
    bookNow: "Book a session",
    language: "Language",
    loading: "Loading",
    error: "Something went wrong. Please try again.",
  },
  booking: {
    eyebrow: "Reservations",
    title: "Reserve your session",
    description:
      "Choose a time that suits you. Bookings are confirmed directly with Dani.",
    cta: "Book a session",
    unavailable: "Booking opens soon — please get in touch to reserve a time.",
  },
  reviews: {
    eyebrow: "Words from clients",
    title: "Reviews",
    empty: "The first reviews will appear here soon.",
    submitted: "Thank you — your review has been sent for review.",
  },
  footer: {
    rights: "All rights reserved.",
    serviceArea: "Serving Lisbon and surrounding areas",
  },
} as const;

export type Dictionary = typeof en;
