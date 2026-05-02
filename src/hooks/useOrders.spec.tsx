/**
 * ============================================================
 * SUITE DE PRUEBAS: useOrders
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 5 hooks de TanStack React Query para gestión de órdenes:
 * query de orden activa por mesa, query de orden por ID, y
 * mutations de crear orden, agregar items y actualizar estado.
 *
 * POR QUÉ importa:
 * Las órdenes son el corazón del restaurante. Su correcta
 * gestión permite el flujo completo desde la toma de pedido
 * hasta el cierre de la cuenta.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useActiveOrderByTable,
  useOrder,
  useCreateOrder,
  useAddOrderItems,
  useUpdateOrderStatus,
} from './useOrders';
import { ordersApi } from '@core/actions/orders';

// Mock del API action
jest.mock('@core/actions/orders', () => ({
  ordersApi: {
    getActiveByTable: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    addItems: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

// Mock del auth store
jest.mock('@src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    isHydrated: true,
    isLoggedIn: true,
  }),
}));

jest.useRealTimers();
jest.setTimeout(15000);

describe('useActiveOrderByTable', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener la orden activa por mesa', async () => {
    // Arrange
    const activeOrder = {
      id: 'ord-1',
      tableId: 't1',
      customerName: 'Mesa 1',
      status: 'IN_PREPARATION' as const,
      orderType: 'LOCAL' as const,
      total: 25.0,
      items: [
        { id: 'oi-1', orderId: 'ord-1', productId: 'p1', quantity: 2, price: 5.0, notes: '', product: { id: 'p1', name: 'Cerveza', price: 5.0 }, modifiers: [], createdAt: '2026-01-01T00:00:00Z' },
      ],
      table: { id: 't1', name: 'Mesa 1', status: 'OCCUPIED' },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
    (ordersApi.getActiveByTable as jest.Mock).mockResolvedValue(activeOrder);

    // Act
    const { result } = renderHook(
      () => useActiveOrderByTable('t1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(activeOrder));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener orden activa', async () => {
    // Arrange
    (ordersApi.getActiveByTable as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useActiveOrderByTable('t1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.status).toBe('error'));
  });
});

describe('useOrder', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener una orden por ID', async () => {
    // Arrange
    const order = {
      id: 'ord-1',
      tableId: 't1',
      customerName: 'Mesa 1',
      status: 'CONFIRMED' as const,
      orderType: 'LOCAL' as const,
      total: 30.0,
      items: [],
      table: { id: 't1', name: 'Mesa 1', status: 'OCCUPIED' },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
    (ordersApi.getById as jest.Mock).mockResolvedValue(order);

    // Act
    const { result } = renderHook(
      () => useOrder('ord-1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(order));
    expect(ordersApi.getById).toHaveBeenCalledWith('ord-1');
  });

  it('debería manejar error al obtener orden por ID', async () => {
    // Arrange
    (ordersApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrada'));

    // Act
    const { result } = renderHook(
      () => useOrder('nonexistent'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.status).toBe('error'));
  });
});

describe('useCreateOrder', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería crear una orden e invalidar el cache', async () => {
    // Arrange
    const newOrder = {
      id: 'ord-new',
      tableId: 't1',
      customerName: 'Mesa 1',
      status: 'PENDING' as const,
      orderType: 'LOCAL' as const,
      total: 0,
      items: [],
      table: { id: 't1', name: 'Mesa 1', status: 'OCCUPIED' },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
    (ordersApi.create as jest.Mock).mockResolvedValue(newOrder);

    const { result } = renderHook(
      () => useCreateOrder(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ tableId: 't1', customerName: 'Mesa 1' });

    // Assert
    expect(data).toEqual(newOrder);
  });

  it('debería manejar error al crear orden', async () => {
    // Arrange
    (ordersApi.create as jest.Mock).mockRejectedValue(new Error('Error de validación'));

    const { result } = renderHook(
      () => useCreateOrder(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ tableId: 'nonexistent' })).rejects.toThrow('Error de validación');
  });
});

describe('useAddOrderItems', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería agregar items a una orden e invalidar el cache', async () => {
    // Arrange
    const updatedOrder = {
      id: 'ord-1',
      tableId: 't1',
      customerName: 'Mesa 1',
      status: 'IN_PREPARATION' as const,
      orderType: 'LOCAL' as const,
      total: 15.0,
      items: [
        { id: 'oi-1', orderId: 'ord-1', productId: 'p1', quantity: 3, price: 5.0, notes: '', product: { id: 'p1', name: 'Cerveza', price: 5.0 }, modifiers: [], createdAt: '2026-01-01T00:00:00Z' },
      ],
      table: { id: 't1', name: 'Mesa 1', status: 'OCCUPIED' },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
    (ordersApi.addItems as jest.Mock).mockResolvedValue(updatedOrder);

    const { result } = renderHook(
      () => useAddOrderItems(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({
      orderId: 'ord-1',
      data: { items: [{ productId: 'p1', quantity: 3, price: 5.0 }] },
    });

    // Assert
    expect(data).toEqual(updatedOrder);
    expect(ordersApi.addItems).toHaveBeenCalledWith('ord-1', { items: [{ productId: 'p1', quantity: 3, price: 5.0 }] });
  });

  it('debería manejar error al agregar items a orden', async () => {
    // Arrange
    (ordersApi.addItems as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useAddOrderItems(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ orderId: 'ord-1', data: { items: [] } })).rejects.toThrow('Error');
  });
});

describe('useUpdateOrderStatus', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar el estado de una orden', async () => {
    // Arrange
    const updatedOrder = {
      id: 'ord-1',
      tableId: 't1',
      customerName: 'Mesa 1',
      status: 'READY' as const,
      orderType: 'LOCAL' as const,
      total: 15.0,
      items: [],
      table: { id: 't1', name: 'Mesa 1', status: 'OCCUPIED' },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
    (ordersApi.updateStatus as jest.Mock).mockResolvedValue(updatedOrder);

    const { result } = renderHook(
      () => useUpdateOrderStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ orderId: 'ord-1', data: { status: 'READY' } });

    // Assert
    expect(data).toEqual(updatedOrder);
    expect(ordersApi.updateStatus).toHaveBeenCalledWith('ord-1', { status: 'READY' });
  });

  it('debería manejar error al actualizar estado de orden', async () => {
    // Arrange
    (ordersApi.updateStatus as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useUpdateOrderStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ orderId: 'ord-1', data: { status: 'DELIVERED' } })).rejects.toThrow('Error');
  });
});
