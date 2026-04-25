import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoryListsApi, 
  CategoryWithModifiers, 
  CreateModifierInput, 
  UpdateModifierInput,
  CreateModifierOptionInput 
} from '@core/actions/admin/category-lists';
import { useAuthStore } from '@src/store/useAuthStore';

export const CATEGORY_LISTS_KEY = ['admin', 'category', 'lists'];

export function useCategoryLists(categoryId: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...CATEGORY_LISTS_KEY, categoryId],
    queryFn: () => categoryListsApi.getByCategory(categoryId),
    enabled: !!categoryId && isHydrated && isLoggedIn,
  });
}

export function useCreateModifier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: CreateModifierInput }) =>
      categoryListsApi.createModifier(categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...CATEGORY_LISTS_KEY, categoryId] });
    },
  });
}

export function useUpdateModifier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, modifierId, data }: { categoryId: string; modifierId: string; data: UpdateModifierInput }) =>
      categoryListsApi.updateModifier(categoryId, modifierId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...CATEGORY_LISTS_KEY, categoryId] });
    },
  });
}

export function useDeleteModifier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, modifierId }: { categoryId: string; modifierId: string }) =>
      categoryListsApi.deleteModifier(categoryId, modifierId),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...CATEGORY_LISTS_KEY, categoryId] });
    },
  });
}

export function useAddModifierOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, modifierId, data }: { categoryId: string; modifierId: string; data: CreateModifierOptionInput }) =>
      categoryListsApi.addModifierOption(categoryId, modifierId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...CATEGORY_LISTS_KEY, categoryId] });
    },
  });
}

export function useDeleteModifierOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, modifierId, optionId }: { categoryId: string; modifierId: string; optionId: string }) =>
      categoryListsApi.deleteModifierOption(categoryId, modifierId, optionId),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...CATEGORY_LISTS_KEY, categoryId] });
    },
  });
}

export function useRestockModifierOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, modifierId, optionId, quantity }: { categoryId: string; modifierId: string; optionId: string; quantity: number }) =>
      categoryListsApi.restockModifierOption(categoryId, modifierId, optionId, quantity),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [...CATEGORY_LISTS_KEY, categoryId] });
    },
  });
}