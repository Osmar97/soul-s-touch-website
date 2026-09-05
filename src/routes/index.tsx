import { createFileRoute } from "@tanstack/react-router";

import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BookingCta } from "@/components/site/BookingCta";
import { MobileBookingBar } from "@/components/site/MobileBookingBar";
import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { BrandStatement } from "@/components/site/BrandStatement";
import { HomeExperience } from "@/components/site/HomeExperience";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Services } from "@/components/site/Services";
import { ClientExperience } from "@/components/site/ClientExperience";
import { Reviews } from "@/components/site/Reviews";

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
        <Hero />

        <Philosophy />

        <BrandStatement />

        <HomeExperience />

        <Services />

        <HowItWorks />

        <ClientExperience />

        <Reviews />


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
      <MobileBookingBar />

    </div>
  );
}
