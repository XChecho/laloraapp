const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  active: boolean;
  itemsCount: number;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  available: boolean;
  modifiers?: Modifier[];
}

export interface Modifier {
  name: string;
  options: string[];
  required: boolean;
  multiple: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function getAuthToken(): Promise<string | null> {
  const { SecureStorageAdapter } = await import('@core/adapters/secure-storage.adapter');
  return await SecureStorageAdapter.getItem('token');
}

export async function getCategoriesAction(): Promise<Category[]> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  const json: ApiResponse<Category[]> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al obtener categorías');
  }

  return json.data;
}

export async function createCategoryAction(data: {
  name: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}): Promise<Category> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<Category> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al crear categoría');
  }

  return json.data;
}

export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
    active?: boolean;
    displayOrder?: number;
  }
): Promise<Category> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<Category> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al actualizar categoría');
  }

  return json.data;
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  const json: ApiResponse<void> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al eliminar categoría');
  }
}

export async function getProductsByCategoryAction(categoryId: string): Promise<Product[]> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/categories/${categoryId}/products`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  const json: ApiResponse<Product[]> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al obtener productos');
  }

  return json.data;
}

export async function createProductAction(data: {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  available?: boolean;
  modifiers?: Modifier[];
}): Promise<Product> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<Product> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al crear producto');
  }

  return json.data;
}

export async function updateProductAction(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    available?: boolean;
    modifiers?: Modifier[];
  }
): Promise<Product> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<Product> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al actualizar producto');
  }

  return json.data;
}

export async function deleteProductAction(id: string): Promise<void> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  const json: ApiResponse<void> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Error al eliminar producto');
  }
}