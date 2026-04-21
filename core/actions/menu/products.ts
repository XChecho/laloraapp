import { fetchGeneral } from '../api/generalActions';

export interface MenuProduct {
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

export const menuProductsApi = {
  getByCategory: (categoryId: string) =>
    fetchGeneral<MenuProduct[]>(`categories/${categoryId}/products`, 'GET'),
};