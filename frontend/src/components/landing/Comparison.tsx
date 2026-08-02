'use client';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

const oldWay = [
  'Hours spent cross-referencing sources by hand',
  'Easy to miss subtle red flags in the writing',
  'No consistent scoring — just gut feeling',
  'Hard to keep a record of what you checked',
];

const newWay = [
  'A verdict with confidence score in seconds',
  'AI trained to catch language-level red flags',
  'Consistent scoring on every single check',
  'Full history saved automatically to your account',
];

export default function Comparison() {
  return (
    <section id="comparison" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <motion.h3
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-news mb-10 text-center text-3xl font-black text-navy-900 dark:text-white"
      >
        Old Way vs. The VerifiNews Way
      </motion.h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-gray-200 bg-gray-50 p-8 dark:border-navy-700 dark:bg-navy-800"
        >
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            Manual Fact-Checking
          </p>
          <ul className="flex flex-col gap-4">
            {oldWay.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MdCancel className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -4 }}
          className="rounded-xl border-2 border-orange-600 bg-navy-900 p-8 shadow-xl shadow-orange-900/10"
        >
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-orange-400">
            With VerifiNews
          </p>
          <ul className="flex flex-col gap-4">
            {newWay.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-200">
                <MdCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
