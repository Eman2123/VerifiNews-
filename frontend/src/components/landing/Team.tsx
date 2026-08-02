'use client';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const team = [
  { name: 'Ayesha Raza', role: 'Editor in Chief', image: '/img/avatars/avatar5.png' },
  { name: 'Daniel Osei', role: 'Lead ML Engineer', image: '/img/avatars/avatar6.png' },
  { name: 'Priya Nair', role: 'Head of Fact-Checking', image: '/img/avatars/avatar7.png' },
  { name: 'Marcus Lee', role: 'Product Designer', image: '/img/avatars/avatar8.png' },
];

export default function Team() {
  return (
    <section id="team" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
      <h3 className="font-news mb-3 text-center text-3xl font-black text-navy-900 dark:text-white">
        Meet the Newsroom
      </h3>
      <p className="mb-10 text-center text-gray-600 dark:text-gray-400">
        A small team of journalists and engineers keeping the model honest.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <TiltCard strength={6} className="rounded-xl">
              <div className="rounded-xl border border-gray-200 bg-[#faf6ee] p-6 text-center dark:border-navy-700 dark:bg-navy-800">
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-20 w-20 rounded-full border-2 border-orange-600/40 object-cover"
                />
                <h4 className="mt-4 font-bold text-navy-900 dark:text-white">{member.name}</h4>
                <p className="mt-1 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {member.role}
                </p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
