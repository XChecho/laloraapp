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
  category?: {
    modifierLists?: CategoryModifierList[];
  };
}

export interface CategoryModifierList {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  affectsKitchen: boolean;
  options: CategoryModifierOption[];
}

export interface CategoryModifierOption {
  id: string;
  name: string;
  priceExtra: number;
  stock: number;
}

export interface Modifier {
  name: string;
  options: string[];
  required: boolean;
  multiple: boolean;
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  description?: string;
  icon: string;
  active: boolean;
  itemsCount: number;
  displayOrder: number;
  modifierLists: CategoryModifierList[];
  products: MenuProduct[];
}

export const menuProductsApi = {
  getByCategory: (categoryId: string) =>
    fetchGeneral<MenuProduct[]>(`categories/${categoryId}/products`, 'GET'),

  getAllWithProducts: () =>
    fetchGeneral<CategoryWithProducts[]>('categories/all-products', 'GET'),
};