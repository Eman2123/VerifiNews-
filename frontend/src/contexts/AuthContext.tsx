'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { setAuth, clearToken } from '../lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function redirectByRole(role: string) {
    router.push(role === 'admin' ? '/admin/default' : '/dashboard/default');
  }

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      setAuth(access_token, userData.role);
      setUser(userData);
      redirectByRole(userData.role);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword(email: string) {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Could not send reset link. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', { token, new_password: newPassword });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Could not reset password. The link may have expired.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function signup(name: string, email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const { access_token, user: userData } = res.data;
      setAuth(access_token, userData.role);
      setUser(userData);
      redirectByRole(userData.role);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push('/auth/sign-in');
  }

  // Merge partial updates (e.g. new name or avatar_url) into the current user
  // without needing a full re-fetch or page reload.
  function updateUser(patch: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, error, updateUser, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}