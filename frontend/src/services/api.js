// FILE: src/services/api.js
// This is the ONLY file that creates the axios instance.
// Every other service imports THIS — never raw axios directly.
// 
// .env (development):   REACT_APP_API_URL=http://localhost:8080/api/v1
// .env.production:      REACT_APP_API_URL=https://api.yourdomain.com/api/v1

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR — attach JWT + fix Content-Type
// ══════════════════════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    // Attach token if present
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CRITICAL: If sending FormData, delete Content-Type so browser sets
    // it automatically with the correct multipart boundary.
    // If sending JSON, set it explicitly.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // Dev-mode token debug (remove in production)
    if (import.meta.env.DEV) {
      console.debug('[API]', config.method?.toUpperCase(), config.url,
        token ? '✓ Token attached' : '✗ NO TOKEN');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ══════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR — unwrap data + handle auth errors
// ══════════════════════════════════════════════════════════════
api.interceptors.response.use(
  // Success: unwrap .data so callers get the payload directly
  (response) => response.data,

  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message
                 || error.response?.data?.error
                 || error.message
                 || 'An error occurred';

    if (status === 401) {
      // Token expired or invalid — force logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject('Session expired. Please log in again.');
    }

    if (status === 403) {
      // Authenticated but wrong role — do NOT redirect, just surface the error
      console.error('[API 403] Access denied. Are you logged in as ADMIN?');
      return Promise.reject(
        'Access denied. Please make sure you are logged in as an administrator.'
      );
    }

    if (status === 413) {
      return Promise.reject('File is too large. Maximum size is 10MB.');
    }

    return Promise.reject(message);
  }
);

// ══════════════════════════════════════════════════════════════
// HELPER — build absolute media URL from a relative file path
// This fixes the "image not showing" bug where fileUrl is relative
// ══════════════════════════════════════════════════════════════
export const buildMediaUrl = (fileUrl) => {
  if (!fileUrl) return null;
  // Already absolute (YouTube thumbnails, external URLs)
  if (fileUrl.startsWith('http')) return fileUrl;
  // Relative path from backend — prepend backend origin
  const backendOrigin = BASE_URL.replace('/api/v1', '');
  return `${backendOrigin}${fileUrl}`;
};


export default api;