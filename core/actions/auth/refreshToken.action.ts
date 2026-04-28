import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4001';

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export async function refreshTokenAction(refreshToken: string): Promise<RefreshTokenResponse | null> {
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Token refresh failed');
  }

  return {
    access_token: json.data.access_token,
    refresh_token: json.data.refresh_token,
  };
}

export async function checkTokenStatusAction(): Promise<{ expiresIn: number; needsRefresh: boolean }> {
  const token = await SecureStorageAdapter.getItem('token');
  if (!token) return { expiresIn: 0, needsRefresh: true };

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = (decoded.exp * 1000) - Date.now();
    return { expiresIn, needsRefresh: expiresIn < 5 * 60 * 1000 };
  } catch {
    return { expiresIn: 0, needsRefresh: true };
  }
}
