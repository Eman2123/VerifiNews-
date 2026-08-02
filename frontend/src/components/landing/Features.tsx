'use client';
import { motion } from 'framer-motion';
import { MdTextFields, MdLink, MdHistory, MdFlag } from 'react-icons/md';
import TiltCard from './TiltCard';

const features = [
  {
    icon: MdTextFields,
    title: 'Text Check',
    desc: 'Paste any article text directly for instant analysis.',
  },
  {
    icon: MdLink,
    title: 'URL Check',
    desc: 'Just drop a link — we extract and analyze the article for you.',
  },
  {
    icon: MdHistory,
    title: 'Check History',
    desc: 'Every check you run is saved so you can revisit it anytime.',
  },
  {
    icon: MdFlag,
    title: 'Report Results',
    desc: "Disagree with a verdict? Flag it and help us improve the model.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <h3 className="font-news mb-10 text-center text-3xl font-black text-navy-900 dark:text-white">
        What You Get
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <TiltCard strength={6} className="h-full rounded-xl">
              <div className="h-full rounded-xl border border-gray-200 bg-[#faf6ee] p-5 transition-shadow duration-300 hover:shadow-xl dark:border-navy-700 dark:bg-navy-800">
                <f.icon className="h-7 w-7 text-orange-700" />
                <h4 className="mt-3 font-bold text-navy-900 dark:text-white">{f.title}</h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
