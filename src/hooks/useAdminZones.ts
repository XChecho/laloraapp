import { adminZonesApi, CreateZoneInput, UpdateZoneInput, AddTablesInput, UpdateTableInput, ZoneWithTables, TableData } from '@core/actions/admin/zones';
import { adminTablesApi } from '@core/actions/admin/tables';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@src/store/useAuthStore';

export const ADMIN_ZONES_KEY = ['admin', 'zones'];

export function useAdminZones() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ADMIN_ZONES_KEY,
    queryFn: () => adminZonesApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useAdminZone(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ADMIN_ZONES_KEY, id],
    queryFn: () => adminZonesApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export function useCreateAdminZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateZoneInput) => adminZonesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
    },
  });
}

export function useUpdateAdminZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateZoneInput }) =>
      adminZonesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_ZONES_KEY, id] });
    },
  });
}

export function useDeleteAdminZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminZonesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
    },
  });
}

export function useAddTablesToZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ zoneId, quantity }: { zoneId: string; quantity: number }) =>
      adminZonesApi.addTables(zoneId, { quantity }),
    onSuccess: (_, { zoneId }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_ZONES_KEY, zoneId] });
    },
  });
}

export function useAddTableToZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ zoneId, data }: { zoneId: string; data?: UpdateTableInput }) =>
      adminZonesApi.addTable(zoneId, data),
    onSuccess: (_, { zoneId }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_ZONES_KEY, zoneId] });
    },
  });
}

export function useRemoveTableFromZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ zoneId, tableId }: { zoneId: string; tableId: string }) =>
      adminZonesApi.removeTable(zoneId, tableId),
    onSuccess: (_, { zoneId }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_ZONES_KEY, zoneId] });
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ zoneId, tableId, status }: { zoneId: string; tableId: string; status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' }) =>
      adminZonesApi.updateTableStatus(zoneId, tableId, status),
    onSuccess: (_, { zoneId }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ZONES_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_ZONES_KEY, zoneId] });
    },
  });
}