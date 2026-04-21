import { useQuery } from '@tanstack/react-query';
import { menuCategoriesApi } from '@core/actions/menu/categories';

export const MENU_CATEGORIES_KEY = ['menu', 'categories'];

export function useMenuCategories() {
  return useQuery({
    queryKey: MENU_CATEGORIES_KEY,
    queryFn: () => menuCategoriesApi.getAll(),
  });
}