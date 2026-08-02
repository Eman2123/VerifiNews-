/* eslint-disable */
'use client';

import { motion } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { FiShield } from 'react-icons/fi';
import Links from './components/Links';
import { useAuth } from 'contexts/AuthContext';

import { IRoute } from 'types/navigation';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  const { user } = useAuth();
  const initial = (user?.name || 'A').charAt(0).toUpperCase();

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex h-full w-[300px] min-h-full flex-col border-r border-navy-700/5 bg-white pb-6 shadow-2xl shadow-white/5 transition-all dark:border-white/10 dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? 'translate-x-0' : '-translate-x-96 xl:translate-x-0'
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer text-gray-500 transition hover:text-navy-700 dark:text-gray-300 dark:hover:text-white xl:hidden"
        onClick={() => setOpen(false)}
      >
        <HiX className="h-5 w-5" />
      </span>

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-8 pt-8"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-orange-500 shadow-sm dark:bg-orange-700 dark:text-white">
          <FiShield className="h-5 w-5" />
        </div>
        <div>
          <p
            className="text-lg font-bold leading-none text-navy-700 dark:text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            VerifiNews
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-gray-400">
            Admin Panel
          </p>
        </div>
      </motion.div>

      <div className="mx-8 mb-6 mt-6 h-px bg-gray-100 dark:bg-white/10" />

      {/* Nav item */}
      <ul className="mb-auto flex flex-col gap-1 px-4">
        <Links routes={routes} />
      </ul>
      {/* Nav item end */}

      {/* Footer — signed-in admin card */}
      <div className="mx-4 mt-6 flex items-center gap-3 rounded-xl border border-navy-700/5 bg-gray-50 px-3 py-3 dark:border-white/10 dark:bg-navy-900/50">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white dark:bg-orange-700">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-navy-700 dark:text-white">
            {user?.name || 'Admin'}
          </p>
          <p className="truncate text-[11px] text-gray-400">
            {user?.email || 'Administrator'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SidebarHorizon;