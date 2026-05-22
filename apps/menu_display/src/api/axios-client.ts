import axios, { type AxiosInstance, type AxiosError } from 'axios';

const AxiosClient: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_API_URL as string) || 'http://localhost:3000',
  timeout: (import.meta.env.VITE_BACKEND_API_TIMEOUT as number) || 5000,
  headers: { 'Content-Type': 'application/json' },
});

AxiosClient.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

AxiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Logic for redirecting to login or refreshing tokens
      // Continue with other error status codes as needed
    }

    return Promise.reject(error);
  },
);

export default AxiosClient;
