import { apiClient } from './api-client';
import type { User, UpdateUserDto } from '../types/index';

export const userService = {
  getProfile(userId: number) {
    return apiClient.request<User>(`/users/${userId}`);
  },

  updateProfile(userId: number, data: UpdateUserDto & { role?: string }) {
    return apiClient.request<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};