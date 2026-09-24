import axios from 'axios';

// Centralized API Base URL configuration
// Prioritizes import.meta.env.VITE_API_URL, with production Render fallback and localhost for local development
const rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://lost-found-app-969o.onrender.com/api'
    : 'http://localhost:5000/api');
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common auth errors (e.g. 401 token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials on unauthenticated API calls
      const isAuthRequest = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
