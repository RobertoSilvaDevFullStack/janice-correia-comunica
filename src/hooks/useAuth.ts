import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
  });
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};
