import {
  Navbar,
  HeroSection,
  FeaturesSection,
  PlatformBenefitsSection,
  ChatInterfacesSection,
  HowItWorksSection,
  CTASection,
  Footer
} from '@/components/landing/sections'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PlatformBenefitsSection />
      <ChatInterfacesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  )
}
