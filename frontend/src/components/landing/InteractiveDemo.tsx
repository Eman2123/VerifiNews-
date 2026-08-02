'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPlayArrow, MdRestartAlt } from 'react-icons/md';
import TiltCard from './TiltCard';

const samples = [
  {
    text: 'Scientists confirm chocolate cures the common cold, new study claims…',
    verdict: 'Fake' as const,
    confidence: 96,
  },
  {
    text: 'City council approves budget for public transit expansion next year.',
    verdict: 'Real' as const,
    confidence: 91,
  },
];

export default function InteractiveDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const active = samples[activeIndex];

  const runDemo = () => {
    setStatus('scanning');
    setTimeout(() => setStatus('done'), 1600);
  };

  const reset = () => setStatus('idle');

  return (
    <section id="demo" className="mx-auto max-w-3xl px-4 py-16 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.3em] text-orange-700 dark:text-orange-400">
          Try It Right Here
        </span>
        <h3 className="font-news text-3xl font-black text-navy-900 dark:text-white">
          See a Real Check, Live
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          No signup needed — pick a sample headline and watch the model work.
        </p>
      </motion.div>

      <TiltCard strength={4} glare={false} className="rounded-2xl">
        <div className="rounded-2xl border border-gray-200 bg-[#faf6ee] p-6 shadow-xl shadow-navy-900/10 dark:border-navy-700 dark:bg-navy-800 sm:p-8">
          {/* sample picker */}
          <div className="mb-5 flex flex-wrap gap-2">
            {samples.map((s, i) => (
              <button
                key={s.text}
                type="button"
                onClick={() => {
                  setActiveIndex(i);
                  setStatus('idle');
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                  activeIndex === i
                    ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900'
                    : 'bg-white text-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:text-gray-300 dark:hover:bg-navy-700'
                }`}
              >
                Sample {i + 1}
              </button>
            ))}
          </div>

          <p className="font-news-body mb-6 rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-700 dark:border-navy-600 dark:bg-navy-900 dark:text-gray-300">
            &ldquo;{active.text}&rdquo;
          </p>

          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={runDemo}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-800"
              >
                <MdPlayArrow className="h-5 w-5" />
                Run This Check
              </motion.button>
            )}

            {status === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-3"
              >
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Scanning language patterns…
                </span>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700">
                  <motion.div
                    className="h-full bg-orange-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}

            {status === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between rounded-xl border-2 border-double px-5 py-4"
                style={{
                  borderColor: active.verdict === 'Fake' ? '#dc2626' : '#16a34a',
                }}
              >
                <div>
                  <p
                    className={`font-news text-2xl font-black ${
                      active.verdict === 'Fake' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {active.verdict}
                  </p>
                  <p className="text-xs italic text-gray-500 dark:text-gray-400">
                    Confidence: {active.confidence}%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-navy-700 hover:bg-gray-100 dark:border-navy-600 dark:text-gray-300 dark:hover:bg-navy-700"
                >
                  <MdRestartAlt className="h-4 w-4" />
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TiltCard>
    </section>
  );
}
