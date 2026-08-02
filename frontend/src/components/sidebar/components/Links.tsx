/* eslint-disable */
'use client';
import React from 'react';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import NavLink from 'components/link/NavLink';
import DashIcon from 'components/icons/DashIcon';
// chakra imports

export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
  // Chakra color mode
  const pathname = usePathname();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const createLinks = (routes: RoutesType[]) => {
    let visibleIndex = 0;
    return routes.map((route, index) => {
      if (
        route.layout === '/admin' ||
        route.layout === '/auth' ||
        route.layout === '/rtl' ||
        route.layout === '/dashboard'
      ) {
        const isActive = activeRoute(route.path);
        const delay = visibleIndex * 0.05;
        visibleIndex += 1;
        return (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay, ease: 'easeOut' }}
          >
            <NavLink href={route.layout + '/' + route.path}>
              <div
                className={`group relative flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-150 ${
                  isActive
                    ? 'bg-navy-900 shadow-sm dark:bg-orange-700'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-orange-500 dark:bg-white" />
                )}
                <span
                  className={`flex items-center justify-center transition-transform duration-150 group-hover:scale-105 ${
                    isActive
                      ? 'text-orange-400 dark:text-white'
                      : 'text-gray-400 group-hover:text-navy-700 dark:text-gray-400 dark:group-hover:text-white'
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon />}
                </span>
                <p
                  className={`text-sm leading-none ${
                    isActive
                      ? 'font-semibold text-white'
                      : 'font-medium text-gray-600 group-hover:text-navy-700 dark:text-gray-300 dark:group-hover:text-white'
                  }`}
                >
                  {route.name}
                </p>
              </div>
            </NavLink>
          </motion.li>
        );
      }
    });
  };
  // BRAND
  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;