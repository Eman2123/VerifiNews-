'use client';
import Link from 'next/link';

export default function Masthead() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="paper-texture relative overflow-hidden border-b-4 border-double border-orange-500/60 bg-navy-900">
      {/* soft radial glow accents for depth */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-navy-500/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-8 sm:py-10">
        {/* Top utility bar */}
        <div className="flex w-full items-center justify-between text-[11px] uppercase tracking-widest text-gray-400 sm:text-xs">
          <span className="hidden sm:inline">{today}</span>
          <span className="font-bold text-orange-400 sm:hidden">Digital Edition</span>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-full px-3 py-1.5 font-bold text-gray-200 transition hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-orange-600 px-4 py-1.5 font-bold text-white shadow-sm shadow-orange-900/40 transition hover:bg-orange-500"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Masthead title */}
        <a href="#hero" className="mt-5 text-center">
          <h1 className="font-news text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            THE <span className="text-orange-500">VERIFI</span>NEWS
          </h1>
          <p className="mt-2 text-sm italic tracking-wide text-gray-400">
            Verified Before You Believe It
          </p>
        </a>

        <div className="mt-5 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
            AI Fact-Checking Desk
          </span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
      </div>
    </header>
  );
}
