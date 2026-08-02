import { MdWorkspacePremium } from 'react-icons/md';

const awards = [
  'Best AI Product — Newsroom Tech Awards',
  'Top 10 Fact-Checking Tools 2026',
  'Journalism Innovation Prize — Finalist',
  'Trusted by 500+ Verified Accounts',
  'Featured Startup — Media Tech Summit',
  'Editor\'s Pick — Digital Journalism Review',
];

export default function Awards() {
  const loop = [...awards, ...awards];

  return (
    <section aria-label="Recognition" className="overflow-hidden border-y border-gray-200 bg-white py-8 dark:border-navy-700 dark:bg-navy-900">
      <div className="ticker-track items-center" style={{ animationDuration: '32s' }}>
        {loop.map((award, i) => (
          <span
            key={i}
            className="mx-8 flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wide text-navy-900/70 dark:text-white/70"
          >
            <MdWorkspacePremium className="h-5 w-5 text-orange-600" />
            {award}
          </span>
        ))}
      </div>
    </section>
  );
}
