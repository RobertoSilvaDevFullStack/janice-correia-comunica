import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

// Request interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const hdrs = (config.headers || {}) as Record<string, string>;
    if (config.data instanceof FormData) {
      delete hdrs['Content-Type'];
    } else {
      hdrs['Content-Type'] = 'application/json';
    }
    config.headers = hdrs;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para tratamento de erros global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido/expirado ou acesso negado
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
