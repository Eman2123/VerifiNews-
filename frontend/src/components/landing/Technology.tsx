'use client';
import { motion } from 'framer-motion';
import { MdBrandingWatermark, MdCode, MdCloud, MdAnalytics } from 'react-icons/md';
import TiltCard from './TiltCard';

const techs = [
  {
    icon: MdBrandingWatermark,
    title: 'Advanced AI',
    desc: 'Machine learning models trained on millions of articles.',
  },
  {
    icon: MdCode,
    title: 'REST API',
    desc: 'Integrate VerifiNews into your existing workflow easily.',
  },
  {
    icon: MdCloud,
    title: 'Cloud-Based',
    desc: 'Secure, scalable infrastructure with 99.9% uptime.',
  },
  {
    icon: MdAnalytics,
    title: 'Real-Time Updates',
    desc: 'Our models learn continuously to stay ahead of misinformation.',
  },
];

export default function Technology() {
  return (
    <section id="technology" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <h3 className="font-news mb-10 text-center text-3xl font-black text-navy-900 dark:text-white">
        Powered by Advanced Technology
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {techs.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <TiltCard strength={6} className="h-full rounded-xl">
              <div className="h-full rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 text-center transition-shadow duration-300 hover:shadow-xl dark:border-navy-700 dark:from-navy-800 dark:to-navy-750">
                <t.icon className="mx-auto h-10 w-10 text-orange-700" />
                <h4 className="mt-4 font-bold text-navy-900 dark:text-white">{t.title}</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
