import Hero from '@/components/Hero';
import { FeaturesSection, BrandsSection, StatsSection, TestimonialsSection, CTASection, Newsletter } from '@/components/HomeSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturesSection />
      <BrandsSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Newsletter />
    </div>
  );
}

