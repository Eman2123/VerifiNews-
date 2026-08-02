'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from 'lib/api';

interface Log {
  id: string;
  user_id: string;
  input_text: string;
  input_type: string;
  result_label: 'real' | 'fake';
  confidence: number;
  created_at: string;
}

type SortKey = 'input_text' | 'input_type' | 'result_label' | 'confidence' | 'created_at';
const ITEMS_PER_PAGE = 8;

// Cheesy taglines that rotate under the masthead subtitle
const CHEESY_TAGLINES = [
  "Separating fact from fiction, one log at a time",
  "Our AI has trust issues (in a good way)",
  "Fake news doesn't stand a chance here",
  "Confidence scores so precise, they blush",
  "Where truth clocks in and lies clock out",
];

// Cheesy summary lines for the footer, picked based on stats
function getCheesySummary(realCount: number, fakeCount: number, avgConfidence: number) {
  const lines = [
    `We caught ${fakeCount} fibber${fakeCount === 1 ? '' : 's'} red-handed`,
    `${realCount} truth${realCount === 1 ? '' : 's'} verified, zero drama added`,
    `Running at ${avgConfidence}% confidence — basically a fortune teller, but with math`,
    `Fake news fears us. Real news high-fives us`,
    `Detective mode: engaged. Nonsense: rejected`,
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// SVG Icons
const IconCheckCircle = () => (
  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconXCircle = () => (
  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconSearch = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconFilter = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const IconChevronDown = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const IconCopy = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const IconDownload = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconAlertCircle = () => (
  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconShieldCheck = () => (
  <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'real' | 'fake'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc',
  });

  // Pick one cheesy tagline per mount so it doesn't flicker on every re-render
  const [tagline] = useState(
    () => CHEESY_TAGLINES[Math.floor(Math.random() * CHEESY_TAGLINES.length)]
  );

  function load() {
    setLoading(true);
    setError(null);
    api
      .get('/admin/logs')
      .then((res) => setLogs(res.data))
      .catch(() => triggerError('Could not load logs.'))
      .finally(() => setLoading(false));
  }

  function triggerError(message: string) {
    setError(message);
  }

  useEffect(load, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const realCount = logs.filter((l) => l.result_label === 'real').length;
  const fakeCount = logs.filter((l) => l.result_label === 'fake').length;

  const processedLogs = useMemo(() => {
    let result = [...logs];

    if (filter === 'real') result = result.filter((l) => l.result_label === 'real');
    if (filter === 'fake') result = result.filter((l) => l.result_label === 'fake');

    if (searchQuery) {
      result = result.filter(
        (l) =>
          l.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.input_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'created_at') {
        valA = new Date(valA as string).getTime().toString();
        valB = new Date(valB as string).getTime().toString();
      }

      if (sortConfig.key === 'confidence') {
        valA = (valA as number).toString();
        valB = (valB as number).toString();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [logs, filter, searchQuery, sortConfig]);

  const totalPages = Math.ceil(processedLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = processedLogs.slice(
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
    { key: 'all', label: 'All Logs', count: logs.length },
    { key: 'real', label: 'Real', count: realCount },
    { key: 'fake', label: 'Fake', count: fakeCount },
  ] as const;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedLogs.map(l => l.id));
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

  const avgConfidence = processedLogs.length > 0
    ? Math.round(processedLogs.reduce((acc, log) => acc + log.confidence, 0) / processedLogs.length)
    : 0;

  // Shared CSV builder so both "Export All" and "Download selected" use the same shape
  function buildCSV(rowsSource: Log[]) {
    const headers = ["Input", "Type", "Result", "Confidence", "Date"];
    const rows = rowsSource.map(l => [
      `"${l.input_text.replace(/"/g, '""')}"`,
      `"${l.input_type}"`,
      `"${l.result_label}"`,
      `"${l.confidence}%"`,
      `"${new Date(l.created_at).toLocaleString()}"`,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  function downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const exportToCSV = () => {
    downloadCSV(buildCSV(processedLogs), 'detection_logs_export.csv');
  };

  // Wired up "Download" button in the bulk actions bar
  const handleDownloadSelected = () => {
    if (selectedIds.length === 0) return;
    const selectedLogs = logs.filter((l) => selectedIds.includes(l.id));
    downloadCSV(buildCSV(selectedLogs), `detection_logs_selected_${selectedLogs.length}.csv`);
    setDownloadToast(`Downloaded ${selectedLogs.length} log(s)`);
    setTimeout(() => setDownloadToast(null), 2500);
  };

  return (
    <div className="mt-3 relative font-news-body">
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
        .glow-real { animation: glow 3s ease-in-out infinite; }
        @keyframes glow-fake {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
        }
        .glow-fake { animation: glow-fake 3s ease-in-out infinite; }
      `}</style>

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

      {/* Download Toast */}
      <AnimatePresence>
        {downloadToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-lg dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
          >
            <IconDownload />
            {downloadToast}
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
              Detection Logs
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-300">
              Track all analysis results, confidence scores, and detection history.
            </p>
            <p className="mt-1 text-[11px] italic font-medium text-orange-300/80">
              {tagline}
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
              <p className="font-news text-xl font-black text-white">{logs.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">Total Logs</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-green-500/10 px-4 py-2 text-center backdrop-blur-sm"
            >
              <p className="font-news text-xl font-black text-green-400">{realCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-green-300/80">Real</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-red-500/10 px-4 py-2 text-center backdrop-blur-sm"
            >
              <p className="font-news text-xl font-black text-red-400">{fakeCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-red-300/80">Fake</p>
            </motion.div>
            <button onClick={exportToCSV} className="ml-1 flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-navy-900">
              <IconDownload />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterPills.map((pill) => (
            <motion.button
              key={pill.key}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(pill.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                filter === pill.key
                  ? 'bg-navy-900 text-white dark:bg-orange-500 dark:text-navy-900 shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 dark:bg-navy-800 dark:border-navy-700 dark:text-gray-300'
              }`}
            >
              <IconFilter />
              {pill.label}
              <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] ${
                filter === pill.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-navy-700'
              }`}>
                {pill.count}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-navy-700 dark:bg-navy-800 md:w-64"
        >
          <IconSearch />
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
            <span className="text-sm font-bold">{selectedIds.length} log(s) selected</span>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadSelected}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20 dark:bg-navy-900/10 dark:hover:bg-navy-900/20"
              >
                <IconDownload />
                Download
              </button>
              <button onClick={() => setSelectedIds([])} className="text-xs font-bold underline">
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Area */}
      <div className="mt-4 flex flex-col rounded-2xl border border-gray-200 bg-[#faf6ee] shadow-lg dark:border-navy-700 dark:bg-navy-800">
        <div className="custom-scroll max-h-[65vh] overflow-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-20 border-b-4 border-double border-navy-900/20 bg-[#f3edd6] text-[11px] font-bold uppercase tracking-widest text-navy-800 dark:border-orange-500/30 dark:bg-navy-900/95 dark:text-gray-100 backdrop-blur-sm">
              <tr>
                <th className="p-4 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500" onClick={() => requestSort('input_text')}>
                  Input {getSortIcon('input_text')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500 hidden md:table-cell" onClick={() => requestSort('input_type')}>
                  Type {getSortIcon('input_type')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500" onClick={() => requestSort('result_label')}>
                  Result {getSortIcon('result_label')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500" onClick={() => requestSort('confidence')}>
                  Confidence {getSortIcon('confidence')}
                </th>
                <th className="p-4 cursor-pointer select-none hover:text-orange-500 hidden lg:table-cell" onClick={() => requestSort('created_at')}>
                  Date {getSortIcon('created_at')}
                </th>
                <th className="p-4 text-right">Expand</th>
              </tr>
            </thead>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="border-b border-navy-900/5 dark:border-white/5">
                      <td className="p-4"><div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4 hidden md:table-cell"><div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4 hidden lg:table-cell"><div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-navy-700"></div></td>
                      <td className="p-4"><div className="ml-auto h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-navy-700"></div></td>
                    </tr>
                  ))}
                </tbody>
              ) : paginatedLogs.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="font-news text-lg font-bold text-navy-900 dark:text-white">No logs found</p>
                        <p className="text-sm text-gray-500">Try adjusting your search or filter.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <AnimatePresence>
                    {paginatedLogs.map((log) => (
                      <motion.tr
                        key={log.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border-b border-navy-900/5 transition hover:bg-gray-50 dark:border-white/5 dark:hover:bg-navy-700/40 ${
                          selectedIds.includes(log.id) ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(log.id)}
                            onChange={() => handleSelectOne(log.id)}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                        </td>
                        <td className="p-4 font-medium text-navy-700 dark:text-gray-300 max-w-xs truncate">
                          {log.input_text}
                        </td>
                        <td className="p-4 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-navy-700">
                            {log.input_type}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {log.result_label === 'real' ? <IconCheckCircle /> : <IconXCircle />}
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
                              log.result_label === 'fake'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {log.result_label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-6 bg-gray-100 dark:bg-navy-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${log.confidence}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full ${log.result_label === 'fake' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}
                              />
                            </div>
                            <span className="text-xs font-bold text-navy-900 dark:text-white w-10">{log.confidence}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-navy-700"
                          >
                            <motion.div
                              animate={{ rotate: expandedId === log.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <IconChevronDown />
                            </motion.div>
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              )}
            </AnimatePresence>
          </table>

          {/* Expandable Details Rows */}
          <AnimatePresence>
            {paginatedLogs.map((log) => (
              expandedId === log.id && (
                <motion.div
                  key={`details-${log.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-orange-50 dark:bg-orange-900/10 border-b border-navy-900/5 dark:border-white/5"
                >
                  <div className="p-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Input Details */}
                      <div className="rounded-xl border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-navy-800/50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Input Text</p>
                        <p className="text-sm text-navy-900 dark:text-white break-words leading-relaxed">
                          {log.input_text}
                        </p>
                        <button className="mt-3 flex items-center gap-2 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-100 px-2 py-1 dark:text-orange-400 dark:hover:bg-orange-900/20">
                          <IconCopy />
                          Copy
                        </button>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-3">
                        <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Input Type</p>
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">{log.input_type}</p>
                        </div>

                        <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2">Log ID</p>
                          <p className="text-xs font-mono text-purple-900 dark:text-purple-400 truncate">{log.id}</p>
                        </div>

                        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/10 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Created</p>
                          <p className="text-xs text-indigo-900 dark:text-indigo-400">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Footer */}
        {!loading && processedLogs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-3 dark:border-navy-700 dark:bg-navy-800">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Showing <span className="text-navy-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="text-navy-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, processedLogs.length)}</span> of{" "}
              <span className="text-navy-900 dark:text-white">{processedLogs.length}</span>
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-700"
              >
                Prev
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
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

      {/* Stats Footer - Cheezy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 relative overflow-hidden rounded-2xl border-2 border-dashed border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 p-6 dark:border-orange-600 dark:from-orange-900/20 dark:to-amber-900/20"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="relative">
          <p className="flex items-center gap-2 font-news text-lg font-black text-orange-700 dark:text-orange-400">
            <IconShieldCheck />
            Detection Summary
          </p>
          <p className="mt-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
            {processedLogs.length > 0
              ? `Analyzed ${processedLogs.length} logs • Average Confidence: ${avgConfidence}% • Real: ${realCount} • Fake: ${fakeCount}`
              : 'No logs available yet'}
          </p>
          {processedLogs.length > 0 && (
            <p className="mt-1 text-xs italic font-medium text-orange-500/80 dark:text-orange-400/70">
              {getCheesySummary(realCount, fakeCount, avgConfidence)}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}