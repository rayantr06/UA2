import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const savedAuth = localStorage.getItem('edumanager_auth');
    let parsedAuth = null;

    if (savedAuth) {
      try {
        parsedAuth = JSON.parse(savedAuth);
      } catch {
        localStorage.removeItem('edumanager_auth');
      }
    }

    const token = parsedAuth?.token || localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
