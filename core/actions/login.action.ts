const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginResponse {
  firstName: string;
  lastName: string;
  userType: string;
  token: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function loginAction(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    userType: data.userType,
    token: data.token,
    email: data.email,
  };
}