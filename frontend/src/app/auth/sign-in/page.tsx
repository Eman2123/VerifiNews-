'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from 'contexts/AuthContext';
import { validateEmail, validateLoginPassword } from 'lib/validation';

export default function SignInPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dateline, setDateline] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  useEffect(() => {
    setDateline(
      new Date()
        .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        .toUpperCase()
    );
  }, []);

  function validate() {
    const errors = {
      email: validateEmail(email) || undefined,
      password: validateLoginPassword(password) || undefined,
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) return;
    try {
      await login(email, password);
    } catch {
      // error already captured by AuthContext
    }
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      {/* Branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="paper-texture relative hidden flex-col justify-between overflow-hidden bg-navy-900 px-12 py-16 text-white md:flex lg:px-20"
      >
        {/* decorative newspaper column rules */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent calc(25% - 1px), rgba(255,255,255,0.8) calc(25% - 1px), rgba(255,255,255,0.8) 25%)',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-orange-600/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
            <p className="font-news text-2xl font-black tracking-tight text-white">
              THE <span className="text-orange-500">VERIFI</span>NEWS
            </p>
            <span className="hidden font-news-body text-[11px] tracking-widest text-gray-400 lg:block">
              {dateline || 'TODAY\u2019S EDITION'}
            </span>
          </div>

          <span className="mt-6 inline-block border-2 border-red-500 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-red-500">
            Members Desk
          </span>
          <h2 className="font-news mt-5 max-w-md text-4xl font-black leading-[1.1] lg:text-5xl">
            Welcome back to the newsroom.
          </h2>
          <p className="font-news-body mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            Pick up right where you left off — your check history and saved verdicts are waiting.
          </p>
        </div>

        <div className="relative">
          <p className="border-t border-white/10 pt-5 font-news text-lg italic leading-snug text-gray-300">
            &ldquo;The best defense against fake news is a reader who checks first.&rdquo;
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 text-left">
            <div>
              <p className="font-news text-xl font-black text-white">10K+</p>
              <p className="font-news-body text-[11px] uppercase tracking-widest text-gray-500">
                Articles checked
              </p>
            </div>
            <div>
              <p className="font-news text-xl font-black text-white">92%</p>
              <p className="font-news-body text-[11px] uppercase tracking-widest text-gray-500">
                Model accuracy
              </p>
            </div>
            <div>
              <p className="font-news text-xl font-black text-white">500+</p>
              <p className="font-news-body text-[11px] uppercase tracking-widest text-gray-500">
                Journalists
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form panel */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center bg-[#faf6ee] px-6 py-16 dark:bg-navy-900 sm:px-12 sm:py-20"
      >
        <div className="w-full max-w-sm">
          <p className="font-news mb-8 text-center text-lg font-black tracking-tight text-navy-900 dark:text-white md:hidden">
            THE <span className="text-orange-600">VERIFI</span>NEWS
          </p>

          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            Members Desk
          </span>
          <h2 className="font-news mb-1 text-4xl font-black text-navy-900 dark:text-white">
            Sign In
          </h2>
          <p className="font-news-body mb-8 text-sm text-gray-500 dark:text-gray-400">
            Welcome back — check the news that matters.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  setTouched((t) => ({ ...t, email: true }));
                  setFieldErrors((fe) => ({ ...fe, email: validateEmail(email) || undefined }));
                }}
                placeholder="you@example.com"
                aria-invalid={!!(touched.email && fieldErrors.email)}
                className={`w-full rounded-lg border bg-white p-3 text-sm outline-none transition dark:bg-navy-900 dark:text-white ${
                  touched.email && fieldErrors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-orange-600 dark:border-navy-600'
                }`}
              />
              {touched.email && fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium text-navy-700 dark:text-white">
                  Password
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-orange-700 hover:text-orange-800"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, password: true }));
                    setFieldErrors((fe) => ({
                      ...fe,
                      password: validateLoginPassword(password) || undefined,
                    }));
                  }}
                  placeholder="Your password"
                  aria-invalid={!!(touched.password && fieldErrors.password)}
                  className={`w-full rounded-lg border bg-white p-3 pr-11 text-sm outline-none transition dark:bg-navy-900 dark:text-white ${
                    touched.password && fieldErrors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-orange-600 dark:border-navy-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-orange-700 py-3 text-base font-medium text-white shadow-md shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? 'Signing in\u2026' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Not registered yet?{' '}
            <a href="/auth/sign-up" className="font-medium text-orange-700 hover:text-orange-800">
              Create an account
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}