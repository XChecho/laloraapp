import { fetchGeneral } from '../api/generalActions';

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  active: boolean;
  itemsCount: number;
  displayOrder: number;
}

export const menuCategoriesApi = {
  getAll: () => fetchGeneral<MenuCategory[]>('categories', 'GET'),
};