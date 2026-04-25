import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zonesApi, Zone } from '@core/actions/zones';
import { tablesApi, Table } from '@core/actions/tables';
import { useAuthStore } from '@src/store/useAuthStore';

export const ZONES_KEY = ['zones'];

export function useZones() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: ZONES_KEY,
    queryFn: () => zonesApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useZone(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ZONES_KEY, id],
    queryFn: () => zonesApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export const TABLES_KEY = ['tables'];

export function useTables() {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: TABLES_KEY,
    queryFn: () => tablesApi.getAll(),
    enabled: isHydrated && isLoggedIn,
  });
}

export function useTable(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...TABLES_KEY, id],
    queryFn: () => tablesApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export function useTablesByZone(zoneId: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...TABLES_KEY, 'zone', zoneId],
    queryFn: () => tablesApi.getByZone(zoneId),
    enabled: !!zoneId && isHydrated && isLoggedIn,
  });
}