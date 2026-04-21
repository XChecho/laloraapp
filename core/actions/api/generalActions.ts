import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';

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

export async function fetchGeneral<T>(
  url: string,
  method: HTTPMethod = 'GET',
  body?: any
): Promise<T> {
  const token = await SecureStorageAdapter.getItem('token');
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
