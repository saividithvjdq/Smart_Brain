import {
  Navbar,
  HeroSection,
  FeaturesSection,
  PlatformBenefitsSection,
  ChatInterfacesSection,
  CTASection,
  Footer
} from '@/components/landing/sections'
import { CursorTrail } from '@/components/ui/cursor-trail'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <CursorTrail />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PlatformBenefitsSection />
      <ChatInterfacesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
