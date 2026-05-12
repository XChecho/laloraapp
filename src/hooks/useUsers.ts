import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@core/actions/admin/users';
import { useAuthStore } from '@src/store/useAuthStore';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UpdateRoleInput,
  UpdateUserStatusInput,
} from '@src/types/user';

export const ADMIN_USERS_KEY = ['admin', 'users'];
export const RECENT_USERS_KEY = ['admin', 'users', 'recent'];

export function useUsers() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ADMIN_USERS_KEY,
    queryFn: () => usersApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useRecentUsers(limit = 3) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...RECENT_USERS_KEY, limit],
    queryFn: () => usersApi.getRecent(limit),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useUser(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: RECENT_USERS_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      usersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: RECENT_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_USERS_KEY, id] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) =>
      usersApi.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: RECENT_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_USERS_KEY, id] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusInput }) =>
      usersApi.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: RECENT_USERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_USERS_KEY, id] });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => usersApi.resetPassword(id),
  });
}
