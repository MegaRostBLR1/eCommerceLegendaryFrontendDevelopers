import { environment } from '../assets/environment/environment.ts';

const BASE_URL = environment.baseUrl;

export const apiService = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        ...(token ? { Authorization: `${token}` } : {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `Error: ${response.status}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('api Error:', error);
    throw error;
  }
};
