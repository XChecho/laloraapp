import { useQuery } from '@tanstack/react-query';
import { menuCategoriesApi } from '@core/actions/menu/categories';
import { useAuthStore } from '@src/store/useAuthStore';

export const MENU_CATEGORIES_KEY = ['menu', 'categories'];

export function useMenuCategories() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: MENU_CATEGORIES_KEY,
    queryFn: () => menuCategoriesApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}