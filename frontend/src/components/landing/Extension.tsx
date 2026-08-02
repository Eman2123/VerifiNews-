'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdExtension } from 'react-icons/md';
import TiltCard from './TiltCard';
import ExtensionModal from './ExtensionModal';

const perks = [
  'One click checks any article you are reading',
  'Highlights suspicious claims right on the page',
  'Works on any news site, no copy-pasting needed',
  'Free forever for personal use',
];

export default function Extension() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="extension" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
        <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border-2 border-dashed border-navy-900/20 bg-[#faf6ee] p-10 dark:border-white/20 dark:bg-navy-800 sm:p-14 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-700 dark:text-orange-400">
              <MdExtension className="h-4 w-4" /> Browser Extension
            </span>
            <h3 className="font-news text-3xl font-black text-navy-900 dark:text-white">
              Check the News Without Leaving the Page
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Add VerifiNews to your browser and get a verdict on any article you are reading —
              no copy-paste required.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <MdCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-navy-900 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-800 dark:bg-white dark:text-navy-900 dark:hover:bg-gray-100"
              >
                Add to Chrome — Free
              </button>
              
            </div>
          </motion.div>

          {/* Mock browser window with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <TiltCard strength={7} className="rounded-xl">
              <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl shadow-navy-900/20 dark:border-navy-600">
                <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-navy-700 dark:bg-navy-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-3 flex-1 truncate rounded bg-white px-2 py-0.5 text-[10px] text-gray-400 dark:bg-navy-800">
                    dailynewsexample.com/article/42
                  </span>
                </div>
                <div className="space-y-3 bg-white p-5 dark:bg-navy-800">
                  <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-navy-700" />
                  <div className="h-3 w-full rounded bg-gray-200 dark:bg-navy-700" />
                  <div className="h-3 w-3/5 rounded bg-gray-200 dark:bg-navy-700" />
                  <div className="mt-4 flex items-center justify-between rounded-lg border-2 border-orange-600 bg-orange-50 px-4 py-3 dark:bg-orange-900/10">
                    <div className="flex items-center gap-2">
                      <MdExtension className="h-5 w-5 text-orange-700" />
                      <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                        VerifiNews Verdict
                      </span>
                    </div>
                    <span className="rounded-full border border-green-600 px-2 py-0.5 text-[10px] font-black uppercase text-green-600">
                      Real · 93%
                    </span>
                  </div>
                  <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-navy-700" />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Extension Installation Modal */}
      <ExtensionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}