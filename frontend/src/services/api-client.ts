const API_BASE_URL = import.meta.env.VITE_DEV_URL;
const AUTH_HEADER = 'Authorization';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const apiClient = {
  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { [AUTH_HEADER]: token } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new ApiError(response.status, message || 'API Error');
    }

    return response.json();
  },
};