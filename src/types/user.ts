export type BackendRole = 'ADMIN' | 'KITCHEN' | 'CASHIER' | 'WAITRESS';
export type FrontendRole = 'admin' | 'kitchen' | 'cashier' | 'waiter';

export const ROLE_LABELS: Record<BackendRole, string> = {
  ADMIN: 'Administrador',
  KITCHEN: 'Cocina',
  CASHIER: 'Cajero',
  WAITRESS: 'Mesero',
};

export const ROLE_ICONS: Record<BackendRole, keyof typeof import('@expo/vector-icons').Ionicons.glyphs> = {
  ADMIN: 'shield-checkmark',
  KITCHEN: 'restaurant',
  CASHIER: 'person',
  WAITRESS: 'walk',
};

export const ROLE_COLORS: Record<BackendRole, string> = {
  ADMIN: '#3B82F6',
  KITCHEN: '#F59E0B',
  CASHIER: '#10B981',
  WAITRESS: '#8B5CF6',
};

export const ROLE_MAP_TO_BACKEND: Record<FrontendRole, BackendRole> = {
  admin: 'ADMIN',
  kitchen: 'KITCHEN',
  cashier: 'CASHIER',
  waiter: 'WAITRESS',
};

export const ROLE_MAP_FROM_BACKEND: Record<BackendRole, FrontendRole> = {
  ADMIN: 'admin',
  KITCHEN: 'kitchen',
  CASHIER: 'cashier',
  WAITRESS: 'waiter',
};

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  role: BackendRole;
  active: boolean;
  birthdate?: string | null;
  entryDate?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: FrontendRole;
  tempPassword?: string;
}

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthdate?: string;
  entryDate?: string;
}

export interface UpdateRoleInput {
  role: BackendRole;
}

export interface UpdateUserStatusInput {
  active: boolean;
}
