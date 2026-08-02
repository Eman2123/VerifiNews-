'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Dropdown from 'components/dropdown';
import {
  FiAlignJustify,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiShield,
} from 'react-icons/fi';
import NavLink from 'components/link/NavLink';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { useAuth } from 'contexts/AuthContext';

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const { onOpenSidenav, brandText } = props;
  const { user, logout } = useAuth();
  const [darkmode, setDarkmode] = React.useState(false);

  React.useEffect(() => {
    setDarkmode(document.body.classList.contains('dark'));
  }, []);

  const initial = (user?.name || 'A').charAt(0).toUpperCase();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-4 z-40 flex items-center justify-between rounded-2xl border border-navy-700/5 bg-white/70 px-4 py-2.5 shadow-md shadow-shadow-500 backdrop-blur-xl dark:border-white/10 dark:bg-navy-800/70 dark:shadow-none"
    >
      {/* Left: sidenav toggle + brand title */}
      <div className="flex items-center gap-3">
        <span
          className="flex cursor-pointer items-center justify-center text-xl text-gray-600 transition hover:text-orange-700 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div className="flex items-center gap-2.5">
          <span className="hidden h-7 w-1 rounded-full bg-orange-700 sm:block" />
          <p
            className="text-lg font-bold capitalize leading-none text-navy-700 dark:text-white sm:text-xl"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {brandText}
          </p>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-700/10 bg-white text-gray-600 shadow-sm transition-colors duration-150 hover:border-orange-700/30 hover:text-orange-700 dark:border-white/10 dark:bg-navy-900 dark:text-gray-300 dark:hover:text-orange-400"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove('dark');
              setDarkmode(false);
            } else {
              document.body.classList.add('dark');
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4" />
          ) : (
            <RiMoonFill className="h-4 w-4" />
          )}
        </button>

        <div className="hidden h-8 w-px bg-navy-700/10 dark:bg-white/10 sm:block" />

        {/* Admin account menu */}
        <Dropdown
          button={
            <div className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-transparent py-1 pl-1 pr-2.5 transition-colors duration-150 hover:border-navy-700/10 hover:bg-white dark:hover:border-white/10 dark:hover:bg-navy-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-bold tracking-wide text-white ring-2 ring-white dark:bg-orange-700 dark:ring-navy-800">
                {initial}
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-semibold text-navy-700 dark:text-white">
                  {user?.name || 'Admin'}
                </p>
                <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <FiShield className="h-2.5 w-2.5" />
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <FiChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
            </div>
          }
          classNames={'py-2 top-12 -left-[180px] w-max'}
        >
          <div className="w-60 rounded-xl border border-navy-700/5 bg-white p-1.5 shadow-xl shadow-shadow-500 dark:border-white/10 dark:!bg-navy-700 dark:shadow-none">
            <div className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white dark:bg-orange-700">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy-700 dark:text-white">
                  {user?.name || 'Admin'}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="my-1.5 h-px w-full bg-gray-100 dark:bg-white/10" />

            <NavLink
              href="/admin/profile"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-navy-700 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <FiUser className="h-4 w-4 text-gray-400" />
              Profile Settings
            </NavLink>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <FiLogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </Dropdown>
      </div>
    </motion.nav>
  );
};

export default Navbar;