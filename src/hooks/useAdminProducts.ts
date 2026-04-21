import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi, AdminProduct, CreateProductInput, UpdateProductInput } from '@core/actions/admin/products';

export const ADMIN_PRODUCTS_KEY = ['admin', 'products'];

export function useAdminProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_KEY, categoryId],
    queryFn: () => adminProductsApi.getByCategory(categoryId),
    enabled: !!categoryId,
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_KEY, 'detail', id],
    queryFn: () => adminProductsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) => adminProductsApi.create(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: [...ADMIN_PRODUCTS_KEY, data.categoryId] });
    },
  });
}

export function useUpdateAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      adminProductsApi.update(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
    },
  });
}

export function useToggleAdminProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, categoryId, enabled }: { id: string; categoryId: string; enabled: boolean }) =>
      adminProductsApi.toggleStatus(id, enabled),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...ADMIN_PRODUCTS_KEY, categoryId] });
    },
  });
}

export function useDeleteAdminProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: string }) =>
      adminProductsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY });
    },
  });
}