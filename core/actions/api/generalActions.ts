import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';
import { useAuthStore } from '@src/store/useAuthStore';
import { refreshTokenAction } from '../auth/refreshToken.action';

let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startTokenRefreshMonitor() {
  if (refreshInterval) return;

  refreshInterval = setInterval(async () => {
    const token = await SecureStorageAdapter.getItem('token');
    const storedRefreshToken = await SecureStorageAdapter.getItem('refreshToken');

    if (!token || !storedRefreshToken) {
      stopTokenRefreshMonitor();
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = (decoded.exp * 1000) - Date.now();

      if (expiresIn < 5 * 60 * 1000) {
        const newToken = await refreshToken(storedRefreshToken);
        if (!newToken) {
          stopTokenRefreshMonitor();
        }
      }
    } catch (error) {
      console.error('Token refresh monitor error:', error);
    }
  }, 2 * 60 * 1000);
}

export function stopTokenRefreshMonitor() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: string[];
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

function parseErrorMessage(statusCode: number, body: any): string {
  if (!body) return `Error ${statusCode}`;

  let message = body.message || 'An error occurred';

  if (Array.isArray(message)) {
    message = message.join(', ');
  }

  if (body.errors && Array.isArray(body.errors) && body.errors.length > 0) {
    const details = body.errors.join(', ');
    if (!message.includes(details)) {
      message = `${message} - ${details}`;
    }
  }

  return message || `Error ${statusCode}`;
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
        const errorBody = await retryResponse.json().catch(() => null);
        const message = errorBody
          ? parseErrorMessage(retryResponse.status, errorBody)
          : `Error ${retryResponse.status}`;
        throw new Error(message);
      }

      const rawResponse = await retryResponse.json();
      return unwrapResponse<T>(rawResponse);
    }
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody
      ? parseErrorMessage(response.status, errorBody)
      : `Error ${response.status}`;
    throw new Error(message);
  }

  const rawResponse = await response.json();
  return unwrapResponse<T>(rawResponse);
}
