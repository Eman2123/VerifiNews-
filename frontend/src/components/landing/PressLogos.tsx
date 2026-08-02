const outlets = [
  'The Daily Signal',
  'Global Bulletin',
  'TruthWire',
  'The Morning Ledger',
  'FactPress',
  'Newsroom Weekly',
];

export default function PressLogos() {
  const loop = [...outlets, ...outlets];

  return (
    <section id="press" className="overflow-hidden border-y border-gray-200 bg-white py-10 dark:border-navy-700 dark:bg-navy-900">
      <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
        As Referenced By Newsrooms Like
      </p>
      <div className="ticker-track items-center" style={{ animationDuration: '26s' }}>
        {loop.map((name, i) => (
          <span
            key={i}
            className="font-news mx-8 shrink-0 select-none whitespace-nowrap text-lg font-bold tracking-tight text-gray-400 grayscale transition duration-300 hover:text-navy-900 hover:grayscale-0 dark:text-gray-600 dark:hover:text-white"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
