import { create } from 'zustand';
import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';
import { loginAction } from '@core/actions/login.action';
import { useAlertStore } from './useAlertStore';

interface AuthState {
  isLoggedIn: boolean;
  isHydrated: boolean;
  firstName: string | null;
  lastName: string | null;
  userType: string | null;
  token: string | null;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  updateProfile: (data: Partial<AuthState>) => Promise<void>;
}

const STORAGE_KEYS = {
  firstName: 'firstName',
  lastName: 'lastName',
  userType: 'userType',
  token: 'token',
  email: 'email',
  phone: 'phone',
  profileImage: 'profileImage',
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
  phone: null,
  profileImage: null,
  login: async (email: string, password: string) => {
    const showAlert = useAlertStore.getState().showAlert;
    
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

      showAlert({
        type: 'success',
        title: 'Bienvenido',
        description: `${userData.firstName} ${userData.lastName}`,
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      showAlert({
        type: 'error',
        title: 'Credenciales incorrectas',
        description: 'Por favor verifica tu email y contraseña',
      });
      return false;
    }
  },
  logout: async () => {
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.firstName);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.lastName);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.userType);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.token);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.email);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.phone);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.profileImage);
    await SecureStorageAdapter.removeItem(STORAGE_KEYS.isLoggedIn);

    set({
      isLoggedIn: false,
      firstName: null,
      lastName: null,
      userType: null,
      token: null,
      email: null,
      phone: null,
      profileImage: null,
    });
  },
  checkAuthStatus: async () => {
    const isLoggedIn = await SecureStorageAdapter.getItem(STORAGE_KEYS.isLoggedIn);
    const firstName = await SecureStorageAdapter.getItem(STORAGE_KEYS.firstName);
    const lastName = await SecureStorageAdapter.getItem(STORAGE_KEYS.lastName);
    const userType = await SecureStorageAdapter.getItem(STORAGE_KEYS.userType);
    const token = await SecureStorageAdapter.getItem(STORAGE_KEYS.token);
    const email = await SecureStorageAdapter.getItem(STORAGE_KEYS.email);
    const phone = await SecureStorageAdapter.getItem(STORAGE_KEYS.phone);
    const profileImage = await SecureStorageAdapter.getItem(STORAGE_KEYS.profileImage);

    set({
      isLoggedIn: isLoggedIn === 'true',
      isHydrated: true,
      firstName,
      lastName,
      userType,
      token,
      email,
      phone,
      profileImage,
    });
  },
  updateProfile: async (data) => {
    if (data.firstName !== undefined) {
      await SecureStorageAdapter.setItem(STORAGE_KEYS.firstName, data.firstName || '');
    }
    if (data.lastName !== undefined) {
      await SecureStorageAdapter.setItem(STORAGE_KEYS.lastName, data.lastName || '');
    }
    if (data.phone !== undefined) {
      await SecureStorageAdapter.setItem(STORAGE_KEYS.phone, data.phone || '');
    }
    if (data.profileImage !== undefined) {
      await SecureStorageAdapter.setItem(STORAGE_KEYS.profileImage, data.profileImage || '');
    }

    set((state) => ({
      ...state,
      ...data,
    }));
  },
}));