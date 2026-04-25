import { fetchGeneral } from '../api/generalActions';

export interface AdminProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  imageId?: string;
  stock: number;
  available: boolean;
  displayOrder?: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  imageId?: string;
  stock?: number;
  available?: boolean;
  displayOrder?: number;
  imageFile?: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  imageId?: string;
  stock?: number;
  available?: boolean;
  displayOrder?: number;
  imageFile?: {
    uri: string;
    name: string;
    type: string;
  };
}

function createFormData(data: CreateProductInput | UpdateProductInput): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'imageFile' && value) {
      formData.append('image', {
        uri: value.uri,
        name: value.name || 'photo.jpg',
        type: value.type || 'image/jpeg',
      } as any);
    } else if (value !== undefined && value !== null) {
      if (key === 'price' || key === 'stock' || key === 'displayOrder') {
        formData.append(key, Number(value));
      } else if (key === 'available') {
        formData.append(key, Boolean(value).toString());
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
}

export const adminProductsApi = {
  getByCategory: (categoryId: string) =>
    fetchGeneral<AdminProduct[]>(`admin/products/categories/${categoryId}`, 'GET'),

  getById: (id: string) => fetchGeneral<AdminProduct>(`admin/products/${id}`, 'GET'),

  create: async (data: CreateProductInput) => {
    if (data.imageFile) {
      const formData = createFormData(data);
      return fetchGeneral<AdminProduct>('admin/products', 'POST', formData);
    }
    return fetchGeneral<AdminProduct>('admin/products', 'POST', data);
  },

  update: async (id: string, data: UpdateProductInput) => {
    if (data.imageFile) {
      const formData = createFormData(data);
      return fetchGeneral<AdminProduct>(`admin/products/${id}`, 'PUT', formData);
    }
    return fetchGeneral<AdminProduct>(`admin/products/${id}`, 'PUT', data);
  },

  toggleStatus: (id: string, enabled: boolean) =>
    fetchGeneral<AdminProduct>(`admin/products/${id}/status`, 'PUT', { enabled }),

  restock: (id: string, quantity: number) =>
    fetchGeneral<AdminProduct>(`admin/products/${id}/restock`, 'PUT', { quantity }),

  restockAll: (categoryId?: string) =>
    fetchGeneral<{ restocked: number }>('admin/products/restock-all', 'POST', { categoryId }),

  delete: (id: string) =>
    fetchGeneral<AdminProduct>(`admin/products/${id}`, 'DELETE'),
};
