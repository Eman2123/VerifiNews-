import Masthead from 'components/landing/Masthead';
import StickyNav from 'components/landing/StickyNav';
import Hero from 'components/landing/Hero';
import NewsTicker from 'components/landing/NewsTicker';
import HowItWorks from 'components/landing/HowItWorks';
import Features from 'components/landing/Features';
import Benefits from 'components/landing/Benefits';
import LiveVerdicts from 'components/landing/LiveVerdicts';
import Testimonials from 'components/landing/Testimonials';
import PressLogos from 'components/landing/PressLogos';
import Comparison from 'components/landing/Comparison';
import Technology from 'components/landing/Technology';
import Security from 'components/landing/Security';
import Team from 'components/landing/Team';
import Awards from 'components/landing/Awards';
import InteractiveDemo from 'components/landing/InteractiveDemo';
import Stats from 'components/landing/Stats';
import FAQ from 'components/landing/FAQ';
import Extension from 'components/landing/Extension';
import CTA from 'components/landing/CTA';
import LandingFooter from 'components/landing/LandingFooter';

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth bg-[#faf6ee] dark:bg-navy-900">
      {/* Big masthead — appears once at the very top, not sticky */}
      <Masthead />

      {/* Slim sticky nav — fades in once you scroll past the masthead */}
      <StickyNav />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Live headline ticker */}
      <NewsTicker />

      {/* 3. How It Works */}
      <HowItWorks />

      {/* 4. Features */}
      <Features />

      {/* 5. Benefits */}
      <Benefits />

      {/* 6. Live verdict wall (marquee) */}
      <LiveVerdicts />

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. As referenced by (marquee) */}
      <PressLogos />

      {/* 9. Old way vs VerifiNews (new) */}
      <Comparison />

      {/* 10. Technology */}
      <Technology />

      {/* 11. Security */}
      <Security />

      {/* 12. Meet the newsroom (new) */}
      <Team />

      {/* 13. Recognition (marquee, new) */}
      <Awards />

      {/* 14. Interactive live demo (new) */}
      <InteractiveDemo />

      {/* 15. Stats */}
      <Stats />

      {/* 16. FAQ */}
      <FAQ />

      {/* 17. Browser extension */}
      <Extension />

      {/* 18. CTA */}
      <CTA />

      {/* Footer */}
      <LandingFooter />
    </main>
  );
}
