'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from 'lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

type SortKey = 'name' | 'email' | 'role' | 'status' | 'created_at';
const ITEMS_PER_PAGE = 8;

// Helper to generate consistent colors for avatars
const colorClasses = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 
  'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
];

function getInitials(name: string) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function getColorFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorClasses[Math.abs(hash) % colorClasses.length];
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc',
  });

  const [confirmAction, setConfirmAction] = useState<AdminUser | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => triggerError('Could not load users.'))
      .finally(() => setLoading(false));
  }

  function triggerError(message: string) {
    setError(message);
  }

  useEffect(load, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  async function executeStatusToggle(u: AdminUser) {
    setBusyId(u.id);
    const newStatus = u.status === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/users/${u.id}`, { status: newStatus });
      setUsers((prev) => prev.map((user) => (user.id === u.id ? { ...user, status: newStatus } : user)));
    } catch {
      triggerError('Could not update user status.');
    } finally {
      setBusyId(null);
      setConfirmAction(null);
    }
  }

  async function toggleRole(u: AdminUser) {
    setBusyId(u.id);
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/admin/users/${u.id}`, { role: newRole });
      setUsers((prev) => prev.map((user) => (user.id === u.id ? { ...user, role: newRole } : user)));
    } catch {
      triggerError('Could not update user role.');
    } finally {
      setBusyId(null);
      setOpenMenuId(null);
    }
  }

  const activeCount = users.filter((u) => u.status === 'active').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const processedUsers = useMemo(() => {
    let result = [...users];

    if (filter === 'active') result = result.filter((u) => u.status === 'active');
    if (filter === 'suspended') result = result.filter((u) => u.status === 'suspended');
    if (filter === 'admin') result = result.filter((u) => u.role === 'admin');

    if (searchQuery) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'created_at') {
        valA = new Date(valA).getTime().toString();
        valB = new Date(valB).getTime().toString();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, filter, searchQuery, sortConfig]);

  const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <span className="opacity-30 ml-1">↕</span>;
    return sortConfig.direction === 'asc' ? <span className="text-orange-500 ml-1">↑</span> : <span className="text-orange-500 ml-1">↓</span>;
  };

  const filterPills = [
    { key: 'all', label: 'All Users', count: users.length },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'suspended', label: 'Suspended', count: users.length - activeCount },
    { key: 'admin', label: 'Admins', count: adminCount },
  ] as const;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Status", "Joined"];
    const rows = processedUsers.map(u => [
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${new Date(u.created_at).toLocaleDateString()}"`
    ]);
    const csv = [headers.join(','), ...rows.join('\n')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-3 relative font-news-body">
      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
        .dark .custom-scroll::-webkit-scrollbar-thumb { background: #475569; }
        .dark .custom-scroll::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmAction(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-800"
            >
              <h3 className="font-news text-xl font-black text-navy-900 dark:text-white">Confirm Action</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to {confirmAction.status === 'active' ? 'suspend' : 'reactivate'}{' '}
                <span className="font-bold text-navy-900 dark:text-white">{confirmAction.name}</span>?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setConfirmAction(null)} className="rounded-full px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700">
                  Cancel
                </button>
                <button onClick={() => executeStatusToggle(confirmAction)} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">
                  {confirmAction.status === 'active' ? 'Suspend' : 'Reactivate'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-lg dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">!</span>
            {error}
            <button onClick={load} className="ml-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white hover:bg-red-700">
              Try Again
            </button>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masthead */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="paper-texture relative overflow-hidden rounded-2xl border border-navy-900/10 bg-navy-900 px-6 py-6 shadow-lg dark:border-white/10"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-pulse rounded-full bg-orange-600/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block border-2 border-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-500">
              Admin Desk
            </span>
            <h3 className="font-news mt-2 text-3xl font-black tracking-tight text-white drop-shadow-md">
              Users
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-300">
              Manage every registered account, its role and standing.
            </p>
          </div>
          
          {/* Highlighted Stats with background pills for better visibility */}
          <div className="flex items-stretch gap-3 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0">
            <div className="rounded-xl bg-white/5 px-4 py-2 text-center backdrop-blur-sm">
              <p className="font-news text-xl font-black text-white">{users.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">Total</p>
            </div>
            <div className="rounded-xl bg-green-500/10 px-4 py-2 text-center backdrop-blur-sm">
              <p className="font-news text-xl font-black text-green-400">{activeCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-green-300/80">Active</p>
            </div>
            <div className="rounded-xl bg-orange-500/10 px-4 py-2 text-center backdrop-blur-sm">
              <p className="font-news text-xl font-black text-orange-400">{adminCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-orange-300/80">Admins</p>
            </div>
            <button onClick={exportToCSV} className="ml-1 flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-navy-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setFilter(pill.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                filter === pill.key
                  ? 'bg-navy-900 text-white dark:bg-orange-500 dark:text-navy-900'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 dark:bg-navy-800 dark:border-navy-700 dark:text-gray-300 dark:hover:border-navy-500'
              }`}
            >
              {pill.label}
              <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] ${
                filter === pill.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-navy-700'
              }`}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search box — solid dark bg so it never falls back to white in dark mode */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 dark:!bg-navy-900 dark:!border-navy-700 dark:focus-within:border-orange-500/60 dark:focus-within:ring-orange-900/20 md:w-64"
        >
          <svg className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
              type="text"
              placeholder="Search users..."
              className="rounded-lg border border-gray-300 dark:border-navy-600 px-4 py-2 text-sm bg-white dark:bg-navy-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
            />
        </motion.div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center justify-between rounded-xl bg-navy-900 px-4 py-3 text-white dark:bg-orange-500 dark:text-navy-900"
          >
            <span className="text-sm font-bold">{selectedIds.length} user(s) selected</span>
            <div className="flex gap-2">
              <button className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 dark:bg-navy-900/10 dark:hover:bg-navy-900/20">
                Bulk Suspend
              </button>
              <button className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 dark:bg-navy-900/10 dark:hover:bg-navy-900/20">
                Bulk Make Admin
              </button>
              <button onClick={() => setSelectedIds([])} className="text-xs font-bold underline">
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Area - Fixed Scrolling Structure */}
      <div className="mt-4 flex flex-col rounded-2xl border border-gray-200 bg-[#faf6ee] shadow-lg dark:border-navy-700 dark:bg-navy-800">
        <div className="custom-scroll max-h-[65vh] overflow-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-20 border-b-4 border-double border-navy-900/20 bg-[#f3edd6] text-[11px] font-bold uppercase tracking-widest text-navy-800 dark:border-orange-500/30 dark:bg-navy-900/95 dark:text-gray-100 backdrop-blur-sm">
              <tr>
                <th className="p-4 w-8">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-500 dark:border-navy-500 dark:bg-navy-800"
                  />
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500" onClick={() => requestSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500 hidden md:table-cell" onClick={() => requestSort('email')}>
                  Email {getSortIcon('email')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500" onClick={() => requestSort('role')}>
                  Role {getSortIcon('role')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500" onClick={() => requestSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500 hidden lg:table-cell" onClick={() => requestSort('created_at')}>
                  Joined {getSortIcon('created_at')}
                </th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            
            <AnimatePresence mode="popLayout">
              {loading ? (
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="border-b border-navy-900/5 dark:border-white/5">
                      <td className="p-4"><div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4 hidden md:table-cell"><div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4 hidden lg:table-cell"><div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="ml-auto h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-navy-700"></div></td>
                    </tr>
                  ))}
                </tbody>
              ) : paginatedUsers.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <p className="font-news text-lg font-bold text-navy-900 dark:text-white">No users found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <AnimatePresence>
                    {paginatedUsers.map((u) => (
                      <motion.tr
                        key={u.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border-b border-navy-900/5 transition hover:bg-gray-50 dark:border-white/5 dark:hover:bg-navy-700/40 ${
                          selectedIds.includes(u.id) ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(u.id)}
                            onChange={() => handleSelectOne(u.id)}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-500 dark:border-navy-500 dark:bg-navy-800"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getColorFromString(u.name)}`}>
                              {getInitials(u.name)}
                            </div>
                            <span className="font-news-body font-bold text-navy-900 dark:text-white">
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-navy-700 dark:text-gray-300 hidden md:table-cell">{u.email}</td>
                        <td className="p-4">
                          {/* Badge backgrounds added for contrast */}
                          <span className={`rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
                            u.role === 'admin' 
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                              : 'bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
                            u.status === 'active' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 relative">
                          <div className="flex justify-end">
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                              className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-navy-700"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            
                            <AnimatePresence>
                              {openMenuId === u.id && (
                                <>
                                  {/* Invisible backdrop to close menu on outside click */}
                                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                  
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-4 top-12 z-20 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-2xl dark:border-navy-700 dark:bg-navy-800"
                                  >
                                    <button 
                                      onClick={() => { setConfirmAction(u); setOpenMenuId(null); }} 
                                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-navy-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-navy-700"
                                    >
                                      {u.status === 'active' ? (
                                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" /></svg>
                                      ) : (
                                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      )}
                                      {u.status === 'active' ? 'Suspend User' : 'Reactivate'}
                                    </button>
                                    <button 
                                      onClick={() => toggleRole(u)} 
                                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-navy-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-navy-700"
                                    >
                                      {u.role === 'admin' ? (
                                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                      ) : (
                                        <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                      )}
                                      {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              )}
            </AnimatePresence>
          </table>
        </div>

        {/* Pagination Footer - Kept outside the scroll div so it's always visible */}
        {!loading && processedUsers.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-3 dark:border-navy-700 dark:bg-navy-800">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Showing <span className="text-navy-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="text-navy-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, processedUsers.length)}</span> of{" "}
              <span className="text-navy-900 dark:text-white">{processedUsers.length}</span>
            </p>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-700"
              >
                Prev
              </button>
              {[...Array(totalPages)].slice(0, 5).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold ${
                    currentPage === i + 1 
                      ? 'bg-navy-900 text-white dark:bg-orange-500 dark:text-navy-900' 
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}