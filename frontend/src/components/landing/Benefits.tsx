'use client';
import { motion } from 'framer-motion';
import { MdVerifiedUser, MdSpeed, MdTrendingUp, MdAccessible } from 'react-icons/md';

const benefits = [
  {
    icon: MdVerifiedUser,
    title: 'Battle Misinformation',
    desc: 'Reduce the spread of false information with our AI-powered verification.',
  },
  {
    icon: MdSpeed,
    title: 'Save Time',
    desc: 'Get instant results instead of spending hours on manual research.',
  },
  {
    icon: MdTrendingUp,
    title: 'Boost Credibility',
    desc: 'Build trust with your audience by sharing verified information only.',
  },
  {
    icon: MdAccessible,
    title: 'Easy to Use',
    desc: 'No technical skills needed. Anyone can verify news in seconds.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <h3 className="font-news mb-4 text-center text-3xl font-black text-navy-900 dark:text-white">
        Why Choose VerifiNews?
      </h3>
      <p className="mb-10 text-center text-gray-600 dark:text-gray-400">
        Join thousands of journalists, creators, and fact-checkers worldwide
      </p>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="rounded-xl bg-gray-50 p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:bg-navy-800"
          >
            <b.icon className="h-10 w-10 text-orange-700" />
            <h4 className="mt-4 text-xl font-bold text-navy-900 dark:text-white">{b.title}</h4>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
