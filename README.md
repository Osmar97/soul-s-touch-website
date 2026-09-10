# Soul's Touch Website

PROJECT: SOUL'S TOUCH BY DANI

We are building a premium one-page website for a mobile/home massage brand called:

SOUL'S TOUCH

BY DANI

The client has provided a logo that should be used as the primary brand identity.

IMPORTANT DEVELOPMENT APPROACH:

This is a ONE-PAGE PUBLIC WEBSITE.

Do NOT create separate public pages for:

- About

- Services

- Reviews

- FAQ

- Contact

- Booking

Everything must exist as sections within one elegant, continuously scrollable homepage.

The only exception may be a protected internal admin route if a review moderation system requires one. The public-facing experience must remain one page.

BUSINESS MODEL:

Soul's Touch is currently a mobile/home massage service.

Dani travels to the client's home and brings:

- Massage table

- Clean linens

- Towel

- Massage oils

- Everything necessary for the treatment

The website must make this home-service model immediately clear.

BRAND POSITIONING:

Soul's Touch is not supposed to feel like:

- A generic massage website

- A cheap booking website

- A stereotypical feminine spa

- An overcrowded wellness template

- A basic Setmore booking page

It should feel like:

- A premium wellness brand

- Calm

- Elegant

- Minimal

- Warm

- Luxurious

- Professional

- Trustworthy

- Sophisticated

- Intimate but not overly personal

The visual reference is a high-end five-star hotel or luxury wellness experience.

BRAND COLORS:

Primary:

- Deep black

- Warm metallic gold

Secondary:

- Soft ivory / warm white

- Very subtle neutral shades

Gold must be used as an accent rather than covering large areas.

TYPOGRAPHY:

Use an elegant high-contrast serif for major headings.

Use a clean modern sans-serif for:

- Body text

- Navigation

- Buttons

- Labels

- Forms

Typography should feel editorial and luxurious.

Avoid:

- Playful fonts

- Script fonts

- Generic spa typography

- Excessively feminine fonts

DESIGN PRINCIPLES:

1. Large amounts of negative space.

2. Strong typography.

3. Thin gold lines.

4. Very subtle borders.

5. Sophisticated imagery.

6. Minimal cards.

7. No excessive shadows.

8. No excessive rounded corners.

9. No gradients unless extremely subtle and necessary.

10. No excessive animations.

11. No visual clutter.

12. No generic SaaS UI.

13. No bright colors.

PERFORMANCE:

The site must be optimized for:

- Fast initial load

- Mobile devices

- Lighthouse performance

- Low JavaScript overhead

- Lazy-loaded images

- Optimized image sizes

- Minimal third-party scripts

- Semantic HTML

- Good Core Web Vitals

Do not install unnecessary libraries.

TECH STACK:

Use:

- React

- TypeScript

- Tailwind CSS

- Supabase only where custom persistence is necessary

Keep the architecture clean and componentized.

Do not create duplicate components or duplicate styling systems.

Create reusable components for:

- Navigation

- Section headings

- Buttons

- Service cards

- FAQ items

- Review cards

- Language selector

- Booking CTA

- Footer

IMPORTANT:

Do not use fake booking functionality.

Bookings will eventually be handled by Setmore.

Create a clean integration point for the Setmore booking widget/booking URL using an environment variable or clearly isolated configuration value.

Do not hardcode a fake booking system.

MULTILINGUAL REQUIREMENT:

The website should support:

- English

- Portuguese

- Spanish

English is the primary language.

Create a lightweight translation structure rather than duplicating entire components for each language.

The language switcher should be discreet and premium.

Use:

EN

PT

ES

The language switcher should not look like a generic dropdown.

SEO:

Because this is a one-page site, structure the page semantically.

Use:

- One H1 only

- Proper H2 hierarchy

- Descriptive section IDs

- Meta title

- Meta description

- Open Graph metadata

- Local SEO-ready content

- Image alt text

Potential search intent includes:

- massage near me

- home massage

- mobile massage

- massage in [location]

Do not keyword-stuff the website.

ACCESSIBILITY:

Ensure:

- Keyboard navigation

- Proper contrast

- Accessible buttons

- Accessible accordion

- Focus states

- Proper form labels

- aria attributes where appropriate

- Reduced-motion support

RESPONSIVENESS:

Design mobile-first.

The website must look excellent at:

- 320px

- 375px

- 390px

- 430px

- Tablet

- Desktop

- Large desktop

Do not simply shrink the desktop design.

The mobile experience should feel intentionally designed.

IMPORTANT IMPLEMENTATION RULE:

Do not build the complete website yet.

For this phase, establish:

- Project architecture

- Global design tokens

- Typography

- Colors

- Spacing

- Responsive system

- Translation structure

- Reusable components

- SEO foundation

- Performance foundation

Do not add unnecessary pages.

Wait for the next implementation instruction for the individual sections.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/60d2050c-8526-4b0e-9dce-ab8b57edcf2e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
