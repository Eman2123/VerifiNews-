import { MdSearch } from 'react-icons/md';

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 px-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Spinning ring */}
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-orange-600/20 border-t-orange-600" />
        {/* Magnifying glass "searching" icon */}
        <MdSearch className="h-8 w-8 animate-pulse text-orange-700" />
      </div>

      <div className="text-center">
        <p className="font-news text-lg font-black tracking-tight text-navy-900 dark:text-white">
          THE <span className="text-orange-600">VERIFI</span>NEWS
        </p>
        <p className="mt-1 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Searching the wire
          <span className="flex gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-orange-600" style={{ animationDelay: '0ms' }} />
            <span className="h-1 w-1 animate-bounce rounded-full bg-orange-600" style={{ animationDelay: '150ms' }} />
            <span className="h-1 w-1 animate-bounce rounded-full bg-orange-600" style={{ animationDelay: '300ms' }} />
          </span>
        </p>
      </div>
    </div>
  );
}