'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from 'contexts/AuthContext';
import {
  MdLogout,
  MdArrowBack,
  MdMenu,
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdPersonOutline,
  MdOutlineFactCheck,
  MdKeyboardArrowDown,
} from 'react-icons/md';

const navLinks = [
  { name: 'Detect News', href: '/dashboard/default' },
  { name: 'History', href: '/dashboard/history' },
  { name: 'Profile', href: '/dashboard/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkmode, setDarkmode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDarkmode(document.body.classList.contains('dark'));
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleDarkMode() {
    if (darkmode) {
      document.body.classList.remove('dark');
      setDarkmode(false);
    } else {
      document.body.classList.add('dark');
      setDarkmode(true);
    }
  }

  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#faf6ee] dark:bg-navy-900">
      {/* Enhanced Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-3xl"></div>
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-orange-500/3 blur-3xl"></div>
      </div>
      
      <header
        className={`paper-texture sticky top-0 z-40 border-b border-white/10 bg-navy-900/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'shadow-2xl shadow-black/20' : 'shadow-lg shadow-black/10'
        }`}
      >
        {/* Enhanced Newspaper masthead */}
        <div className="h-[5px] w-full bg-gradient-to-r from-orange-700 via-amber-400 to-orange-700 shadow-sm" />
        
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Enhanced Home Button */}
            <Link
              href="/"
              aria-label="Back to VerifiNews home"
              className="group hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-300 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 hover:shadow-md hover:shadow-orange-500/20 sm:flex"
            >
              <MdArrowBack className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Home
            </Link>
            
            {/* Enhanced Brand/Logo */}
            <Link href="/dashboard/default" className="group flex flex-col leading-none">
              <span className="font-news text-2xl font-black tracking-tight text-white transition-all duration-300 group-hover:text-orange-400 sm:text-3xl">
                THE <span className="text-orange-500 transition-all duration-300 group-hover:text-orange-400">VERIFI</span>NEWS
              </span>
              <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 transition-all duration-300 group-hover:text-gray-400 lg:block">
                Truth in Media
              </span>
            </Link>
          </div>

          {/* Enhanced Desktop Nav */}
          <nav className="hidden flex-wrap items-center gap-2 md:flex lg:gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1.5 shadow-lg backdrop-blur-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative overflow-hidden rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/40'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {pathname === link.href && (
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-600/50 to-orange-500/50 blur-sm"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Enhanced Dark Mode Button */}
            <button
              onClick={toggleDarkMode}
              title={darkmode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="ml-1 flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-gray-300 shadow-md transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-lg"
            >
              {darkmode ? <MdLightMode className="h-4 w-4" /> : <MdDarkMode className="h-4 w-4" />}
            </button>

            {/* Enhanced User Dropdown */}
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                title={user ? user.email : 'Account'}
                className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 shadow-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-600 font-news text-sm font-black text-white shadow-lg ring-2 ring-white/20 transition-transform duration-300 hover:scale-105">
                  {user?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initial
                  )}
                </span>
                <MdKeyboardArrowDown
                  className={`h-4 w-4 text-gray-400 transition-all duration-300 ${menuOpen ? 'rotate-180 text-white' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl shadow-black/50 backdrop-blur-sm">
                  <div className="border-b border-white/10 bg-gradient-to-br from-white/10 to-transparent px-5 py-4">
                    <p className="font-news truncate text-lg font-bold text-white">
                      {user?.name || 'Member'}
                    </p>
                    <p className="truncate text-sm text-gray-400">{user?.email}</p>
                  </div>
                  <div className="p-2.5">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md"
                    >
                      <MdPersonOutline className="h-5 w-5 text-gray-400" />
                      Profile &amp; Settings
                    </Link>
                    <Link
                      href="/dashboard/history"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md"
                    >
                      <MdOutlineFactCheck className="h-5 w-5 text-gray-400" />
                      My History
                    </Link>
                  </div>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 border-t border-white/10 px-5 py-4 text-sm font-bold uppercase tracking-wide text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <MdLogout className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Enhanced Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-gray-300 shadow-md transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-lg md:hidden"
          >
            {mobileOpen ? <MdClose className="h-5 w-5" /> : <MdMenu className="h-5 w-5" />}
          </button>
        </div>

        {/* Enhanced Mobile Nav Panel */}
        {mobileOpen && (
          <div className="relative border-t border-white/10 bg-navy-800/50 px-4 py-5 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-orange-400"
              >
                <MdArrowBack className="h-4 w-4" />
                Back to Home
              </Link>
              
              <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/40'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-gray-300 transition-all duration-200 hover:bg-white/10"
              >
                {darkmode ? <MdLightMode className="h-5 w-5" /> : <MdDarkMode className="h-5 w-5" />}
                {darkmode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-lg backdrop-blur-sm">
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-bold text-white">{user?.name || 'Member'}</span>
                  <span className="truncate text-xs text-gray-400">{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:shadow-md"
                >
                  <MdLogout className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}