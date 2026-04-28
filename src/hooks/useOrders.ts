import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, CreateOrderInput, AddOrderItemsInput, UpdateOrderStatusInput } from '@core/actions/orders';
import { useAuthStore } from '@src/store/useAuthStore';
import { TABLES_KEY } from '@src/hooks/useZones';

export const ORDERS_KEY = ['orders'];

export function useActiveOrderByTable(tableId: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ORDERS_KEY, 'active', tableId],
    queryFn: () => ordersApi.getActiveByTable(tableId),
    enabled: !!tableId && isHydrated && isLoggedIn,
    refetchInterval: 30000,
  });
}

export function useOrder(id: string) {
  const { isHydrated, isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id && isHydrated && isLoggedIn,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: TABLES_KEY });
    },
  });
}

export function useAddOrderItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: AddOrderItemsInput }) =>
      ordersApi.addItems(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: [...ORDERS_KEY, orderId] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusInput }) =>
      ordersApi.updateStatus(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: [...ORDERS_KEY, orderId] });
    },
  });
}
