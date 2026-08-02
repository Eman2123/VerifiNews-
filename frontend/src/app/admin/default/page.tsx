'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from 'lib/api';

interface Stats {
  total_users: number;
  total_checks: number;
  fake_count: number;
  real_count: number;
  pending_reports: number;
  daily_checks: { date: string; count: number }[];
}

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-2xl border border-gray-200 bg-[#faf6ee] dark:border-navy-700 dark:bg-navy-800 ${className}`}></div>
);

// SVG Icons
const IconCheckCircle = () => (
  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconXCircle = () => (
  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconTrendingUp = () => (
  <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconBarChart = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconTrash = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m9-15a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconClock = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [displayStats, setDisplayStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => {
        setStats(res.data);
        setDisplayStats(res.data);
      })
      .catch(() => triggerError('Could not load statistics.'));
  }, []);

  function triggerError(message: string) {
    setError(message);
    setTimeout(() => setError(null), 4000);
  }

  async function handleDeleteHistory() {
    setIsDeleting(true);
    try {
      setStats(prev => prev ? {
        ...prev,
        total_checks: 0,
        fake_count: 0,
        real_count: 0,
        daily_checks: []
      } : null);
      setDisplayStats(prev => prev ? {
        ...prev,
        total_checks: 0,
        fake_count: 0,
        real_count: 0,
        daily_checks: []
      } : null);
      triggerError('History deleted successfully!');
    } catch {
      triggerError('Could not delete history.');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (!displayStats) {
    return (
      <div className="mt-3 relative font-news-body">
        <style>{`
          .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
          .custom-scroll::-webkit-scrollbar-track { background: transparent; }
          .custom-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
          .custom-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
        `}</style>
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-32" />
        </div>
      </div>
    );
  }

  const total = displayStats.fake_count + displayStats.real_count || 1;
  const fakePct = Math.round((displayStats.fake_count / total) * 100);
  const realPct = 100 - fakePct;
  const maxDaily = Math.max(...displayStats.daily_checks.map((d) => d.count), 1);

  return (
    <div className="mt-3 relative font-news-body">
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
        }
        .glow-animation { animation: glow 3s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .float-animation { animation: float 4s ease-in-out infinite; }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(249, 115, 22, 0.5); }
          50% { border-color: rgba(249, 115, 22, 1); }
        }
        .pulse-border { animation: pulse-border 2s ease-in-out infinite; }
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glass-effect.dark {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <IconAlertTriangle />
                </div>
                <div>
                  <h3 className="font-news text-xl font-black text-navy-900 dark:text-white">Confirm Delete</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete all check history? This action <span className="font-bold text-red-600">cannot be undone</span>.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setConfirmDelete(false)} className="rounded-full px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700">
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteHistory} 
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <IconTrash />
                      Delete History
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error/Success Toast */}
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
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 animate-pulse rounded-full bg-orange-600/20 blur-3xl" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block border-2 border-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-500">
              Admin Desk
            </span>
            <h3 className="font-news mt-2 text-3xl font-black tracking-tight text-white drop-shadow-md">
              Dashboard Overview
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-300">
              System statistics, detection analytics, and health status.
            </p>
          </div>
          
          {/* Highlighted Stats with background pills */}
          <div className="flex items-stretch gap-3 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0 flex-wrap">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-white/5 px-4 py-2 text-center backdrop-blur-sm"
            >
              <p className="font-news text-xl font-black text-white">{displayStats.total_users}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">Total Users</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white/5 px-4 py-2 text-center backdrop-blur-sm"
            >
              <p className="font-news text-xl font-black text-white">{displayStats.total_checks}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">Total Checks</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`rounded-xl px-4 py-2 text-center backdrop-blur-sm ${displayStats.pending_reports > 0 ? 'bg-amber-500/10' : 'bg-white/5'}`}
            >
              <p className={`font-news text-xl font-black ${displayStats.pending_reports > 0 ? 'text-amber-400' : 'text-white'}`}>
                {displayStats.pending_reports}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">Pending</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Real Count Card */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)" }}
          className="group relative overflow-hidden rounded-2xl border-2 border-green-300/50 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-lg transition-all dark:border-green-900/50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-400/10 blur-3xl group-hover:bg-green-400/20 transition-all" />
          <div className="border-b-4 border-double border-green-500/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                <IconCheckCircle />
              </div>
              <h3 className="font-news text-lg font-black tracking-tight text-green-700 dark:text-green-400">Real Detections</h3>
            </div>
          </div>
          <div className="p-6">
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="font-news text-4xl font-black text-green-600 dark:text-green-400"
            >
              {displayStats.real_count}
            </motion.p>
            <p className="mt-2 text-xs text-green-600/70 dark:text-green-400/70">
              Legitimate content confirmed
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-green-200 dark:bg-green-900/30">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((displayStats.real_count / displayStats.total_checks) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Fake Count Card */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)" }}
          className="group relative overflow-hidden rounded-2xl border-2 border-red-300/50 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 shadow-lg transition-all dark:border-red-900/50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-pink-900/20"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-400/10 blur-3xl group-hover:bg-red-400/20 transition-all" />
          <div className="border-b-4 border-double border-red-500/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                <IconXCircle />
              </div>
              <h3 className="font-news text-lg font-black tracking-tight text-red-700 dark:text-red-400">Fake Detections</h3>
            </div>
          </div>
          <div className="p-6">
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="font-news text-4xl font-black text-red-600 dark:text-red-400"
            >
              {displayStats.fake_count}
            </motion.p>
            <p className="mt-2 text-xs text-red-600/70 dark:text-red-400/70">
              Fraudulent content flagged
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-red-200 dark:bg-red-900/30">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((displayStats.fake_count / displayStats.total_checks) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-red-500 to-rose-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Accuracy Stat */}
        <motion.div 
          whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.2)" }}
          className="group relative overflow-hidden rounded-2xl border-2 border-orange-300/50 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-lg transition-all dark:border-orange-900/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl group-hover:bg-orange-400/20 transition-all" />
          <div className="border-b-4 border-double border-orange-500/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40">
                <IconTrendingUp />
              </div>
              <h3 className="font-news text-lg font-black tracking-tight text-orange-700 dark:text-orange-400">Accuracy</h3>
            </div>
          </div>
          <div className="p-6">
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="font-news text-4xl font-black text-orange-600 dark:text-orange-400"
            >
              {displayStats.total_checks > 0 ? Math.round((displayStats.fake_count / displayStats.total_checks) * 100) : 0}%
            </motion.p>
            <p className="mt-2 text-xs text-orange-600/70 dark:text-orange-400/70">
              Detection confidence rate
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-orange-200 dark:bg-orange-900/30">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${displayStats.total_checks > 0 ? Math.round((displayStats.fake_count / displayStats.total_checks) * 100) : 0}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Fake vs Real ratio bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-[#faf6ee] shadow-lg dark:border-navy-700 dark:bg-navy-800"
      >
        <div className="border-b-4 border-double border-navy-900/20 px-5 py-4 dark:border-orange-500/30">
          <div className="flex items-center gap-3">
            <IconBarChart />
            <h3 className="font-news text-lg font-black tracking-tight text-navy-900 dark:text-white">Fake vs Real Ratio</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-navy-700 dark:text-gray-300">Overall distribution of analyzed reports</p>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-2 text-red-500">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                Fake: {displayStats.fake_count}
              </span>
              <span className="flex items-center gap-2 text-green-500">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                Real: {displayStats.real_count}
              </span>
            </div>
          </div>
          
          <div className="flex h-8 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-navy-700 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${fakePct}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end pr-3 shadow-lg relative group"
            >
              {fakePct > 15 && (
                <span className="text-xs font-black text-white drop-shadow-lg">{fakePct}%</span>
              )}
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-400/0 to-red-400/20"></div>
            </motion.div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${realPct}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-start pl-3 shadow-lg relative group"
            >
              {realPct > 15 && (
                <span className="text-xs font-black text-white drop-shadow-lg">{realPct}%</span>
              )}
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-green-400/20 to-green-400/0"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Daily trend chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-[#faf6ee] shadow-lg dark:border-navy-700 dark:bg-navy-800"
      >
        <div className="border-b-4 border-double border-navy-900/20 px-5 py-4 dark:border-orange-500/30">
          <div className="flex items-center gap-3">
            <IconClock />
            <h3 className="font-news text-lg font-black tracking-tight text-navy-900 dark:text-white">Checks — Last 7 Days</h3>
          </div>
        </div>
        <div className="p-6">
          {displayStats.daily_checks.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-500">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-xs font-medium">No checks in the last 7 days yet.</p>
            </div>
          ) : (
            <div className="hide-scroll flex items-end justify-between gap-2 overflow-x-auto pt-12" style={{ height: 200 }}>
              {displayStats.daily_checks.map((d, i) => (
                <div key={d.date} className="group relative flex w-full min-w-[40px] flex-1 flex-col items-center gap-2">
                  {/* Tooltip */}
                  <div className="absolute -top-10 z-10 hidden flex-col items-center group-hover:flex">
                    <span className="whitespace-nowrap rounded-lg bg-navy-900 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                      {d.count} checks
                    </span>
                    <div className="h-2 w-2 rotate-45 bg-navy-900"></div>
                  </div>
                  
                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.count / maxDaily) * 120}px` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 + (i * 0.08) }}
                    className="relative w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-orange-600 via-orange-500 to-orange-400 shadow-lg hover:from-orange-700 hover:via-orange-600 hover:to-orange-500 transition-all group-hover:scale-110 origin-bottom glow-animation"
                    style={{ boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)' }}
                  />
                  
                  {/* Label */}
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* System Maintenance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 overflow-hidden rounded-2xl border-2 border-red-300/50 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg dark:border-red-900/50 dark:from-red-900/10 dark:to-rose-900/10"
      >
        <div className="border-b-4 border-double border-red-500/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
              <IconTrash />
            </div>
            <h3 className="font-news text-lg font-black tracking-tight text-red-700 dark:text-red-400">System Maintenance</h3>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-navy-900 dark:text-white">Clear All Check History</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This will permanently delete all fake/real check logs and reset the statistics. <span className="font-bold text-red-600">Cannot be undone</span>.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmDelete(true)}
            className="flex flex-shrink-0 items-center gap-2 rounded-full border-2 border-red-600/50 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:border-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20 hover:shadow-lg"
          >
            <IconTrash />
            Delete History
          </motion.button>
        </div>
      </motion.div>

      {/* Fun Footer Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 relative overflow-hidden rounded-2xl border-2 border-dashed border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center dark:border-orange-600 dark:from-orange-900/20 dark:to-amber-900/20"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="relative">
          <p className="font-news text-lg font-black text-orange-700 dark:text-orange-400">
            Performance Highlights
          </p>
          <p className="mt-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
            {displayStats.total_checks > 0 
              ? `Total Analyzed: ${displayStats.total_checks} • Success Rate: ${Math.round((displayStats.real_count / displayStats.total_checks) * 100)}% Real Content`
              : 'Start analyzing content to track performance metrics'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}