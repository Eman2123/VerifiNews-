import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#faf6ee] dark:bg-navy-900">
      <Link
        href="/"
        className="group absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-navy-900 transition hover:bg-navy-900/10 dark:text-white dark:hover:bg-white/10 sm:left-8 sm:top-8 md:text-white md:hover:bg-white/10"
      >
        <MdArrowBack className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        Back to VerifiNews
      </Link>
      {children}
    </div>
  );
}