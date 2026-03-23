import { environment } from '../assets/environment/environment.ts';
const BASE_URL = environment.baseUrl;

export const apiService = async <T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string; status: number }> => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        ...(token ? { Authorization: token } : {}),
      },
      ...options,
    });

    const status = response.status;
    if (!response.ok) {
      let errorMessage = "Failed request";
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (error){
         console.log("Server error", error)
      }

      return { error: errorMessage, status };
    }

    const data = await response.json();
    return { data, status };

  } catch (error) {
    return { error: (error as Error).message || "Network Error", status: 0 };
  }
};