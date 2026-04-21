const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginResponse {
  token: string;
  firstName: string;
  lastName: string;
  userType: string;
  email: string;
  phone?: string;
  profileImage?: string;
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

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Login failed');
  }

  const data = json.data;
  
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    userType: data.userType,
    token: data.access_token,
    email: email,
    phone: data.phone,
    profileImage: data.profileImage,
  };
}