import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  },
);

// Auth endpoints
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<{ access_token: string }>('/auth/login', data),
  register: (data: { username: string; password: string }) =>
    api.post<{ access_token: string }>('/auth/register', data),
};

// Accounts endpoints
export interface Account {
  _id: string;
  name: string;
  secret: string;
  url?: string;
  createdAt: string;
}

export interface CreateAccountDto {
  name: string;
  secret: string;
  url?: string;
}

export interface UpdateAccountDto {
  name?: string;
  url?: string;
}

export const accountsApi = {
  getAll: () => api.get<Account[]>('/accounts'),
  create: (data: CreateAccountDto) => api.post<Account>('/accounts', data),
  update: (id: string, data: UpdateAccountDto) => api.put<Account>(`/accounts/${id}`, data),
  delete: (id: string) => api.delete(`/accounts/${id}`),
};
