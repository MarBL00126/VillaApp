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
    /^\/game-center(?:\/|$)/,
    /^\/standings(?:\/|$)/,
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

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

// Una sola renovaci?n a la vez: los requests que fallan juntos esperan el mismo refresh.
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refreshToken = localStorage.getItem('refreshToken');
    refreshPromise = axios
      .post<{ token: string; refreshToken: string }>(`${getApiBaseUrl()}/auth/refresh`, { refreshToken })
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function isAuthRequest(url?: string) {
  return !!url && (url.startsWith('/users/login') || url.startsWith('/users/register') || url.startsWith('/auth/'));
}

// Ante un 401 intenta renovar el JWT con el refresh token y reintenta el request; si no se puede, va al login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (original && !original._retry && !isAuthRequest(original.url) && localStorage.getItem('refreshToken')) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // el refresh token venci? o fue revocado: se cierra la sesi?n abajo
      }
    }

    clearSession();
    window.location.href = '/login';
    return Promise.reject(error);
  }
);

export default api;
