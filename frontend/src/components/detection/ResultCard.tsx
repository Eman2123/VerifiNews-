import React, { useState } from 'react';
import Link from 'next/link';
import api from 'lib/api';
import { MdContentCopy, MdCheck, MdHistory, MdRestartAlt } from 'react-icons/md';

interface ResultCardProps {
  detectionId: string;
  inputText: string;
  resultLabel: 'real' | 'fake';
  confidence: number;
  onReset?: () => void;
}

export default function ResultCard({
  detectionId,
  inputText,
  resultLabel,
  confidence,
  onReset,
}: ResultCardProps) {
  const isFake = resultLabel === 'fake';
  const [reportState, setReportState] = useState<'idle' | 'form' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [reason, setReason] = useState('');
  const [copied, setCopied] = useState(false);

  async function submitReport() {
    setReportState('sending');
    try {
      await api.post('/report', { detection_id: detectionId, reason: reason || undefined });
      setReportState('sent');
    } catch {
      setReportState('error');
    }
  }

  async function copyVerdict() {
    const excerpt = inputText.length > 140 ? inputText.slice(0, 140) + '…' : inputText;
    const summary = `VerifiNews check: "${excerpt}"\nVerdict: ${
      isFake ? 'Fake' : 'Verified'
    } (${confidence}% confidence)`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable — fail silently
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-[#faf6ee] p-6 shadow-md dark:border-navy-700 dark:bg-navy-800">
      {/* Ink-stamp badge */}
      <div
        className={`pointer-events-none absolute right-6 top-6 -rotate-12 rounded-md border-4 border-double px-4 py-1 text-xl font-black uppercase tracking-widest opacity-80 font-news ${
          isFake
            ? 'border-red-600 text-red-600'
            : 'border-green-700 text-green-700'
        }`}
      >
        {isFake ? 'Fake' : 'Verified'}
      </div>

      {/* Article excerpt, styled like a clipping */}
      <p
        className="font-news-body mb-4 max-w-[80%] text-gray-700 dark:text-gray-200"
      >
        &ldquo;{inputText.length > 220 ? inputText.slice(0, 220) + '…' : inputText}&rdquo;
      </p>

      <div className="h-px w-full bg-gray-300 dark:bg-navy-600" />

      {/* Editor's byline note */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm italic text-gray-500 dark:text-gray-400">
          Confidence: <strong>{confidence}%</strong> — Reviewed by AI
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700">
          <div
            className={`h-full ${isFake ? 'bg-red-500' : 'bg-green-600'}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={copyVerdict}
          className="flex items-center gap-1.5 rounded-full border border-navy-900/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-navy-700 transition hover:bg-navy-900/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
        >
          {copied ? (
            <>
              <MdCheck className="h-3.5 w-3.5 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <MdContentCopy className="h-3.5 w-3.5" />
              Copy Verdict
            </>
          )}
        </button>

        <Link
          href="/dashboard/history"
          className="flex items-center gap-1.5 rounded-full border border-navy-900/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-navy-700 transition hover:bg-navy-900/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
        >
          <MdHistory className="h-3.5 w-3.5" />
          View in History
        </Link>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-orange-600/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-orange-700 transition hover:bg-orange-50 dark:border-orange-500/20 dark:hover:bg-orange-500/10"
          >
            <MdRestartAlt className="h-3.5 w-3.5" />
            Check Another Story
          </button>
        )}
      </div>

      {/* Report this result */}
      <div className="mt-4">
        {reportState === 'idle' && (
          <button
            onClick={() => setReportState('form')}
            className="text-xs font-medium text-gray-500 underline hover:text-red-600"
          >
            This looks wrong — report it
          </button>
        )}

        {reportState === 'form' && (
          <div className="mt-2 flex flex-col gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What seems off? (optional)"
              className="rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-orange-600 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={submitReport}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Submit Report
              </button>
              <button
                onClick={() => setReportState('idle')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {reportState === 'sending' && (
          <p className="text-xs text-gray-500">Sending report…</p>
        )}
        {reportState === 'sent' && (
          <p className="text-xs text-green-700">Thanks — we'll review this.</p>
        )}
        {reportState === 'error' && (
          <p className="text-xs text-red-600">
            Could not submit report. It may already be reported.
          </p>
        )}
      </div>
    </div>
  );
}