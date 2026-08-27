export const en = {
  meta: {
    title: "Soul's Touch by Dani — Home Massage in Lisbon",
    description:
      "Soul's Touch by Dani is a mobile massage service in Lisbon. Dani comes to your home with table, linens, towels and oils — everything for a calm, professional treatment.",
  },
  nav: {
    home: "Home",
    experience: "Experience",
    about: "About",
    services: "Services",
    howItWorks: "How it works",
    reviews: "Reviews",
    faq: "FAQ",
    contact: "Contact",
    book: "Book",
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
    titleLineOne: "Slow down.",
    titleLineTwo: "Come back to yourself.",
    title: "Slow down. Come back to yourself.",
    subtitle:
      "Massage designed to help you reconnect with your body, quiet your mind and simply take a moment for yourself.",
    ctaSecondary: "Explore the experience",
    scroll: "Scroll to explore",
    imageAlt: "A candlelit room prepared with a linen-draped massage table, folded towels and oil",
  },
  common: {
    readMore: "Read more",
    bookNow: "Book your moment",
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
};

/** Widened shape so translations only need matching keys, not identical strings. */
export type Dictionary = {
  [Group in keyof typeof en]: { [Key in keyof (typeof en)[Group]]: string };
};
