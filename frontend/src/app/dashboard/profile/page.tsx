'use client';
import { useEffect, useRef, useState } from 'react';
import api from 'lib/api';
import { useAuth } from 'contexts/AuthContext';
import {
  MdVerifiedUser,
  MdOutlineFactCheck,
  MdLogout,
  MdDarkMode,
  MdLightMode,
  MdLockOutline,
  MdPersonOutline,
  MdCameraAlt,
  MdDeleteOutline,
} from 'react-icons/md';

interface HistoryItem {
  result_label: 'real' | 'fake';
}

const inputClass =
  'font-news-body mb-4 w-full rounded-xl border-2 border-gray-200 bg-[#faf6ee]/40 p-3 text-sm text-navy-900 outline-none transition focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-600/10 dark:border-navy-600 dark:bg-navy-900 dark:text-white dark:focus:bg-navy-900';

const MAX_AVATAR_MB = 5;

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const [stats, setStats] = useState<{ total: number; real: number; fake: number } | null>(null);
  const [darkmode, setDarkmode] = useState(false);

  // Picture section state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarRemoving, setAvatarRemoving] = useState(false);

  useEffect(() => {
    setDarkmode(document.body.classList.contains('dark'));
    api
      .get('/history')
      .then((res) => {
        const items: HistoryItem[] = res.data;
        const fake = items.filter((i) => i.result_label === 'fake').length;
        setStats({ total: items.length, real: items.length - fake, fake });
      })
      .catch(() => setStats(null));
  }, []);

  function toggleDarkMode() {
    if (darkmode) {
      document.body.classList.remove('dark');
      setDarkmode(false);
    } else {
      document.body.classList.add('dark');
      setDarkmode(true);
    }
  }

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.patch('/users/me', { name });
      updateUser({ name });
      setMessage({ type: 'success', text: 'Name updated.' });
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
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Could not change password.',
      });
    } finally {
      setSaving(false);
    }
  }

  function handlePickPhoto() {
    setAvatarError(null);
    fileInputRef.current?.click();
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setAvatarError(`Image must be under ${MAX_AVATAR_MB}MB.`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setAvatarError(null);
    setAvatarUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ avatar_url: res.data.avatar_url });
    } catch (err: any) {
      setAvatarError(err.response?.data?.detail || 'Could not upload photo. Please try again.');
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleRemovePhoto() {
    setAvatarRemoving(true);
    setAvatarError(null);
    try {
      await api.delete('/users/me/avatar');
      updateUser({ avatar_url: null });
      setAvatarPreview(null);
    } catch (err: any) {
      setAvatarError(err.response?.data?.detail || 'Could not remove photo. Please try again.');
    } finally {
      setAvatarRemoving(false);
    }
  }

  const displayedAvatar = avatarPreview || user?.avatar_url || null;

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl">
      <div className="mb-8 border-b-2 border-double border-navy-900/10 pb-6 dark:border-white/10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
          Members Desk
        </span>
        <h3 className="font-news mt-2 text-3xl font-black text-navy-900 dark:text-white sm:text-4xl">
          Profile &amp; Settings
        </h3>
        <p className="font-news-body mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Manage your account details, password, and how VerifiNews looks for you.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — identity, stats, sign out */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="paper-texture relative overflow-hidden rounded-xl border border-navy-900/10 bg-white p-6 text-center shadow-sm dark:border-navy-700 dark:bg-navy-800">
            {/* Picture section */}
            <div className="relative mx-auto h-20 w-20">
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-orange-600/40 bg-navy-900 font-news text-3xl font-black text-orange-400">
                {displayedAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedAvatar}
                    alt="Profile photo"
                    className={`h-full w-full object-cover ${avatarUploading ? 'opacity-50' : ''}`}
                  />
                ) : (
                  (user?.name || user?.email || '?').charAt(0).toUpperCase()
                )}
              </div>

              <button
                type="button"
                onClick={handlePickPhoto}
                disabled={avatarUploading}
                title="Change photo"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-orange-700 text-white shadow transition hover:bg-orange-800 disabled:opacity-50 dark:border-navy-800"
              >
                <MdCameraAlt className="h-3.5 w-3.5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="relative mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePickPhoto}
                disabled={avatarUploading}
                className="text-[11px] font-bold uppercase tracking-wide text-orange-700 hover:text-orange-800 disabled:opacity-50"
              >
                {avatarUploading ? 'Uploading…' : displayedAvatar ? 'Change Photo' : 'Add Photo'}
              </button>
              {displayedAvatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={avatarUploading || avatarRemoving}
                  className="flex items-center gap-0.5 text-[11px] font-bold uppercase tracking-wide text-gray-400 hover:text-red-600 disabled:opacity-50"
                >
                  <MdDeleteOutline className="h-3.5 w-3.5" />
                  {avatarRemoving ? 'Removing…' : 'Remove'}
                </button>
              )}
            </div>

            {avatarError && (
              <p className="relative mt-2 text-[11px] text-red-600">{avatarError}</p>
            )}

            <h4 className="font-news relative mt-4 text-xl font-black text-navy-900 dark:text-white">
              {user?.name || 'Member'}
            </h4>
            <p className="relative mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
            {user?.role && (
              <span className="relative mt-3 inline-flex items-center gap-1 rounded-full border border-orange-600/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
                <MdVerifiedUser className="h-3 w-3" />
                {user.role}
              </span>
            )}
          </div>

          {stats && stats.total > 0 && (
            <div className="grid grid-cols-3 divide-x divide-navy-900/10 overflow-hidden rounded-xl border border-navy-900/10 bg-white dark:divide-white/10 dark:border-navy-700 dark:bg-navy-800">
              <div className="px-2 py-4 text-center">
                <p className="font-news text-xl font-black text-navy-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Checked
                </p>
              </div>
              <div className="px-2 py-4 text-center">
                <p className="font-news text-xl font-black text-green-700">{stats.real}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Verified
                </p>
              </div>
              <div className="px-2 py-4 text-center">
                <p className="font-news text-xl font-black text-red-600">{stats.fake}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Flagged
                </p>
              </div>
            </div>
          )}

          {stats && stats.total === 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-navy-900/10 bg-white/70 p-4 text-sm text-gray-500 dark:border-white/10 dark:bg-navy-800/50 dark:text-gray-400">
              <MdOutlineFactCheck className="h-5 w-5 shrink-0 text-orange-700" />
              No checks yet — your activity will show up here.
            </div>
          )}

          {/* Preferences */}
          <div className="rounded-xl border border-navy-900/10 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800">
            <h4 className="font-news mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Preferences
            </h4>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex w-full items-center justify-between rounded-lg border border-navy-900/10 px-4 py-3 text-sm font-medium text-navy-700 transition hover:bg-navy-900/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                {darkmode ? (
                  <MdDarkMode className="h-4 w-4 text-orange-600" />
                ) : (
                  <MdLightMode className="h-4 w-4 text-orange-600" />
                )}
                {darkmode ? 'Dark mode' : 'Light mode'}
              </span>
              <span
                className={`relative h-5 w-9 rounded-full transition ${
                  darkmode ? 'bg-orange-700' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                    darkmode ? 'left-4' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-500/20 dark:bg-navy-800 dark:hover:bg-red-500/10"
          >
            <MdLogout className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Right column — forms */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <form
            onSubmit={handleNameSave}
            className="rounded-xl border border-navy-900/10 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
          >
            <h4 className="font-news mb-4 flex items-center gap-2 text-lg font-bold text-navy-700 dark:text-white">
              <MdPersonOutline className="h-5 w-5 text-orange-700" />
              Basic Info
            </h4>
            <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
              Full Name
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
              Email
            </label>
            <input
              value={user?.email || ''}
              disabled
              className="mb-4 w-full cursor-not-allowed rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-sm text-gray-500 dark:border-navy-600 dark:bg-navy-900"
            />
            <button
              type="submit"
              disabled={saving}
              className="linear rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              Save Name
            </button>
          </form>

          <form
            onSubmit={handlePasswordSave}
            className="rounded-xl border border-navy-900/10 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800"
          >
            <h4 className="font-news mb-4 flex items-center gap-2 text-lg font-bold text-navy-700 dark:text-white">
              <MdLockOutline className="h-5 w-5 text-orange-700" />
              Change Password
            </h4>
            <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
            <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={saving || !currentPassword || !newPassword}
              className="linear rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}