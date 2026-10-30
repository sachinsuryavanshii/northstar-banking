import axios from 'axios';

// Smart resolution for API base URL:
// 1. Explicit VITE_API_URL if configured
// 2. If opened on Kubernetes NodePort 30173 -> talk to Gateway NodePort 30080
// 3. If opened on Compose port 5173 -> talk to Gateway port 8084
// 4. Fallback to http://localhost:8084
const defaultBaseUrl = typeof window !== 'undefined' && window.location.port === '30173'
  ? 'http://localhost:30080'
  : (typeof window !== 'undefined' && window.location.port === '5173'
      ? 'http://localhost:8084'
      : 'http://localhost:8084');

const API_BASE_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '')
  ? import.meta.env.VITE_API_URL
  : defaultBaseUrl;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject Authorization Bearer token from localStorage
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized by clearing session and redirecting to login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config && (
        error.config.url.includes('/api/auth/login') ||
        error.config.url.includes('/api/auth/register')
      );
      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
