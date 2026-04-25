import { adminCategoriesApi, CreateCategoryInput, UpdateCategoryInput } from '@core/actions/admin/categories';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@src/store/useAuthStore';

export const ADMIN_CATEGORIES_KEY = ['admin', 'categories'];

export function useAdminCategories() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: () => adminCategoriesApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useAdminCategory(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_KEY, id],
    queryFn: () => adminCategoriesApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => adminCategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      adminCategoriesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_CATEGORIES_KEY, id] });
    },
  });
}

export function useToggleAdminCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      adminCategoriesApi.toggleStatus(id, enabled),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_CATEGORIES_KEY, id] });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
    },
  });
}