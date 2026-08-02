'use client';
import { motion } from 'framer-motion';
import { MdLock, MdShield, MdPrivacyTip, MdGppGood } from 'react-icons/md';

const security = [
  {
    icon: MdLock,
    title: 'End-to-End Encryption',
    desc: 'Your data is encrypted both in transit and at rest.',
  },
  {
    icon: MdShield,
    title: 'GDPR Compliant',
    desc: 'Full compliance with international privacy regulations.',
  },
  {
    icon: MdPrivacyTip,
    title: 'Your Privacy Matters',
    desc: 'We never sell your data. Period.',
  },
  {
    icon: MdGppGood,
    title: 'Regular Audits',
    desc: 'Third-party security audits conducted annually.',
  },
];

export default function Security() {
  return (
    <section id="security" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <div className="paper-texture relative overflow-hidden rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 p-12">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-orange-600/10 blur-3xl"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h3 className="font-news relative mb-2 text-center text-3xl font-black text-white">
          Your Security is Our Priority
        </h3>
        <p className="relative mb-10 text-center text-gray-300">
          Enterprise-grade security to protect your information
        </p>
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {security.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <s.icon className="mx-auto h-10 w-10 text-orange-400" />
              <h4 className="mt-4 font-bold text-white">{s.title}</h4>
              <p className="mt-2 text-sm text-gray-300">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
