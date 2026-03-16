import { apiClient } from './api-client';
import type {
  User,
  UpdateUserDto,
  UpdateServiceDto,
  Service,
} from '../types/index';

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

  updateService(serviceId: number, data: UpdateServiceDto) {
    return apiClient.request<Service>(`/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteService(serviceId: number) {
    return apiClient.request<void>(`/services/${serviceId}`, {
      method: 'DELETE',
    });
  },

  async createService(data: UpdateServiceDto) {
    return apiClient.request<Service>(`/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
