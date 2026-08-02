'use client';
import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from 'contexts/AuthContext';
import { validatePassword, validateConfirmPassword } from 'lib/validation';

function ResetPasswordForm() {
  const { resetPassword, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>(
    {}
  );
  const [touched, setTouched] = useState<{ password?: boolean; confirmPassword?: boolean }>({});
  const [done, setDone] = useState(false);

  function validate() {
    const errors = {
      password: validatePassword(password) || undefined,
      confirmPassword: validateConfirmPassword(password, confirmPassword) || undefined,
    };
    setFieldErrors(errors);
    return !errors.password && !errors.confirmPassword;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!validate()) return;
    try {
      await resetPassword(token, password);
      setDone(true);
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
          Set New Password
        </h2>
        <p className="font-news-body mb-8 text-sm text-gray-500 dark:text-gray-400">
          Choose a new password for your account.
        </p>

        {!token ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            This reset link is missing or invalid. Please request a new one.
          </div>
        ) : done ? (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Your password has been reset. You can now sign in with your new password.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => {
                      setTouched((t) => ({ ...t, password: true }));
                      setFieldErrors((fe) => ({
                        ...fe,
                        password: validatePassword(password) || undefined,
                      }));
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
                    {showPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {touched.password && fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                  Confirm New Password
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
                    placeholder="Re-enter your new password"
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
                {loading ? 'Resetting\u2026' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="/auth/sign-in" className="font-medium text-orange-700 hover:text-orange-800">
            Back to sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}