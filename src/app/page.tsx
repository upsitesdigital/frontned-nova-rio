import { LandingHero } from "./_components/landing-hero";
import { LandingHowItWorks } from "./_components/landing-how-it-works";
import { LandingBenefits } from "./_components/landing-benefits";
import { LandingTestimonials } from "./_components/landing-testimonials";
import { LandingSegments } from "./_components/landing-segments";
import { LandingFAQ } from "./_components/landing-faq";
import { LandingCTABanner } from "./_components/landing-cta-banner";
import { LandingFooter } from "./_components/landing-footer";

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
      <LandingFooter />
    </main>
  );
}
