import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { userService } from '../user.service.ts';
import { apiClient } from '../api-client';
import type {UpdateServiceDto, UpdateUserDto} from "../../types";

vi.mock('../api-client', () => ({
  apiClient: {
    request: vi.fn(),
  },
}));

describe('UserService', () => {
  const mockRequest = vi.mocked(apiClient.request);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch user profile by ID', async () => {
    const mockUser = {
      id: 123,
      firstName: 'John',
      lastName: 'Doe',
      patronymic: 'Michael',
      email: 'john@example.com',
      role: 'user' as const,
    };
    mockRequest.mockResolvedValueOnce(mockUser);

    const result = await userService.getProfile(123);

    expect(result).toEqual(mockUser);
    expect(mockRequest).toHaveBeenCalledWith('/users/123');
  });

  it('should update user profile with new data', async () => {
    const updatedData: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      patronymic: 'Alex',
      email: 'jane@example.com',
    };

    const mockUpdatedUser = {
      id: 456,
      ...updatedData,
      role: 'admin' as const,
    };

    mockRequest.mockResolvedValueOnce(mockUpdatedUser);

    const result = await userService.updateProfile(456, updatedData);

    expect(result).toEqual(mockUpdatedUser);
    expect(mockRequest).toHaveBeenCalledWith('/users/456', {
      method: 'PATCH',
      body: JSON.stringify(updatedData),
    });
  });

  it('should update service with new data', async () => {
    const serviceUpdate: UpdateServiceDto = {
      name: 'Updated Service',
      amount: 1500,
      duration: '2 hours',
    };

    const mockUpdatedService = {
      id: 789,
      ...serviceUpdate,
      workersCount: 3,
      description: 'Test',
      categories: [],
    };

    mockRequest.mockResolvedValueOnce(mockUpdatedService);

    const result = await userService.updateService(789, serviceUpdate);

    expect(result).toEqual(mockUpdatedService);
    expect(mockRequest).toHaveBeenCalledWith('/services/789', {
      method: 'PATCH',
      body: JSON.stringify(serviceUpdate),
    });
  });

  it('should delete service by ID', async () => {
    mockRequest.mockResolvedValueOnce(undefined);

    await userService.deleteService(999);

    expect(mockRequest).toHaveBeenCalledWith('/services/999', {
      method: 'DELETE',
    });
  });

  it('should handle profile update with optional role field', async () => {
    const updateData: UpdateUserDto & { role?: string } = {
      firstName: 'Admin',
      lastName: 'User',
      patronymic: '',
      email: 'admin@test.com',
      role: 'admin',
    };

    const mockResponse = {
      id: 1,
      ...updateData,
    };

    mockRequest.mockResolvedValueOnce(mockResponse);

    const result = await userService.updateProfile(1, updateData);

    expect(result).toEqual(mockResponse);
    expect(mockRequest).toHaveBeenCalledWith('/users/1', {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  });
});