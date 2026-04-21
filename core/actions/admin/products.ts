import { fetchGeneral } from '../api/generalActions';

export interface AdminProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  enabled?: boolean;
  displayOrder?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  enabled?: boolean;
  displayOrder?: number;
}

export const adminProductsApi = {
  getByCategory: (categoryId: string) =>
    fetchGeneral<AdminProduct[]>(`admin/categories/${categoryId}/products`, 'GET'),

  getById: (id: string) => fetchGeneral<AdminProduct>(`admin/products/${id}`, 'GET'),

  create: (data: CreateProductInput) =>
    fetchGeneral<AdminProduct>('admin/products', 'POST', data),

  update: (id: string, data: UpdateProductInput) =>
    fetchGeneral<AdminProduct>(`admin/products/${id}`, 'PUT', data),

  toggleStatus: (id: string, enabled: boolean) =>
    fetchGeneral<AdminProduct>(`admin/products/${id}/status`, 'PUT', { enabled }),

  delete: (id: string) =>
    fetchGeneral<AdminProduct>(`admin/products/${id}`, 'DELETE'),
};