import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTablesApi, AdminTable, UpdateTableInput } from '@core/actions/admin/tables';
import { useAuthStore } from '@src/store/useAuthStore';

export const ADMIN_TABLES_KEY = ['admin', 'tables'];

export function useAdminTables() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ADMIN_TABLES_KEY,
    queryFn: () => adminTablesApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useAdminTable(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ADMIN_TABLES_KEY, id],
    queryFn: () => adminTablesApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export function useCreateAdminTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { zoneId: string; name: string; capacity: number }) =>
      adminTablesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TABLES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin', 'zones'] });
    },
  });
}

export function useUpdateAdminTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableInput }) =>
      adminTablesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TABLES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin', 'zones'] });
    },
  });
}

export function useDeleteAdminTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminTablesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TABLES_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin', 'zones'] });
    },
  });
}

export function useAdminTablesByZone(zoneId: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ADMIN_TABLES_KEY, 'zone', zoneId],
    queryFn: () => adminTablesApi.getByZone(zoneId),
    enabled: !!zoneId && isHydrated && isLoggedIn,
  });
}
