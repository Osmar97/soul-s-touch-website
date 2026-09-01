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
  philosophy: {
    eyebrow: "Brand philosophy",
    title: "The soul behind Soul's Touch",
    quote:
      "A name that could hold peace, relaxation, connection and emotional well-being.",
    bodyOne:
      "Massage is not simply a luxury. It is a form of self-care, and a way of reconnecting with ourselves.",
    bodyTwo:
      "Soul's Touch exists to give people a moment to slow down, breathe and feel cared for.",
  },
  statement: {
    lineOne: "A moment to slow down.",
    lineTwo: "A moment to reconnect.",
    support: "Your body deserves a moment of stillness.",
  },
  homeExperience: {
    eyebrow: "Home massage",
    titleLineOne: "Your space.",
    titleLineTwo: "Your moment.",
    body: "Soul's Touch brings the massage experience to you. Enjoy your treatment in the comfort and privacy of your own home, with no need to travel before or after your session.",
    includesTitle: "The experience includes",
    itemTable: "Massage table",
    itemLinens: "Clean linens",
    itemTowel: "Fresh towel",
    itemOils: "Massage oils",
    itemSetup: "Complete setup and pack-away",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "Four quiet steps",
    stepOneTitle: "Book your moment",
    stepOneBody: "Choose your treatment and a suitable appointment time.",
    stepTwoTitle: "Prepare your space",
    stepTwoBody: "Create a comfortable, quiet space at home.",
    stepThreeTitle: "We bring everything",
    stepThreeBody: "Your massage table, clean linens, towel and massage oils are provided.",
    stepFourTitle: "Disconnect",
    stepFourBody: "Take a moment to slow down, breathe and reconnect with yourself.",
  },
  services: {
    eyebrow: "The treatments",
    title: "The treatments",
    intro: "A carefully curated selection of relaxation-focused treatments, designed to give your body and mind the time they deserve.",
    signature: "Signature experience",
    includesLabel: "Includes",
    book: "Book this treatment",
    oneName: "Full body relaxation",
    oneTagline: "The complete Soul's Touch experience.",
    oneDescription: "Slow-paced massage allowing your body and mind to fully relax.",
    oneIncludes: "Back, Shoulders, Neck, Head, Arms, Hands, Legs, Feet",
    twoName: "Back massage",
    twoTagline: "Release tension. Restore balance.",
    twoDescription: "Release tension. Restore balance.",
    twoIncludes: "Back, Shoulders, Neck",
    threeName: "Foot massage",
    threeTagline: "Ground yourself. Reconnect with your body.",
    threeDescription: "Ground yourself. Reconnect with your body.",
    threeIncludes: "",
  },
  addOns: {
    title: "Make it your own",
    intro: "Optional additions to your treatment.",
    oneName: "+10 min head & scalp massage",
    twoName: "+10 min foot massage",
    threeName: "+10 min neck & shoulders",
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
