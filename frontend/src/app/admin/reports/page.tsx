'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from 'lib/api';

interface ReportItem {
  id: string;
  detection_id: string;
  user_id: string;
  reason: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'reviewed_correct', label: 'Model Was Correct', tone: 'green' },
  { value: 'reviewed_model_wrong', label: 'Model Was Wrong', tone: 'red' },
  { value: 'dismissed', label: 'Dismiss', tone: 'gray' },
] as const;

// ---------- Icons ----------
const IconFlag = () => (
  <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V4m0 0h13l-2 4 2 4H3" />
  </svg>
);

const IconAlertCircle = () => (
  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconXCircle = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconTrash = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconClipboardList = () => (
  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const IconSparkleCheck = () => (
  <svg className="mx-auto h-10 w-10 text-green-400 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconSpinner = () => (
  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const toneClasses: Record<string, string> = {
  green:
    'border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-900/20',
  red: 'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20',
  gray: 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-navy-600 dark:text-gray-300 dark:hover:bg-navy-700',
};

const toneIcon: Record<string, JSX.Element> = {
  green: <IconCheckCircle />,
  red: <IconXCircle />,
  gray: <IconTrash />,
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    api
      .get('/admin/reports', { params: { status: 'pending' } })
      .then((res) => setReports(res.data))
      .catch(() => setError('Could not load reports.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function review(id: string, status: string) {
    setBusyId(id);
    try {
      await api.patch(`/admin/reports/${id}`, { status });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Could not update report.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-3 relative font-news-body">
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-lg dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
          >
            <IconAlertCircle />
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
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
              Flagged Reports
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-300">
              Review user-flagged detections and confirm or dismiss them.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <IconFlag />
            <div>
              <p className="font-news text-xl font-black text-white">{reports.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-orange-300/80">Pending Review</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-navy-700 dark:bg-navy-800"
              >
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-navy-700" />
                <div className="mt-4 flex gap-2">
                  <div className="h-7 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-navy-700" />
                  <div className="h-7 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-navy-700" />
                  <div className="h-7 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-navy-700" />
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-green-300 bg-green-50/50 py-16 text-center dark:border-green-900/50 dark:bg-green-900/10"
          >
            <IconSparkleCheck />
            <p className="font-news text-lg font-bold text-navy-900 dark:text-white">All caught up</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">No pending reports right now.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {reports.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="rounded-2xl border border-gray-200 bg-[#faf6ee] p-5 shadow-lg transition hover:shadow-xl dark:border-navy-700 dark:bg-navy-800 dark:hover:border-navy-500"
                >
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <IconClipboardList />
                    Reported {new Date(r.created_at).toLocaleString()}
                  </div>
                  <p className="mt-2 text-sm text-navy-700 dark:text-white">
                    {r.reason || <span className="italic text-gray-400 dark:text-gray-500">No reason given</span>}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">Detection ID: {r.detection_id}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        disabled={busyId === r.id}
                        onClick={() => review(r.id, opt.value)}
                        className={`flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 dark:bg-navy-900 ${toneClasses[opt.tone]}`}
                      >
                        {busyId === r.id ? <IconSpinner /> : toneIcon[opt.tone]}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}