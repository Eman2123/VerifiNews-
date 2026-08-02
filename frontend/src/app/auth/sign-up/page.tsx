'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from 'contexts/AuthContext';
import {
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
} from 'lib/validation';

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUpPage() {
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dateline, setDateline] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    setDateline(
      new Date()
        .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        .toUpperCase()
    );
  }, []);

  function validate() {
    const errors: FieldErrors = {
      name: validateName(name) || undefined,
      email: validateEmail(email) || undefined,
      password: validatePassword(password) || undefined,
      confirmPassword: validateConfirmPassword(password, confirmPassword) || undefined,
    };
    setFieldErrors(errors);
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!validate()) return;
    try {
      await signup(name, email, password);
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
            Join the Desk
          </span>
          <h2 className="font-news mt-5 max-w-md text-4xl font-black leading-[1.1] lg:text-5xl">
            Start telling real from fake in seconds.
          </h2>
          <p className="font-news-body mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            Free to join. Unlimited text and URL checks, saved history, and a confidence score on
            every verdict.
          </p>
        </div>

        <div className="relative">
          <ul className="flex flex-col gap-2 border-t border-white/10 pt-5 font-news-body text-xs text-gray-400">
            <li>10,000+ articles already checked</li>
            <li>92% model accuracy</li>
            <li>500+ active journalists &amp; creators</li>
          </ul>
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
            Join the Desk
          </span>
          <h2 className="font-news mb-1 text-4xl font-black text-navy-900 dark:text-white">
            Sign Up
          </h2>
          <p className="font-news-body mb-8 text-sm text-gray-500 dark:text-gray-400">
            Create your account to start checking news.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  setTouched((t) => ({ ...t, name: true }));
                  setFieldErrors((fe) => ({ ...fe, name: validateName(name) || undefined }));
                }}
                placeholder="Your name"
                aria-invalid={!!(touched.name && fieldErrors.name)}
                className={`w-full rounded-lg border bg-white p-3 text-sm outline-none transition dark:bg-navy-900 dark:text-white ${
                  touched.name && fieldErrors.name
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-orange-600 dark:border-navy-600'
                }`}
              />
              {touched.name && fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
              )}
            </div>
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
              <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, password: true }));
                    setFieldErrors((fe) => ({ ...fe, password: validatePassword(password) || undefined }));
                  }}
                  placeholder="Min. 8 characters, 1 letter & 1 number"
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
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, confirmPassword: true }));
                    setFieldErrors((fe) => ({
                      ...fe,
                      confirmPassword: validateConfirmPassword(password, confirmPassword) || undefined,
                    }));
                  }}
                  placeholder="Re-enter your password"
                  aria-invalid={!!(touched.confirmPassword && fieldErrors.confirmPassword)}
                  className={`w-full rounded-lg border bg-white p-3 pr-11 text-sm outline-none transition dark:bg-navy-900 dark:text-white ${
                    touched.confirmPassword && fieldErrors.confirmPassword
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-orange-600 dark:border-navy-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <MdVisibilityOff className="h-5 w-5" />
                  ) : (
                    <MdVisibility className="h-5 w-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-orange-700 py-3 text-base font-medium text-white shadow-md shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? 'Creating account\u2026' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/auth/sign-in" className="font-medium text-orange-700 hover:text-orange-800">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}