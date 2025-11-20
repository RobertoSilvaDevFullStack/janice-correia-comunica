import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

// Request interceptor para adicionar token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    const headers = config.headers;
    const isForm = typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (headers instanceof AxiosHeaders) {
      if (token) headers.set('Authorization', `Bearer ${token}`);
      if (isForm) headers.delete('Content-Type'); else headers.set('Content-Type', 'application/json');
    } else {
      const hdrs = (headers || {}) as Record<string, string>;
      if (token) hdrs['Authorization'] = `Bearer ${token}`;
      if (isForm) delete hdrs['Content-Type']; else hdrs['Content-Type'] = 'application/json';
      config.headers = hdrs;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor para tratamento de erros global
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
