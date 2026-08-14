import dynamic from "next/dynamic";
import { LandingHero } from "./_components/landing-hero";
import { LandingHowItWorks } from "./_components/landing-how-it-works";
import { LandingBenefits } from "./_components/landing-benefits";

const LandingTestimonials = dynamic(() =>
  import("./_components/landing-testimonials").then((m) => ({ default: m.LandingTestimonials })),
);
const LandingSegments = dynamic(() =>
  import("./_components/landing-segments").then((m) => ({ default: m.LandingSegments })),
);
const LandingFAQ = dynamic(() =>
  import("./_components/landing-faq").then((m) => ({ default: m.LandingFAQ })),
);
const LandingCTABanner = dynamic(() =>
  import("./_components/landing-cta-banner").then((m) => ({ default: m.LandingCTABanner })),
);
const LandingFooter = dynamic(() =>
  import("./_components/landing-footer").then((m) => ({ default: m.LandingFooter })),
);

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
