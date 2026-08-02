import React from 'react';

import {
  MdHome,
  MdPeople,
  MdListAlt,
  MdFlag,
  MdPerson,
} from 'react-icons/md';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: 'users',
    icon: <MdPeople className="h-6 w-6" />,
  },
  {
    name: 'Detection Logs',
    layout: '/admin',
    path: 'logs',
    icon: <MdListAlt className="h-6 w-6" />,
  },
  {
    name: 'Flagged Reports',
    layout: '/admin',
    path: 'reports',
    icon: <MdFlag className="h-6 w-6" />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
  },
];

export default routes;
