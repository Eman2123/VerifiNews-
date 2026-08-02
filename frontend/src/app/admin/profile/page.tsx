'use client';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from 'lib/api';
import { useAuth } from 'contexts/AuthContext';

// Tracks document.body's `dark` class directly (via MutationObserver) so this
// page's background always matches the current theme, even if it's reloaded
// on its own or the global dark: cascade doesn't reach it for some reason.
function useDarkMode() {
  const [darkmode, setDarkmode] = useState(false);
  useEffect(() => {
    const update = () => setDarkmode(document.body.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return darkmode;
}

// ---------- Icons ----------
const IconUser = () => (
  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconMail = () => (
  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconLock = () => (
  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconShieldCheck = () => (
  <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconAlertCircle = () => (
  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconSpinner = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const IconCopy = () => (
  <svg className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const IconEye = () => (
  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeOff = () => (
  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const IconIdCard = () => (
  <svg className="h-4 w-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10h.01M7 14h6M15 10h2M15 14h2" />
  </svg>
);

const IconClock = () => (
  <svg className="h-4 w-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ---------- Password strength helper ----------
function getPasswordStrength(pw: string) {
  if (!pw) return { score: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500' },
    { label: 'Good', color: 'bg-lime-500' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  const idx = Math.min(score, levels.length - 1);
  return { score: idx + 1, ...levels[idx] };
}

// ---------- Confetti burst ----------
function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 220,
        y: -Math.random() * 160 - 40,
        rotate: Math.random() * 360,
        color: ['#f97316', '#1e293b', '#22c55e', '#fbbf24'][i % 4],
        delay: Math.random() * 0.15,
      })),
    [triggerKey],
  );

  if (triggerKey === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center overflow-visible">
      {particles.map((p) => (
        <motion.span
          key={`${triggerKey}-${p.id}`}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate }}
          transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
          style={{ backgroundColor: p.color }}
          className="absolute h-2 w-2 rounded-sm"
        />
      ))}
    </div>
  );
}

export default function AdminProfilePage() {
  const { user } = useAuth();
  const darkmode = useDarkMode();
  const [tab, setTab] = useState<'profile' | 'security'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const [confettiKey, setConfettiKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const strength = getPasswordStrength(newPassword);

  function celebrate() {
    setConfettiKey((k) => k + 1);
  }

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.patch('/users/me', { name });
      setMessage({ type: 'success', text: 'Name updated.' });
      celebrate();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Could not update name.' });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.patch('/users/me', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed.' });
      setCurrentPassword('');
      setNewPassword('');
      celebrate();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Could not change password.',
      });
    } finally {
      setSaving(false);
    }
  }

  function copyEmail() {
    if (!user?.email) return;
    navigator.clipboard?.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden font-news-body ${
        darkmode ? 'bg-navy-950' : 'bg-[#f6f2e8]'
      }`}
    >
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.25); }
          50% { box-shadow: 0 0 45px rgba(249, 115, 22, 0.5); }
        }
        .glow-ring { animation: glow 3s ease-in-out infinite; }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        .floaty { animation: floaty 6s ease-in-out infinite; }
      `}</style>

      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl floaty" />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-navy-900/10 blur-3xl floaty dark:bg-orange-500/10"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl floaty"
        style={{ animationDelay: '4s' }}
      />

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              message.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400'
                : 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? <IconCheckCircle /> : <IconAlertCircle />}
            {message.text}
            <button onClick={() => setMessage(null)} className="text-current opacity-60 hover:opacity-100">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="paper-texture relative overflow-hidden rounded-2xl border border-navy-900/10 bg-navy-900 px-6 py-8 shadow-lg dark:border-white/10"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-pulse rounded-full bg-orange-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 animate-pulse rounded-full bg-orange-600/20 blur-3xl" style={{ animationDelay: '1s' }} />

          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block border-2 border-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Admin Desk
              </span>
              <h3 className="font-news mt-2 text-4xl font-black tracking-tight text-white drop-shadow-md">
                My Profile
              </h3>
              <p className="mt-1 text-xs font-medium text-gray-300">
                Manage your account details and account security.
              </p>
            </div>

            <div className="flex items-stretch gap-3 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 backdrop-blur-sm"
              >
                <IconIdCard />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-300">Role</p>
                  <p className="text-sm font-black text-white">Administrator</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2 backdrop-blur-sm"
              >
                <IconClock />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-green-300/80">Status</p>
                  <p className="text-sm font-black text-green-400">Active</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main grid: sidebar + content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-6 lg:self-start"
          >
            <div
              className={`relative overflow-hidden rounded-2xl border p-6 text-center shadow-lg ${
                darkmode ? 'border-navy-700 bg-navy-800' : 'border-gray-200 bg-white'
              }`}
            >
              <ConfettiBurst triggerKey={confettiKey} />
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="glow-ring mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-900 text-3xl font-black text-white dark:bg-orange-500 dark:text-navy-900"
              >
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </motion.div>
              <p className="mt-4 text-lg font-bold text-navy-700 dark:text-white">{user?.name}</p>

              <button
                onClick={copyEmail}
                className="mx-auto mt-1 flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-700"
              >
                <IconMail />
                {user?.email}
                <IconCopy />
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[11px] font-bold text-green-600 dark:text-green-400"
                  >
                    Copied to clipboard
                  </motion.p>
                )}
              </AnimatePresence>

              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                <IconShieldCheck />
                Admin
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            {/* Tabs */}
            <div
              className={`relative mb-4 flex gap-2 rounded-full border p-1 shadow-sm ${
                darkmode ? 'border-navy-700 bg-navy-800' : 'border-gray-200 bg-white'
              }`}
            >
              {(['profile', 'security'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="relative flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  {tab === t && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-navy-900 dark:bg-orange-500"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 ${tab === t ? 'text-white dark:text-navy-900' : 'text-gray-500 dark:text-gray-300'}`}>
                    {t === 'profile' ? 'Profile' : 'Security'}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'profile' ? (
                <motion.form
                  key="profile-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleNameSave}
                  className={`rounded-2xl border p-6 shadow-lg ${
                    darkmode ? 'border-navy-700 bg-navy-800' : 'border-gray-200 bg-[#faf6ee]'
                  }`}
                >
                  <h4 className="font-news mb-4 text-[11px] font-bold uppercase tracking-widest text-navy-800 dark:text-gray-100">
                    Basic Info
                  </h4>
                  <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                    Full Name
                  </label>
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2.5 transition focus-within:ring-2 ${
                      darkmode
                        ? 'border-navy-600 bg-navy-900 focus-within:border-orange-500/60 focus-within:ring-orange-900/20'
                        : 'border-gray-200 bg-white focus-within:border-orange-600 focus-within:ring-orange-100'
                    }`}
                  >
                    <IconUser />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full !bg-transparent text-sm text-navy-900 outline-none dark:text-white"
                      style={{ backgroundColor: 'transparent' }}
                    />
                  </div>
                  <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                    Email
                  </label>
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2.5 ${
                      darkmode ? 'border-navy-700 bg-navy-900/50' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <IconMail />
                    <input
                      value={user?.email || ''}
                      disabled
                      className="w-full !bg-transparent text-sm text-gray-400 outline-none dark:text-gray-500"
                      style={{ backgroundColor: 'transparent' }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition duration-200 hover:bg-orange-700 disabled:opacity-50 dark:bg-orange-500 dark:text-navy-900 dark:hover:bg-orange-400"
                  >
                    {saving && <IconSpinner />}
                    Save Name
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="security-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handlePasswordSave}
                  className={`rounded-2xl border p-6 shadow-lg ${
                    darkmode ? 'border-navy-700 bg-navy-800' : 'border-gray-200 bg-[#faf6ee]'
                  }`}
                >
                  <h4 className="font-news mb-4 text-[11px] font-bold uppercase tracking-widest text-navy-800 dark:text-gray-100">
                    Change Password
                  </h4>
                  <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                    Current Password
                  </label>
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2.5 transition focus-within:ring-2 ${
                      darkmode
                        ? 'border-navy-600 bg-navy-900 focus-within:border-orange-500/60 focus-within:ring-orange-900/20'
                        : 'border-gray-200 bg-white focus-within:border-orange-600 focus-within:ring-orange-100'
                    }`}
                  >
                    <IconLock />
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full !bg-transparent text-sm text-navy-900 outline-none dark:text-white"
                      style={{ backgroundColor: 'transparent' }}
                    />
                    <button type="button" onClick={() => setShowCurrentPw((s) => !s)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      {showCurrentPw ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>

                  <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                    New Password
                  </label>
                  <div
                    className={`mb-2 flex items-center gap-2 rounded-lg border px-3 py-2.5 transition focus-within:ring-2 ${
                      darkmode
                        ? 'border-navy-600 bg-navy-900 focus-within:border-orange-500/60 focus-within:ring-orange-900/20'
                        : 'border-gray-200 bg-white focus-within:border-orange-600 focus-within:ring-orange-100'
                    }`}
                  >
                    <IconLock />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full !bg-transparent text-sm text-navy-900 outline-none placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
                      style={{ backgroundColor: 'transparent' }}
                    />
                    <button type="button" onClick={() => setShowNewPw((s) => !s)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      {showNewPw ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-navy-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: i < strength.score ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${strength.color}`}
                          />
                        </div>
                      ))}
                    </div>
                    {newPassword && (
                      <p className="mt-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                        Strength: {strength.label}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving || !currentPassword || !newPassword}
                    className="flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition duration-200 hover:bg-orange-700 disabled:opacity-50 dark:bg-orange-500 dark:text-navy-900 dark:hover:bg-orange-400"
                  >
                    {saving && <IconSpinner />}
                    Change Password
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}