import soulBg from "@/assets/SoulBG.png";

/**
 * PERSONALISED MASSAGE — feature block configuration.
 *
 * The client has not supplied the commercial details for this treatment yet,
 * so nothing here is invented. Price, duration, inclusions and any gift-voucher
 * terms are intentionally empty: fill them in once the client confirms them
 * and the section will render them automatically.
 *
 * All visible wording lives in the dictionaries under `personalized`
 * (en / pt / es) so it can be replaced with the approved client copy.
 */
export const PERSONALIZED_MASSAGE = {
  /**
   * Dedicated Setmore booking URL for this treatment.
   * Leave null until a dedicated Setmore service exists — the CTA then falls
   * back to the site-wide booking section. Never invent a service id.
   */
  bookingUrl: null as string | null,

  /** Editorial image for the feature block. */
  image: soulBg,

  /** Tailwind object-position class — static so it survives the CSS scan. */
  imagePosition: "object-[78%_50%]",

  /**
   * Commercial details. Leave empty until supplied.
   * Example: [{ label: "Duration", value: "60 min" }]
   * If a label needs translating, add it to the dictionaries too.
   */
  details: [] as { label: string; value: string }[],

  /**
   * Optional supporting note (for example voucher terms). Empty → not rendered.
   */
  note: "",
} as const;
