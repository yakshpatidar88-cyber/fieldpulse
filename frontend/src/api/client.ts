import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('fieldpulse_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Global 401 Unauthorized handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem('fieldpulse_access_token');
      localStorage.removeItem('fieldpulse_refresh_token');
      localStorage.removeItem('fieldpulse_user');

      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
