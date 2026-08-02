const headlines = [
  'AI flags 3.2M suspicious articles this year',
  'Newsroom teams cut fact-checking time by 80%',
  'VerifiNews model accuracy climbs to 92%',
  'Misinformation reports drop across partner outlets',
  '500+ journalists now verify with VerifiNews daily',
  'New: instant URL scanning for breaking stories',
];

export default function NewsTicker() {
  const loop = [...headlines, ...headlines];

  return (
    <section aria-label="Live updates" className="overflow-hidden border-y-2 border-orange-600/60 bg-navy-900">
      <div className="flex items-center">
        <div className="z-10 flex shrink-0 items-center gap-2 border-r-2 border-orange-600/60 bg-red-600 px-4 py-2.5">
          <span className="h-2 w-2 animate-pulseDot rounded-full bg-white" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Live</span>
        </div>
        <div className="ticker-track py-2.5">
          {loop.map((headline, i) => (
            <span
              key={i}
              className="mx-6 whitespace-nowrap text-sm font-medium uppercase tracking-wide text-gray-300"
            >
              {headline}
              <span className="ml-6 text-orange-500">&bull;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
