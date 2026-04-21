const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  profileImage: string;
}

async function getAuthToken(): Promise<string | null> {
  const { SecureStorageAdapter } = await import('@core/adapters/secure-storage.adapter');
  return await SecureStorageAdapter.getItem('token');
}

export async function updateProfileAction(data: UpdateProfileRequest): Promise<ProfileResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar perfil' }));
    throw new Error(error.message || 'Error al actualizar perfil');
  }

  return await response.json();
}

export async function changePasswordAction(currentPassword: string, newPassword: string): Promise<void> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al cambiar contraseña' }));
    throw new Error(error.message || 'Error al cambiar contraseña');
  }
}

export async function getProfileAction(): Promise<ProfileResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener perfil' }));
    throw new Error(error.message || 'Error al obtener perfil');
  }

  return await response.json();
}