'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';

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

export default function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy-900/95 shadow-lg shadow-black/20 backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <a href="#hero" className="font-news shrink-0 text-lg font-black tracking-tight text-white">
              THE <span className="text-orange-500">VERIFI</span>NEWS
            </a>

            <nav className="hide-scrollbar hidden flex-1 items-center justify-center gap-5 overflow-x-auto text-[11px] font-bold uppercase tracking-widest text-gray-300 lg:flex">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="whitespace-nowrap transition hover:text-orange-400">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <Link
                href="/auth/sign-in"
                className="rounded-full px-3 py-1.5 text-xs font-bold text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-orange-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-orange-500"
              >
                Sign Up
              </Link>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
              className="shrink-0 text-xl text-white lg:hidden"
            >
              {menuOpen ? <MdClose /> : <MdMenu />}
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col items-center gap-3 overflow-hidden border-t border-white/10 bg-navy-900 py-4 text-sm font-bold uppercase tracking-widest text-gray-200 lg:hidden"
              >
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={handleNavClick} className="hover:text-orange-400">
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 flex items-center gap-3">
                  <Link href="/auth/sign-in" onClick={handleNavClick} className="rounded-full px-4 py-1.5 text-gray-200 hover:bg-white/10">
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={handleNavClick}
                    className="rounded-full bg-orange-600 px-4 py-1.5 text-white hover:bg-orange-500"
                  >
                    Sign Up
                  </Link>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
