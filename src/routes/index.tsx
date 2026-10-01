import { createFileRoute } from "@tanstack/react-router";

import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

import { MobileBookingBar } from "@/components/site/MobileBookingBar";
import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { BrandStatement } from "@/components/site/BrandStatement";
import { HomeExperience } from "@/components/site/HomeExperience";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Services } from "@/components/site/Services";
import { PersonalizedMassage } from "@/components/site/PersonalizedMassage";
import { ClientExperience } from "@/components/site/ClientExperience";
import { Reviews } from "@/components/site/Reviews";
import { Faq } from "@/components/site/Faq";
import { Loyalty } from "@/components/site/Loyalty";
import { Booking } from "@/components/site/Booking";
import { Contact } from "@/components/site/Contact";

import { SITE } from "@/config/site";
import { en } from "@/i18n/en";

const TITLE =
  (import.meta.env["VITE_SITE_TITLE"] as string | undefined)?.trim() ||
  "Soul's Touch by Dani | Home Massage";
const DESCRIPTION =
  (import.meta.env["VITE_SITE_DESCRIPTION"] as string | undefined)?.trim() || en.meta.description;

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => {
    const canonical = SITE.canonicalUrl || "/";
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:site_name", content: SITE.fullName },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:locale", content: "en" },
        { property: "og:locale:alternate", content: "pt" },
        { property: "og:locale:alternate", content: "es" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE },
        { name: "twitter:description", content: DESCRIPTION },
      ],
      links: [{ rel: "canonical", href: canonical }],
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
    };
  },
});

/**
 * One-page site shell. Each landmark below is a placeholder for the section
 * content that follows in the next implementation phase.
 */
function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <Navigation />

      <main id="main">
        <Hero />

        <Philosophy />

        <BrandStatement />

        <HomeExperience />

        <HowItWorks />

        <Services />

        <PersonalizedMassage />

        <ClientExperience />

        <Reviews />

        <Faq />

        <Loyalty />

        <Booking />

        <Contact />
      </main>

      <Footer />
      <MobileBookingBar />
    </div>
  );
}
