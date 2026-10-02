import api from './api';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await api.post('/users/register', data);
  },

  // Revoca el refresh token en el backend; si falla, la sesi?n local se cierra igual.
  logout: async (refreshToken: string): Promise<void> => {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // sin acci?n: el token expira solo
    }
  },
};
