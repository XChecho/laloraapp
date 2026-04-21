import { useQuery } from '@tanstack/react-query';
import { menuProductsApi } from '@core/actions/menu/products';

export const MENU_PRODUCTS_KEY = ['menu', 'products'];

export function useMenuProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: [...MENU_PRODUCTS_KEY, categoryId],
    queryFn: () => menuProductsApi.getByCategory(categoryId),
    enabled: !!categoryId,
  });
}