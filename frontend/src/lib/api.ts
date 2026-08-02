import axios from 'axios';
import { getToken, clearToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Attach JWT to every outgoing request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, backend returns 401 — log the user out
// and send them back to sign-in instead of showing a broken page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
