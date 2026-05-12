import { fetchGeneral } from '../api/generalActions';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UpdateRoleInput,
  UpdateUserStatusInput,
} from '@src/types/user';

export const usersApi = {
  getAll: () => fetchGeneral<User[]>('users', 'GET'),

  getRecent: (limit = 3) => fetchGeneral<User[]>(`users/recent?limit=${limit}`, 'GET'),

  getById: (id: string) => fetchGeneral<User>(`users/${id}`, 'GET'),

  create: (data: CreateUserInput) =>
    fetchGeneral<User>('auth/create-user', 'POST', data),

  update: (id: string, data: UpdateUserInput) =>
    fetchGeneral<User>(`users/${id}`, 'PUT', data),

  updateRole: (id: string, data: UpdateRoleInput) =>
    fetchGeneral<User>(`users/${id}/role`, 'PATCH', data),

  updateStatus: (id: string, data: UpdateUserStatusInput) =>
    fetchGeneral<User>(`users/${id}/status`, 'PATCH', data),

  resetPassword: (id: string) =>
    fetchGeneral<{ success: boolean; message: string }>(`users/${id}/reset-password`, 'POST'),
};
