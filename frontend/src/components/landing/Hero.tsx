'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 scroll-mt-20 sm:py-20"
    >
      {/* decorative floating accents for depth / 3D feel */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-900/20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-navy-300/30 blur-3xl dark:bg-navy-700/30"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="mb-3 inline-flex items-center gap-2 border-2 border-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-red-600">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-600" />
            Breaking
          </span>
          <h2 className="font-news text-4xl font-black leading-tight text-navy-900 dark:text-white sm:text-5xl">
            Know the Truth Before You Share It
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            VerifiNews uses AI to check whether a news article is real or fake — paste the text
            or a link, and get a verdict with a confidence score in seconds.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/auth/sign-up"
              className="linear rounded-xl bg-orange-700 px-6 py-3 text-base font-medium text-white shadow-md shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg"
            >
              Try It Free
            </Link>
            <a
              href="#how-it-works"
              className="linear rounded-xl border border-navy-900 px-6 py-3 text-base font-medium text-navy-900 transition duration-200 hover:-translate-y-0.5 hover:bg-navy-900 hover:text-white dark:border-white dark:text-white"
            >
              How It Works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <span>10,000+ Articles Checked</span>
            <span className="h-1 w-1 rounded-full bg-gray-400" />
            <span>92% Model Accuracy</span>
          </div>
        </motion.div>

        {/* Sample "stamped" clipping as a 3D tilting visual preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <TiltCard strength={8} className="rounded-xl">
            <div className="relative rounded-xl border border-gray-200 bg-[#faf6ee] p-6 shadow-xl shadow-navy-900/10">
              <div
                className="pointer-events-none absolute right-6 top-6 rounded-md border-4 border-double border-red-600 px-4 py-1 text-xl font-black uppercase tracking-widest text-red-600 opacity-80"
                style={{ transform: 'translateZ(40px) rotate(-12deg)' }}
              >
                Fake
              </div>
              <p
                className="mb-4 max-w-[75%] font-news-body text-gray-700"
                style={{ transform: 'translateZ(20px)' }}
              >
                &ldquo;Scientists confirm chocolate cures the common cold, new study
                claims…&rdquo;
              </p>
              <div className="h-px w-full bg-gray-300" />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm italic text-gray-500">
                  Confidence: <strong>94%</strong> — Reviewed by AI
                </span>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
