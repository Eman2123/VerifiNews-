'use client';
import { useRef, useState } from 'react';
import { MdTextFields, MdLink, MdClose, MdAutoAwesome, MdKeyboard } from 'react-icons/md';

interface DetectFormProps {
  onSubmit: (input: string, type: 'text' | 'url') => void;
  loading: boolean;
}

const EXAMPLE_TEXT =
  'Scientists have confirmed that drinking coffee backwards while facing north cures insomnia within seconds, according to a viral post shared thousands of times this week.';
const MAX_CHARS = 5000;

export default function DetectForm({ onSubmit, loading }: DetectFormProps) {
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [value, setValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim(), mode);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Ctrl/Cmd + Enter submits the form from inside the textarea/input
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function switchMode(next: 'text' | 'url') {
    setMode(next);
    setValue('');
  }

  const isReady = value.trim().length > 0 && !loading;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="paper-texture relative overflow-hidden rounded-xl border border-navy-900/10 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
    >
      <div className="relative mb-5 flex items-center justify-between gap-1 border-b border-navy-900/10 pb-3 dark:border-white/10">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => switchMode('text')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              mode === 'text'
                ? 'bg-orange-700 text-white'
                : 'text-navy-700 hover:bg-navy-900/5 dark:text-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <MdTextFields className="h-3.5 w-3.5" />
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => switchMode('url')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              mode === 'url'
                ? 'bg-orange-700 text-white'
                : 'text-navy-700 hover:bg-navy-900/5 dark:text-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <MdLink className="h-3.5 w-3.5" />
            Paste URL
          </button>
        </div>

        {mode === 'text' && (
          <button
            type="button"
            onClick={() => setValue(EXAMPLE_TEXT)}
            className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-orange-700 transition hover:bg-orange-50 dark:hover:bg-white/10 sm:flex"
          >
            <MdAutoAwesome className="h-3.5 w-3.5" />
            Try an example
          </button>
        )}
      </div>

      <div className="relative">
        {mode === 'text' ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            rows={8}
            placeholder="Paste the news article text here..."
            className="font-news-body w-full resize-none rounded-xl border-2 border-gray-200 bg-[#faf6ee]/40 p-4 pr-10 text-sm leading-relaxed text-navy-900 outline-none transition placeholder:text-gray-400 focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-600/10 dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:focus:bg-navy-900"
          />
        ) : (
          <input
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/article"
            className="font-news-body w-full rounded-xl border-2 border-gray-200 bg-[#faf6ee]/40 p-4 pr-10 text-sm text-navy-900 outline-none transition placeholder:text-gray-400 focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-600/10 dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:focus:bg-navy-900"
          />
        )}

        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label="Clear"
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-200/70 hover:text-gray-600 dark:hover:bg-white/10"
          >
            <MdClose className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        {mode === 'text' ? (
          <span className={`text-xs ${value.length > MAX_CHARS - 200 ? 'text-orange-600' : 'text-gray-400'}`}>
            {value.length}/{MAX_CHARS} characters
            {value.trim() && (
              <>
                {' '}
                · {value.trim().split(/\s+/).filter(Boolean).length} words
              </>
            )}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Paste a full article link, including https://</span>
        )}
        <span className="hidden items-center gap-1 text-[11px] text-gray-400 sm:flex">
          <MdKeyboard className="h-3.5 w-3.5" />
          Ctrl+Enter to analyze
        </span>
      </div>

      <button
        type="submit"
        disabled={!isReady}
        className={`linear mt-4 w-full rounded-xl py-3 text-base font-medium transition duration-200 ${
          isReady
            ? 'bg-orange-700 text-white shadow-md shadow-orange-900/20 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg'
            : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-navy-700 dark:text-gray-500'
        }`}
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  );
}