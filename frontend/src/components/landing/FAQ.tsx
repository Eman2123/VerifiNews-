'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdExpandMore } from 'react-icons/md';

const faqs = [
  {
    q: 'How accurate is VerifiNews?',
    a: "Our model is continuously evaluated against known real and fake news datasets, but no AI is 100% accurate — always use the confidence score as a guide, not an absolute answer.",
  },
  {
    q: 'What languages are supported?',
    a: 'Currently English-language articles give the most reliable results. Support for more languages is on the roadmap.',
  },
  {
    q: 'Is my data private?',
    a: 'Checks you run are tied to your account for your own history, and are not shared publicly. See our privacy policy for full details.',
  },
  {
    q: 'Can I check a link instead of pasting text?',
    a: 'Yes — switch to the URL tab on the Detect page and paste any article link.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 scroll-mt-20">
      <h3 className="font-news mb-8 text-center text-3xl font-black text-navy-900 dark:text-white">
        Frequently Asked Questions
      </h3>
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-navy-700">
        {faqs.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="py-4"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-medium text-navy-900 dark:text-white">{item.q}</span>
              <MdExpandMore
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
