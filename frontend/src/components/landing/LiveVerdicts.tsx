'use client';
import { motion } from 'framer-motion';

const rowA = [
  { text: 'Government announces free housing for all citizens starting next month', verdict: 'Fake', confidence: 96 },
  { text: 'Local hospital reports record vaccination turnout this week', verdict: 'Real', confidence: 91 },
  { text: 'Scientists confirm chocolate cures the common cold', verdict: 'Fake', confidence: 97 },
  { text: 'Central bank holds interest rates steady, cites inflation data', verdict: 'Real', confidence: 89 },
  { text: 'Celebrity secretly funding a private island for clones', verdict: 'Fake', confidence: 99 },
];

const rowB = [
  { text: 'New bridge project completed two months ahead of schedule', verdict: 'Real', confidence: 88 },
  { text: 'Drinking bottled lightning boosts memory by 400%, study claims', verdict: 'Fake', confidence: 98 },
  { text: 'City council approves budget for public transit expansion', verdict: 'Real', confidence: 92 },
  { text: 'Ancient pyramid found to be a hidden alien communication device', verdict: 'Fake', confidence: 97 },
  { text: 'University publishes peer-reviewed climate research findings', verdict: 'Real', confidence: 90 },
];

function VerdictCard({ text, verdict, confidence }: { text: string; verdict: string; confidence: number }) {
  const isFake = verdict === 'Fake';
  return (
    <div className="mx-3 w-80 shrink-0 rounded-xl border border-gray-200 bg-[#faf6ee] p-5 shadow-sm dark:border-navy-700 dark:bg-navy-800">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-widest ${
            isFake
              ? 'border-red-600 text-red-600'
              : 'border-green-600 text-green-600'
          }`}
        >
          {verdict}
        </span>
        <span className="text-xs italic text-gray-500">{confidence}% confidence</span>
      </div>
      <p className="font-news-body text-sm leading-snug text-gray-700 dark:text-gray-300">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}

export default function LiveVerdicts() {
  const loopA = [...rowA, ...rowA];
  const loopB = [...rowB, ...rowB];

  return (
    <section id="live-verdicts" className="border-y border-gray-200 bg-white py-16 dark:border-navy-700 dark:bg-navy-900">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.3em] text-orange-700 dark:text-orange-400">
            The Verdict Wall
          </span>
          <h3 className="font-news text-3xl font-black text-navy-900 dark:text-white">
            A Live Look at What We Catch
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-400">
            A sample of real and fabricated headlines our model has scored — this is the kind of
            verdict you get on every check.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="ticker-track" style={{ animationDuration: '38s' }}>
          {loopA.map((item, i) => (
            <VerdictCard key={`a-${i}`} {...item} />
          ))}
        </div>
        <div className="ticker-track" style={{ animationDuration: '34s', animationDirection: 'reverse' }}>
          {loopB.map((item, i) => (
            <VerdictCard key={`b-${i}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
