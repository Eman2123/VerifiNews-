'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from 'contexts/AuthContext';
import { validateEmail } from 'lib/validation';

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    setEmailError(err || undefined);
    if (err) return;
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      // error already captured by AuthContext
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#faf6ee] px-6 py-16 dark:bg-navy-900 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <p className="font-news mb-8 text-center text-lg font-black tracking-tight text-navy-900 dark:text-white">
          THE <span className="text-orange-600">VERIFI</span>NEWS
        </p>

        <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
          Members Desk
        </span>
        <h2 className="font-news mb-1 text-4xl font-black text-navy-900 dark:text-white">
          Reset Password
        </h2>
        <p className="font-news-body mb-8 text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we&rsquo;ll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {sent ? (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is
            on its way. Check your inbox.
          </div>
        ) : (
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
                  setTouched(true);
                  setEmailError(validateEmail(email) || undefined);
                }}
                placeholder="you@example.com"
                aria-invalid={!!(touched && emailError)}
                className={`w-full rounded-lg border bg-white p-3 text-sm outline-none transition dark:bg-navy-900 dark:text-white ${
                  touched && emailError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-orange-600 dark:border-navy-600'
                }`}
              />
              {touched && emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-orange-700 py-3 text-base font-medium text-white shadow-md shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? 'Sending\u2026' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Remembered it?{' '}
          <a href="/auth/sign-in" className="font-medium text-orange-700 hover:text-orange-800">
            Back to sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}