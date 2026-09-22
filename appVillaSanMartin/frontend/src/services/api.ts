import axios from 'axios';

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim() || '/api';
  const cleanUrl = configuredUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

function isPublicReadRequest(method?: string, url?: string) {
  if (method?.toLowerCase() !== 'get' || !url) return false;
  const path = url.split('?')[0];
  return [
    /^\/players(?:\/\d+)?$/,
    /^\/stats(?:\/|$)/,
    /^\/matches(?:\/|$)/,
    /^\/fixture(?:\/|$)/,
    /^\/products(?:\/|$)/,
    /^\/news(?:\/|$)/,
    /^\/galleries(?:\/|$)/,
    /^\/videos(?:\/|$)/,
    /^\/cantina(?:\/|$)/,
    /^\/membership\/types$/,
    /^\/membership\/check(?:\/|$)/,
    /^\/benefits(?:\/|$)/,
    /^\/staff(?:\/|$)/,
  ].some((pattern) => pattern.test(path));
}

// Adjunta el JWT a cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !isPublicReadRequest(config.method, config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirige al login si el token expiró
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
