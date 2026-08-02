'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import api from 'lib/api';
import DetectForm from 'components/detection/DetectForm';
import ResultCard from 'components/detection/ResultCard';
import BarChart from 'components/charts/BarChart';
import {
  MdContentPaste,
  MdOutlineTravelExplore,
  MdOutlineFactCheck,
  MdOutlineTipsAndUpdates,
  MdHistory,
  MdChevronRight,
  MdVerified,
  MdErrorOutline,
  MdInsights,
  MdLocalFireDepartment,
  MdChevronLeft,
  MdOutlineMoneyOff,
  MdOutlineImageNotSupported,
  MdOutlineLink,
  MdOutlinePersonOff,
} from 'react-icons/md';

interface Result {
  id: string;
  inputText: string;
  result_label: 'real' | 'fake';
  confidence: number;
}

interface RecentItem {
  id: string;
  input_text: string;
  result_label: 'real' | 'fake';
  confidence: number;
  created_at: string;
}

const STEPS = [
  {
    icon: MdContentPaste,
    title: '1. Paste it in',
    body: 'Drop in the article text or a link to the story you want checked.',
  },
  {
    icon: MdOutlineTravelExplore,
    title: '2. AI cross-checks',
    body: 'Our model scans language patterns and framing against known real vs. fake signals.',
  },
  {
    icon: MdOutlineFactCheck,
    title: '3. Get your verdict',
    body: 'See a Real/Fake stamp with a confidence score — saved straight to your history.',
  },
];

const TIPS = [
  'Longer excerpts give a more reliable verdict — paste a few paragraphs when you can.',
  'Check the source URL, not just the headline. Lookalike domains are a common trick.',
  'Emotionally charged headlines are a red flag — pause before you share.',
  'No byline or a vague "staff writer" credit is worth a second look.',
  'Cross-check big claims against at least one other outlet before trusting them.',
];

const PATTERNS = [
  {
    icon: MdOutlinePersonOff,
    title: 'No verifiable source',
    body: 'Claims attributed to "insiders" or unnamed officials with nothing to check against.',
  },
  {
    icon: MdOutlineMoneyOff,
    title: 'Clickbait framing',
    body: 'Headlines built to provoke outrage or shock rather than describe what happened.',
  },
  {
    icon: MdOutlineImageNotSupported,
    title: 'Manipulated or old images',
    body: 'Real photos reused out of context to make an unrelated story feel urgent.',
  },
  {
    icon: MdOutlineLink,
    title: 'Lookalike domains',
    body: 'URLs that mimic real outlets with a swapped letter or extra word.',
  },
];

function computeStreak(items: RecentItem[]): number {
  if (!items.length) return 0;
  const days = new Set(
    items.map((i) => new Date(i.created_at).toISOString().slice(0, 10)),
  );
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeWeeklyActivity(items: RecentItem[]) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const counts = new Array(7).fill(0);
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  items.forEach((item) => {
    const d = new Date(item.created_at);
    if (d >= start) {
      const dayIndex = (d.getDay() + 6) % 7; // Mon = 0
      counts[dayIndex] += 1;
    }
  });

  return { labels, counts };
}

export default function DetectPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<RecentItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecent();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function loadRecent() {
    setRecentLoading(true);
    api
      .get('/history')
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setRecentLoading(false));
  }

  const recent = useMemo(() => history.slice(0, 4), [history]);

  const stats = useMemo(() => {
    const total = history.length;
    const fake = history.filter((h) => h.result_label === 'fake').length;
    const real = total - fake;
    const avgConfidence = total
      ? Math.round(history.reduce((sum, h) => sum + h.confidence, 0) / total)
      : 0;
    return { total, fake, real, avgConfidence };
  }, [history]);

  const streak = useMemo(() => computeStreak(history), [history]);

  const weekly = useMemo(() => computeWeeklyActivity(history), [history]);

  const weeklyChartData = [{ name: 'Checks', data: weekly.counts }];
  const weeklyChartOptions: any = {
    chart: { toolbar: { show: false } },
    tooltip: { theme: 'dark', style: { fontSize: '12px' } },
    xaxis: {
      categories: weekly.labels,
      labels: { style: { colors: '#A3AED0', fontSize: '11px', fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: '45%' },
    },
    fill: { colors: ['#C2410C'] },
    colors: ['#C2410C'],
  };

  async function handleAnalyze(input: string, type: 'text' | 'url') {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post('/detect', { input, type });
      setResult({
        id: res.data.id,
        inputText: input,
        result_label: res.data.result_label,
        confidence: res.data.confidence,
      });
      // Refresh stats / recent-checks strip now that a new one exists
      loadRecent();
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Something went wrong analyzing this. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div ref={resultRef}>
      {/* Masthead */}
      <div className="mb-8 flex items-start justify-between gap-4 border-b-2 border-double border-navy-900/10 pb-6 dark:border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-700/30 bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10">
              Members Desk
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-navy-900/10 bg-white/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy-700 dark:border-white/10 dark:bg-navy-800/50 dark:text-white">
                <MdLocalFireDepartment className="h-3.5 w-3.5 text-orange-600" />
                {streak}-day streak
              </span>
            )}
          </div>
          <h3 className="font-news mt-3 text-3xl font-black text-navy-900 dark:text-white sm:text-4xl">
            Check a News Story
          </h3>
          <p className="font-news-body mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Paste an article&rsquo;s text or a link, and VerifiNews will tell you how likely it is
            to be real or fake.
          </p>
        </div>
        <div className="hidden shrink-0 rounded-xl border border-navy-900/10 bg-white/70 p-3 text-center dark:border-white/10 dark:bg-navy-800/50 sm:block">
          <MdOutlineFactCheck className="mx-auto h-5 w-5 text-orange-700" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            AI Verified
          </p>
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-navy-900/10 bg-white/70 p-3.5 dark:border-white/10 dark:bg-navy-800/50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <MdInsights className="h-3.5 w-3.5" />
            <p className="text-[10px] font-bold uppercase tracking-wide">Total Checks</p>
          </div>
          <p className="font-news mt-1 text-2xl font-black text-navy-900 dark:text-white">
            {recentLoading ? '—' : stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-navy-900/10 bg-white/70 p-3.5 dark:border-white/10 dark:bg-navy-800/50">
          <div className="flex items-center gap-1.5 text-green-700">
            <MdVerified className="h-3.5 w-3.5" />
            <p className="text-[10px] font-bold uppercase tracking-wide">Verified Real</p>
          </div>
          <p className="font-news mt-1 text-2xl font-black text-navy-900 dark:text-white">
            {recentLoading ? '—' : stats.real}
          </p>
        </div>
        <div className="rounded-xl border border-navy-900/10 bg-white/70 p-3.5 dark:border-white/10 dark:bg-navy-800/50">
          <div className="flex items-center gap-1.5 text-red-600">
            <MdErrorOutline className="h-3.5 w-3.5" />
            <p className="text-[10px] font-bold uppercase tracking-wide">Flagged Fake</p>
          </div>
          <p className="font-news mt-1 text-2xl font-black text-navy-900 dark:text-white">
            {recentLoading ? '—' : stats.fake}
          </p>
        </div>
        <div className="rounded-xl border border-orange-700/20 bg-orange-50/60 p-3.5 dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="flex items-center gap-1.5 text-orange-700">
            <MdOutlineTravelExplore className="h-3.5 w-3.5" />
            <p className="text-[10px] font-bold uppercase tracking-wide">Avg. Confidence</p>
          </div>
          <p className="font-news mt-1 text-2xl font-black text-navy-900 dark:text-white">
            {recentLoading ? '—' : `${stats.avgConfidence}%`}
          </p>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left: detect form + result + steps + tip */}
        <div className="min-w-0">
          <DetectForm onSubmit={handleAnalyze} loading={loading} />

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
              Scanning the story…
            </div>
          )}

          {result && (
            <div className="mt-6">
              <ResultCard
                detectionId={result.id}
                inputText={result.inputText}
                resultLabel={result.result_label}
                confidence={result.confidence}
                onReset={handleReset}
              />
            </div>
          )}

          {!result && !loading && (
            <>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {STEPS.map((step) => (
                  <div
                    key={step.title}
                    className="group rounded-xl border border-navy-900/10 bg-white/70 p-4 transition-all duration-150 hover:border-orange-700/30 hover:shadow-md dark:border-white/10 dark:bg-navy-800/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 transition-colors duration-150 group-hover:bg-orange-700 group-hover:text-white dark:bg-orange-500/10">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p className="font-news mt-3 text-sm font-bold text-navy-900 dark:text-white">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Rotating tips carousel */}
              <div className="mt-6 rounded-xl border border-orange-600/20 bg-orange-50/60 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-700/10 text-orange-700">
                    <MdOutlineTipsAndUpdates className="h-[18px] w-[18px]" />
                  </div>
                  <p className="min-h-[2.5rem] flex-1 text-xs leading-relaxed text-navy-800 dark:text-gray-300">
                    <strong className="font-bold">Tip:</strong> {TIPS[tipIndex]}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {TIPS.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Show tip ${i + 1}`}
                        onClick={() => setTipIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-200 ${
                          i === tipIndex ? 'w-4 bg-orange-700' : 'w-1.5 bg-orange-700/25'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Previous tip"
                      onClick={() => setTipIndex((i) => (i - 1 + TIPS.length) % TIPS.length)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-orange-700 transition hover:bg-orange-700/10"
                    >
                      <MdChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Next tip"
                      onClick={() => setTipIndex((i) => (i + 1) % TIPS.length)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-orange-700 transition hover:bg-orange-700/10"
                    >
                      <MdChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: sticky sidebar — recent checks + weekly activity + highlight */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-navy-900/10 bg-white/70 p-4 dark:border-white/10 dark:bg-navy-800/50">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-news flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-navy-700 dark:text-white">
                <MdHistory className="h-4 w-4 text-orange-700" />
                Recent Checks
              </h4>
              <Link
                href="/dashboard/history"
                className="flex items-center gap-0.5 text-xs font-bold uppercase tracking-wide text-orange-700 transition hover:text-orange-800"
              >
                All
                <MdChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {recentLoading && <p className="text-xs text-gray-400">Loading…</p>}

            {!recentLoading && recent.length === 0 && (
              <p className="text-xs leading-relaxed text-gray-400">
                No checks yet — run your first story through the detector above.
              </p>
            )}

            {!recentLoading && recent.length > 0 && (
              <div className="flex flex-col gap-2">
                {recent.map((item) => {
                  const isFake = item.result_label === 'fake';
                  return (
                    <Link
                      key={item.id}
                      href="/dashboard/history"
                      className={`group flex flex-col gap-1.5 rounded-lg border-l-4 border-y border-r border-navy-900/10 bg-white p-2.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md dark:border-y-navy-700 dark:border-r-navy-700 dark:bg-navy-800 ${
                        isFake ? 'border-l-red-500' : 'border-l-green-600'
                      }`}
                    >
                      <p className="min-w-0 truncate text-xs text-gray-600 transition-colors group-hover:text-navy-900 dark:text-gray-300 dark:group-hover:text-white">
                        {item.input_text.length > 60
                          ? item.input_text.slice(0, 60) + '…'
                          : item.input_text}
                      </p>
                      <span
                        className={`w-fit shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                          isFake
                            ? 'border-red-600 text-red-600'
                            : 'border-green-700 text-green-700'
                        }`}
                      >
                        {isFake ? 'Fake' : 'Verified'} · {item.confidence}%
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weekly activity mini chart */}
          <div className="rounded-xl border border-navy-900/10 bg-white/70 p-4 dark:border-white/10 dark:bg-navy-800/50">
            <h4 className="font-news mb-1 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-navy-700 dark:text-white">
              <MdInsights className="h-4 w-4 text-orange-700" />
              This Week
            </h4>
            <p className="mb-2 text-[11px] text-gray-400">Checks per day, last 7 days</p>
            <div className="h-[130px] w-full">
              <BarChart chartData={weeklyChartData} chartOptions={weeklyChartOptions} />
            </div>
          </div>

          <div className="rounded-xl border border-navy-900 bg-navy-900 p-4 text-white">
            <p className="font-news text-sm font-bold">Why VerifiNews?</p>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-300">
              Every check is scored by our AI model and logged to your history, so you can track
              patterns over time and revisit past verdicts whenever you need to.
            </p>
            <Link
              href="/dashboard/history"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-400 hover:text-orange-300"
            >
              View full history
              <MdChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Patterns to watch — full width */}
      <div className="mt-10 border-t-2 border-double border-navy-900/10 pt-8 dark:border-white/10">
        <h4 className="font-news mb-4 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-navy-700 dark:text-white">
          <MdOutlineTravelExplore className="h-4 w-4 text-orange-700" />
          Fact-Check Patterns to Watch
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PATTERNS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-navy-900/10 bg-white/70 p-4 transition-all duration-150 hover:border-orange-700/30 hover:shadow-md dark:border-white/10 dark:bg-navy-800/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-500/10">
                <p.icon className="h-5 w-5" />
              </div>
              <p className="font-news mt-3 text-sm font-bold text-navy-900 dark:text-white">
                {p.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}