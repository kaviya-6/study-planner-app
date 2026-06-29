import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000',
});

// Interceptor to inject the active JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sp_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
