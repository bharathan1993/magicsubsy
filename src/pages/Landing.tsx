import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import { ChatWidget } from "@/components/landing/ChatWidget";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <HeroSection />
        <FeaturesGrid />
        <StatsSection />
      </div>
      <SocialProofSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <ChatWidget />
    </div>
  );
}