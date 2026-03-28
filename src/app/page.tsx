import { LandingHero, LandingHowItWorks } from "./_components/landing-hero";
import { LandingBenefits } from "./_components/landing-benefits";
import { LandingTestimonials } from "./_components/landing-testimonials";
import { LandingSegments } from "./_components/landing-segments";
import { LandingFAQ } from "./_components/landing-faq";
import { LandingCTABanner } from "./_components/landing-cta-banner";

export default function Home() {
  return (
    <main>
      <LandingHero />
      <LandingHowItWorks />
      <LandingBenefits />
      <LandingTestimonials />
      <LandingSegments />
      <LandingFAQ />
      <LandingCTABanner />
    </main>
  );
}
