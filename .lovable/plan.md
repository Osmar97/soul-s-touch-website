# Soul's Touch by Dani — Foundation Phase

Establish the architecture, design system, translation layer, and reusable components for a premium one-page mobile-massage site serving Lisbon. No section content is built yet — this phase creates the shell and the building blocks.

## What gets built

**Design system (src/styles.css)**
- Palette in oklch: deep black background, warm ivory surface, warm metallic gold accent, subtle neutral borders. Gold reserved for hairlines, small type, and focus states.
- Typography: high-contrast serif for headings (Cormorant Garamond), clean sans for body/UI (Inter-alternative: Jost/Karla via Google Fonts `<link>` in `__root.tsx`).
- Spacing and rhythm tokens for generous negative space, near-square radii, no heavy shadows, one very subtle gradient token at most.
- Reduced-motion handling and visible gold focus rings globally.

**Page shell**
- `src/routes/index.tsx` becomes the one-page site: header, `<main>` with empty placeholder section landmarks (`#about`, `#services`, `#how-it-works`, `#reviews`, `#faq`, `#booking`, `#contact`), footer. Single H1 in the hero slot.
- Smooth in-page anchor scrolling with scroll-margin so the fixed header never covers headings.
- No extra public routes.

**Reusable components (src/components/)**
- `Navigation` (desktop hairline nav + intentionally designed mobile menu, keyboard accessible)
- `Wordmark` (typographic lockup now; swaps to the uploaded logo file when it arrives)
- `SectionHeading` (eyebrow + serif heading + thin gold rule)
- `Button` (primary gold-outline, solid, and ghost variants)
- `ServiceCard`, `ReviewCard`, `FaqItem` (accessible accordion), `BookingCta`, `LanguageSwitcher` (discreet EN · PT · ES inline toggle, not a dropdown), `Footer`

**Translations**
- Lightweight typed dictionary: `src/i18n/en.ts`, `pt.ts`, `es.ts` with one nested object each, plus a small React context + `useT()` hook. English is the fallback. Language persists in localStorage and sets `<html lang>`. No i18n library installed.

**Booking integration point**
- `src/config/booking.ts` exporting a single Setmore URL read from `import.meta.env.VITE_SETMORE_URL` with a clearly marked placeholder. All CTAs point at that one value. No fake booking flow.

**Reviews backend (Lovable Cloud)**
- Enable Cloud and add a `reviews` table (name, rating, body, language, status, created_at) with grants, RLS: public reads only approved rows, anyone may insert as pending, admins manage all. Separate `user_roles` table + `has_role()` function for admin checks.
- Protected `/admin/reviews` moderation route behind auth (the only non-public route). Review UI wiring happens in the sections phase; this phase creates schema and the route gate.

**SEO & performance foundation**
- Route `head()`: title, meta description, Open Graph and Twitter tags, canonical, and LocalBusiness JSON-LD scoped to Lisbon.
- Semantic landmarks, alt-text conventions, `loading="lazy"` + `decoding="async"` on future imagery, no extra dependencies beyond what ships.

## Open item

The logo file isn't uploaded yet — the `Wordmark` component renders a serif lockup and swaps to the image in a one-line change once you send it.

## Next step

After approval, the following instruction can request individual sections (hero, about, services, etc.) which will be composed from these components.
