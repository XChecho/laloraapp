import { fetchGeneral } from '../api/generalActions';

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  enabled: boolean;
  productsCount: number;
  displayOrder: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}

export const adminCategoriesApi = {
  getAll: () => fetchGeneral<AdminCategory[]>('admin/categories', 'GET'),

  getById: (id: string) => fetchGeneral<AdminCategory>(`admin/categories/${id}`, 'GET'),

  create: (data: CreateCategoryInput) =>
    fetchGeneral<AdminCategory>('admin/categories', 'POST', data),

  update: (id: string, data: UpdateCategoryInput) =>
    fetchGeneral<AdminCategory>(`admin/categories/${id}`, 'PUT', data),

  toggleStatus: (id: string, enabled: boolean) =>
    fetchGeneral<AdminCategory>(`admin/categories/${id}/status`, 'PUT', { enabled }),

  delete: (id: string) =>
    fetchGeneral<AdminCategory>(`admin/categories/${id}`, 'DELETE'),
};