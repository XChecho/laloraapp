import { create } from 'zustand';
import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';

interface AuthState {
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isHydrated: false,
  login: async () => {
    await SecureStorageAdapter.setItem('isLoggedIn', 'true');
    set({ isLoggedIn: true });
  },
  logout: async () => {
    await SecureStorageAdapter.removeItem('isLoggedIn');
    set({ isLoggedIn: false });
  },
  checkAuthStatus: async () => {
    const value = await SecureStorageAdapter.getItem('isLoggedIn');
    set({ isLoggedIn: value === 'true', isHydrated: true });
  },
}));
