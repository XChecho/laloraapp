import { create } from 'zustand';
import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';
import { loginAction } from '@core/actions/login.action';

interface AuthState {
  isLoggedIn: boolean;
  isHydrated: boolean;
  firstName: string | null;
  lastName: string | null;
  userType: string | null;
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const STORAGE_KEYS = {
  firstName: 'firstName',
  lastName: 'lastName',
  userType: 'userType',
  token: 'token',
  email: 'email',
  isLoggedIn: 'isLoggedIn',
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isHydrated: false,
  firstName: null,
  lastName: null,
  userType: null,
  token: null,
  email: null,
  login: async (email: string, password: string) => {
    try {
      const userData = await loginAction(email, password);
      
      await SecureStorageAdapter.setItem(STORAGE_KEYS.firstName, userData.firstName);
      await SecureStorageAdapter.setItem(STORAGE_KEYS.lastName, userData.lastName);
      await SecureStorageAdapter.setItem(STORAGE_KEYS.userType, userData.userType);
      await SecureStorageAdapter.setItem(STORAGE_KEYS.token, userData.token);
      await SecureStorageAdapter.setItem(STORAGE_KEYS.email, userData.email);
      await SecureStorageAdapter.setItem(STORAGE_KEYS.isLoggedIn, 'true');

      set({
        isLoggedIn: true,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType: userData.userType,
        token: userData.token,
        email: userData.email,
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },
  logout: async () => {
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.firstName);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.lastName);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.userType);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.token);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.email);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.isLoggedIn);

    set({
      isLoggedIn: false,
      firstName: null,
      lastName: null,
      userType: null,
      token: null,
      email: null,
    });
  },
  checkAuthStatus: async () => {
    const isLoggedIn = await SecureStorageAdapter.getItem(STORAGE_KEYS.isLoggedIn);
    const firstName = await SecureStorageAdapter.getItem(STORAGE_KEYS.firstName);
    const lastName = await SecureStorageAdapter.getItem(STORAGE_KEYS.lastName);
    const userType = await SecureStorageAdapter.getItem(STORAGE_KEYS.userType);
    const token = await SecureStorageAdapter.getItem(STORAGE_KEYS.token);
    const email = await SecureStorageAdapter.getItem(STORAGE_KEYS.email);

    set({
      isLoggedIn: isLoggedIn === 'true',
      isHydrated: true,
      firstName,
      lastName,
      userType,
      token,
      email,
    });
  },
}));