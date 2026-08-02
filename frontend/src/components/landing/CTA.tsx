'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-4xl px-4 py-20 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-700 p-12 text-center"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h3 className="font-news text-3xl font-black text-white">
          Ready to Verify the Truth?
        </h3>
        <p className="mt-4 text-xl text-orange-100">
          Start checking articles in seconds. No credit card required.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-white px-8 py-4 font-bold text-orange-700 transition-colors hover:-translate-y-0.5 hover:bg-gray-100"
          >
            Get Started Free
          </Link>
          <Link
            href="#demo"
            className="rounded-lg border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:-translate-y-0.5 hover:bg-white/10"
          >
            Watch Demo
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
