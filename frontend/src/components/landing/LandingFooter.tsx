import Link from 'next/link';
import { MdEmail } from 'react-icons/md';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Technology', href: '#technology' },
  { label: 'Security', href: '#security' },
  { label: 'Team', href: '#team' },
  { label: 'Stats', href: '#stats' },
  { label: 'FAQ', href: '#faq' },
];

const companyLinks = [
  { label: 'Sign In', href: '/auth/sign-in' },
  { label: 'Sign Up', href: '/auth/sign-up' },
  { label: 'Get Verified', href: '#cta' },
];

export default function LandingFooter() {
  return (
    <footer className="paper-texture relative overflow-hidden border-t-4 border-double border-orange-500/60 bg-navy-900 px-4 pt-12">
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-navy-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <p className="font-news text-2xl font-black text-white">
            THE <span className="text-orange-500">VERIFI</span>NEWS
          </p>
          <p className="mt-2 text-sm italic text-gray-400">
            Verified Before You Believe It
          </p>
          <p className="mt-4 max-w-xs text-sm text-gray-400">
            AI-powered fact checking to help you tell real news from fake — in seconds,
            not hours.
          </p>
          <div className="mt-4 flex gap-4 text-xl text-white">
            <a href="https://twitter.com" aria-label="Twitter" className="transition hover:text-orange-400">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="transition hover:text-orange-400">
              <FaLinkedin />
            </a>
            <a href="https://github.com" aria-label="GitHub" className="transition hover:text-orange-400">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Explore / section nav */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white">
            Explore
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-400">
            {navLinks.slice(0, 5).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-orange-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white">
            More
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-400">
            {navLinks.slice(5).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-orange-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company / account */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white">
            Account
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-gray-400">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-orange-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <MdEmail /> support@verifinews.app
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-2 border-t border-white/10 py-6 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} VerifiNews. AI-assisted checks are a guide, not a final
          verdict — think critically.
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <a href="#" className="transition hover:text-orange-400">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-orange-400">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
