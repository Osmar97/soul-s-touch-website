import { createFileRoute } from "@tanstack/react-router";

import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingCta } from "@/components/site/BookingCta";
import { SECTIONS, SITE } from "@/config/site";
import { useT } from "@/i18n";
import { en } from "@/i18n/en";

const TITLE = en.meta.title;
const DESCRIPTION = en.meta.description;

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "en" },
      { property: "og:locale:alternate", content: "pt" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          name: SITE.fullName,
          description: DESCRIPTION,
          areaServed: { "@type": "City", name: SITE.city },
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.city,
            addressRegion: SITE.region,
            addressCountry: SITE.country,
          },
          availableService: {
            "@type": "Service",
            serviceType: "Mobile massage therapy at home",
            areaServed: SITE.serviceArea,
          },
        }),
      },
    ],
  }),
});

/**
 * One-page site shell. Each landmark below is a placeholder for the section
 * content that follows in the next implementation phase.
 */
function HomePage() {
  const t = useT();

  return (
    <div id="top" className="min-h-screen bg-background">
      <Navigation />

      <main id="main">
        {/* Hero — the only H1 on the site */}
        <section className="flex min-h-[88svh] items-center pt-32 pb-20">
          <div className="container-luxe">
            <span className="label-luxe text-gold-deep">{t.hero.eyebrow}</span>
            <h1 className="mt-8 max-w-3xl font-serif text-4xl leading-[1.08] text-foreground sm:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>
            <span className="rule-gold mt-10" aria-hidden="true" />
            <p className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.hero.subtitle}
            </p>
            <div className="mt-12">
              <BookingCta size="lg" />
            </div>
          </div>
        </section>

        <Section id={SECTIONS.about} labelledBy="about-heading">
          <SectionHeading id="about-heading" eyebrow={t.hero.eyebrow} title={t.nav.about} />
        </Section>

        <Section id={SECTIONS.services} tone="ink" labelledBy="services-heading">
          <SectionHeading id="services-heading" tone="onInk" title={t.nav.services} />
        </Section>

        <Section id={SECTIONS.howItWorks} labelledBy="how-heading">
          <SectionHeading id="how-heading" title={t.nav.howItWorks} />
        </Section>

        <Section id={SECTIONS.reviews} tone="muted" labelledBy="reviews-heading">
          <SectionHeading
            id="reviews-heading"
            eyebrow={t.reviews.eyebrow}
            title={t.reviews.title}
          />
        </Section>

        <Section id={SECTIONS.faq} labelledBy="faq-heading">
          <SectionHeading id="faq-heading" title={t.nav.faq} />
        </Section>

        <Section id={SECTIONS.booking} tone="ink" labelledBy="booking-heading">
          <SectionHeading
            id="booking-heading"
            tone="onInk"
            align="center"
            eyebrow={t.booking.eyebrow}
            title={t.booking.title}
            description={t.booking.description}
          />
          <div className="mt-12 flex justify-center">
            <BookingCta variant="onInk" size="lg" label={t.booking.cta} />
          </div>
        </Section>

        <Section id={SECTIONS.contact} labelledBy="contact-heading">
          <SectionHeading id="contact-heading" title={t.nav.contact} />
        </Section>
      </main>

      <Footer />
    </div>
  );
}
