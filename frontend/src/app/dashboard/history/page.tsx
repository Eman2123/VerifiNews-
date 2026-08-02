'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from 'lib/api';
import { MdSearch, MdDeleteOutline, MdClose } from 'react-icons/md';

interface HistoryItem {
  id: string;
  input_text: string;
  input_type: string;
  result_label: 'real' | 'fake';
  confidence: number;
  created_at: string;
}

type FilterKey = 'all' | 'real' | 'fake';

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  // Row-level delete state
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Clear-all state
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  function loadHistory() {
    setLoading(true);
    setError(null);
    api
      .get('/history')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load your history right now.'))
      .finally(() => setLoading(false));
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteError(null);
    const previous = items;
    // Optimistic removal
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await api.delete(`/history/${id}`);
    } catch {
      // Roll back on failure
      setItems(previous);
      setDeleteError('Could not delete that entry. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  async function handleClearAll() {
    setClearingAll(true);
    setDeleteError(null);
    const previous = items;
    setItems([]);
    try {
      await api.delete('/history');
    } catch {
      setItems(previous);
      setDeleteError('Could not clear your history. Please try again.');
    } finally {
      setClearingAll(false);
      setConfirmClearAll(false);
    }
  }

  const total = items.length;
  const fakeCount = items.filter((i) => i.result_label === 'fake').length;
  const realCount = total - fakeCount;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter !== 'all' && item.result_label !== filter) return false;
      if (search.trim() && !item.input_text.toLowerCase().includes(search.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [items, filter, search]);

  return (
    <div className="mx-auto mt-3 max-w-3xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-double border-navy-900/10 pb-6 dark:border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            Members Desk
          </span>
          <h3 className="font-news mt-2 text-3xl font-black text-navy-900 dark:text-white sm:text-4xl">
            Your Checks
          </h3>
          <p className="font-news-body mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Every story you&rsquo;ve sent through the desk, and the verdict it came back with.
          </p>
        </div>

        {!loading && !error && total > 0 && (
          <button
            onClick={() => setConfirmClearAll(true)}
            className="flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
          >
            <MdDeleteOutline className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {deleteError && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {deleteError}
          <button onClick={() => setDeleteError(null)} aria-label="Dismiss">
            <MdClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {!loading && !error && total > 0 && (
        <div className="mb-6 grid grid-cols-3 divide-x divide-navy-900/10 overflow-hidden rounded-xl border border-navy-900/10 bg-white dark:divide-white/10 dark:border-navy-700 dark:bg-navy-800">
          <div className="px-4 py-4 text-center">
            <p className="font-news text-2xl font-black text-navy-900 dark:text-white">{total}</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Total checked
            </p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="font-news text-2xl font-black text-green-700">{realCount}</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Verified
            </p>
          </div>
          <div className="px-4 py-4 text-center">
            <p className="font-news text-2xl font-black text-red-600">{fakeCount}</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Flagged fake
            </p>
          </div>
        </div>
      )}

      {!loading && !error && total > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <MdSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your checked stories..."
              className="font-news-body w-full rounded-full border-2 border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-navy-900 outline-none transition placeholder:text-gray-400 focus:border-orange-600 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'real', 'fake'] as FilterKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                  filter === key
                    ? 'bg-orange-700 text-white'
                    : 'border border-navy-900/10 text-navy-700 hover:bg-navy-900/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5'
                }`}
              >
                {key === 'all' ? 'All' : key === 'real' ? 'Verified' : 'Fake'}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-navy-900/10 bg-white/60 dark:border-navy-700 dark:bg-navy-800/60"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && total === 0 && (
        <div className="rounded-xl border-2 border-dashed border-navy-900/15 bg-white/60 p-10 text-center dark:border-white/15 dark:bg-navy-800/40">
          <p className="font-news text-lg font-bold text-navy-900 dark:text-white">
            No checks on file yet
          </p>
          <p className="font-news-body mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            You haven&rsquo;t checked any news yet — head to Detect News to run your first check.
          </p>
          <Link
            href="/dashboard/default"
            className="mt-5 inline-block rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-orange-800"
          >
            Check a Story
          </Link>
        </div>
      )}

      {!loading && !error && total > 0 && filteredItems.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-navy-900/15 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-navy-800/40">
          <p className="font-news-body text-sm text-gray-500 dark:text-gray-400">
            No checks match your search or filter.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filteredItems.map((item) => {
          const isFake = item.result_label === 'fake';
          const isConfirming = confirmId === item.id;
          const isDeleting = deletingId === item.id;
          return (
            <div
              key={item.id}
              className={`group flex items-center justify-between gap-4 rounded-xl border-l-4 border-y border-r border-navy-900/10 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-y-navy-700 dark:border-r-navy-700 dark:bg-navy-800 ${
                isFake ? 'border-l-red-500' : 'border-l-green-600'
              } ${isDeleting ? 'opacity-50' : ''}`}
            >
              <div className="min-w-0 pr-4">
                <p className="font-news-body mb-1 truncate text-sm text-gray-700 dark:text-gray-200 sm:whitespace-normal sm:overflow-visible">
                  {item.input_text.length > 140
                    ? item.input_text.slice(0, 140) + '…'
                    : item.input_text}
                </p>
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString()} · {item.input_type}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-md border-2 border-double px-3 py-1 text-xs font-black uppercase tracking-wide ${
                    isFake ? 'border-red-600 text-red-600' : 'border-green-700 text-green-700'
                  }`}
                >
                  {isFake ? 'Fake' : 'Verified'} · {item.confidence}%
                </span>

                {!isConfirming ? (
                  <button
                    onClick={() => setConfirmId(item.id)}
                    disabled={isDeleting}
                    aria-label="Delete this entry"
                    title="Delete this entry"
                    className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                  >
                    <MdDeleteOutline className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? '...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      disabled={isDeleting}
                      className="rounded-full border border-navy-900/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500 transition hover:bg-navy-900/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear-all confirmation modal */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-navy-900/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-navy-900/10 bg-white p-6 shadow-xl dark:border-navy-700 dark:bg-navy-800">
            <h4 className="font-news text-lg font-bold text-navy-900 dark:text-white">
              Clear your entire history?
            </h4>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This will permanently delete all {total} checked stories. This can&rsquo;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmClearAll(false)}
                disabled={clearingAll}
                className="rounded-xl border border-navy-900/10 px-4 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-900/5 disabled:opacity-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {clearingAll ? 'Clearing…' : 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
