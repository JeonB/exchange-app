import type { ApiResponse, ApiError } from "../types/api.types";
import { API_BASE_URL } from "../constants/api";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data: ApiResponse<T> | ApiError = await response.json();

  if (!response.ok || data.code !== "OK") {
    const error = data as ApiError;
    throw new Error(error.message || "API 요청에 실패했습니다.");
  }

  return (data as ApiResponse<T>).data as T;
}
