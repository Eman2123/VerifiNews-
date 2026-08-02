'use client';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Paste the Story',
    desc: 'Drop in the article text, or just paste a link — we\'ll pull the text for you.',
  },
  {
    number: '02',
    title: 'AI Analyzes It',
    desc: 'Our model checks language patterns and signals associated with misinformation.',
  },
  {
    number: '03',
    title: 'Get Your Verdict',
    desc: 'A clear Real or Fake stamp with a confidence score — decide with confidence.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-gray-200 bg-white py-16 dark:bg-navy-900">
      <div className="mx-auto max-w-6xl px-4">
        <h3 className="font-news mb-10 text-center text-3xl font-black text-navy-900 dark:text-white">
          How It Works
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`px-4 ${i > 0 ? 'md:border-l md:border-gray-300 dark:md:border-navy-600' : ''}`}
            >
              <span className="font-news text-5xl font-black text-gray-200 dark:text-navy-700">
                {step.number}
              </span>
              <h4 className="mt-2 text-lg font-bold text-navy-900 dark:text-white">
                {step.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
