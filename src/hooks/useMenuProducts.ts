import { useQuery } from '@tanstack/react-query';
import { menuProductsApi } from '@core/actions/menu/products';
import { useAuthStore } from '@src/store/useAuthStore';

export const MENU_PRODUCTS_KEY = ['menu', 'products'];

export function useMenuProductsByCategory(categoryId: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...MENU_PRODUCTS_KEY, categoryId],
    queryFn: () => menuProductsApi.getByCategory(categoryId),
    enabled: !!categoryId && isHydrated && isLoggedIn,
  });
}

export function useMenuAllProducts() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...MENU_PRODUCTS_KEY, 'all'],
    queryFn: () => menuProductsApi.getAllWithProducts(),
    enabled: isHydrated && isLoggedIn,
  });
}