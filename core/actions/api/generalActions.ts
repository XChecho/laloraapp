import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';
import { useAuthStore } from '@src/store/useAuthStore';
import { refreshTokenAction } from '../auth/refreshToken.action';

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ApiError {
  statusCode: number;
  message: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

function unwrapResponse<T>(response: any): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }
  return response as T;
}

async function refreshToken(refreshToken: string | null): Promise<string | null> {
  if (!refreshToken) {
    console.warn('No refresh token available, logging out');
    await useAuthStore.getState().logout();
    return null;
  }

  try {
    const result = await refreshTokenAction(refreshToken);
    if (!result) {
      return null;
    }
    await SecureStorageAdapter.setItem('token', result.access_token);
    await SecureStorageAdapter.setItem('refreshToken', result.refresh_token);
    useAuthStore.getState().updateProfile({
      token: result.access_token,
      refreshToken: result.refresh_token,
    });
    return result.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await useAuthStore.getState().logout();
    return null;
  }
}

export async function fetchGeneral<T>(
  url: string,
  method: HTTPMethod = 'GET',
  body?: any
): Promise<T> {
  const token = await SecureStorageAdapter.getItem('token');
  const storedRefreshToken = await SecureStorageAdapter.getItem('refreshToken');
  const headers = new Headers();

  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const uri = `${process.env.EXPO_PUBLIC_API_URL}/${url}`;

  const response = await fetch(uri, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  console.log(response);

  if (response.status === 401) {
    const newToken = await refreshToken(storedRefreshToken);
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      const retryResponse = await fetch(uri, {
        method,
        headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      });

      if (!retryResponse.ok) {
        const error: ApiError = await retryResponse.json().catch(() => ({
          statusCode: retryResponse.status,
          message: 'An error occurred',
        }));
        throw new Error(error.message || `Error ${retryResponse.status}`);
      }

      const rawResponse = await retryResponse.json();
      return unwrapResponse<T>(rawResponse);
    }
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      message: 'An error occurred',
    }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const rawResponse = await response.json();
  return unwrapResponse<T>(rawResponse);
}
