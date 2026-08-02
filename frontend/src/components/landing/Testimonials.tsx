'use client';
import { motion } from 'framer-motion';
import { MdStar } from 'react-icons/md';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Journalist',
    image: '/img/avatars/avatar1.png',
    content: 'VerifiNews has become an essential tool in my daily reporting. The AI is incredibly accurate.',
    rating: 5,
  },
  {
    name: 'Alex Chen',
    role: 'Content Creator',
    image: '/img/avatars/avatar2.png',
    content: 'I trust this platform to verify claims before I include them in my videos. Game changer!',
    rating: 5,
  },
  {
    name: 'Maria Garcia',
    role: 'Fact Checker',
    image: '/img/avatars/avatar3.png',
    content: 'The most efficient fact-checking tool I have used. Saves hours of research.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Media Manager',
    image: '/img/avatars/avatar4.png',
    content: 'Our entire team uses VerifiNews. Quality and reliability are unmatched.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <h3 className="font-news mb-10 text-center text-3xl font-black text-navy-900 dark:text-white">
        What Users Say
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow duration-300 hover:shadow-xl dark:border-navy-700 dark:bg-navy-800"
          >
            <div className="mb-4 flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-navy-900 dark:text-white">{t.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
            <div className="mb-3 flex gap-1">
              {Array.from({ length: t.rating }).map((_, j) => (
                <MdStar key={j} className="h-4 w-4 text-yellow-400" />
              ))}
            </div>
            <p className="italic text-gray-700 dark:text-gray-300">&ldquo;{t.content}&rdquo;</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
