'use client';
// NOTE: these are placeholder numbers for now. Once you have real usage data,
// wire this up to a small public endpoint (e.g. GET /stats/public) instead
// of hardcoding — don't publish fake stats on a fact-checking product.
import { motion } from 'framer-motion';

const stats = [
  { label: 'Articles Checked', value: '10,000+' },
  { label: 'Model Accuracy', value: '92%' },
  { label: 'Active Users', value: '500+' },
];

export default function Stats() {
  return (
    <section id="stats" className="scroll-mt-20 border-y border-gray-200 bg-white py-10 dark:bg-navy-900">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border-2 border-navy-900 p-6 dark:border-white"
        >
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
            Today&apos;s Numbers
          </p>
          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="font-news text-3xl font-black text-navy-900 dark:text-white">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
