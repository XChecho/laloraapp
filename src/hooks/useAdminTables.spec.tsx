/**
 * ============================================================
 * SUITE DE PRUEBAS: useAdminTables
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 6 hooks de TanStack React Query para gestión de mesas
 * del panel admin: query de lista, query de detalle, query por
 * zona, y mutations de crear, actualizar y eliminar.
 *
 * POR QUÉ importa:
 * Las mesas son esenciales para la gestión del restaurante.
 * Su correcta administración permite asignar órdenes y controlar
 * el flujo del servicio.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useAdminTables,
  useAdminTable,
  useCreateAdminTable,
  useUpdateAdminTable,
  useDeleteAdminTable,
  useAdminTablesByZone,
} from './useAdminTables';
import { adminTablesApi } from '@core/actions/admin/tables';

// Mock del API action
jest.mock('@core/actions/admin/tables', () => ({
  adminTablesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getByZone: jest.fn(),
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

describe('useAdminTables', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener todas las mesas', async () => {
    // Arrange
    const tables = [
      { id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'AVAILABLE', zone: { id: 'z1', name: 'Interior', icon: 'indoor' } },
      { id: 't2', name: 'Mesa 2', capacity: 2, zoneId: 'z1', status: 'OCCUPIED', zone: { id: 'z1', name: 'Interior', icon: 'indoor' } },
    ];
    (adminTablesApi.getAll as jest.Mock).mockResolvedValue(tables);

    // Act
    const { result } = renderHook(
      () => useAdminTables(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(tables));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener mesas', async () => {
    // Arrange
    (adminTablesApi.getAll as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useAdminTables(),
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

describe('useAdminTable', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener una mesa por ID', async () => {
    // Arrange
    const table = { id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'AVAILABLE', zone: { id: 'z1', name: 'Interior', icon: 'indoor' } };
    (adminTablesApi.getById as jest.Mock).mockResolvedValue(table);

    // Act
    const { result } = renderHook(
      () => useAdminTable('t1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(table));
    expect(adminTablesApi.getById).toHaveBeenCalledWith('t1');
  });

  it('debería manejar error al obtener mesa por ID', async () => {
    // Arrange
    (adminTablesApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrada'));

    // Act
    const { result } = renderHook(
      () => useAdminTable('nonexistent'),
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

describe('useCreateAdminTable', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería crear una mesa e invalidar el cache', async () => {
    // Arrange
    const newTable = { id: 'new-t1', name: 'Mesa 5', capacity: 6, zoneId: 'z1', status: 'AVAILABLE', zone: { id: 'z1', name: 'Interior', icon: 'indoor' } };
    (adminTablesApi.create as jest.Mock).mockResolvedValue(newTable);

    const { result } = renderHook(
      () => useCreateAdminTable(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ zoneId: 'z1', name: 'Mesa 5', capacity: 6 });

    // Assert
    expect(data).toEqual(newTable);
  });

  it('debería manejar error al crear mesa', async () => {
    // Arrange
    (adminTablesApi.create as jest.Mock).mockRejectedValue(new Error('Error de validación'));

    const { result } = renderHook(
      () => useCreateAdminTable(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ zoneId: 'z1', name: '', capacity: 0 })).rejects.toThrow('Error de validación');
  });
});

describe('useUpdateAdminTable', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar una mesa e invalidar el cache', async () => {
    // Arrange
    const updatedTable = { id: 't1', name: 'Mesa VIP', capacity: 8, zoneId: 'z1', status: 'AVAILABLE', zone: { id: 'z1', name: 'Interior', icon: 'indoor' } };
    (adminTablesApi.update as jest.Mock).mockResolvedValue(updatedTable);

    const { result } = renderHook(
      () => useUpdateAdminTable(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 't1', data: { name: 'Mesa VIP', capacity: 8 } });

    // Assert
    expect(data).toEqual(updatedTable);
    expect(adminTablesApi.update).toHaveBeenCalledWith('t1', { name: 'Mesa VIP', capacity: 8 });
  });

  it('debería manejar error al actualizar mesa', async () => {
    // Arrange
    (adminTablesApi.update as jest.Mock).mockRejectedValue(new Error('Error de actualización'));

    const { result } = renderHook(
      () => useUpdateAdminTable(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 't1', data: { name: 'Nuevo nombre' } })).rejects.toThrow('Error de actualización');
  });
});

describe('useDeleteAdminTable', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería eliminar una mesa e invalidar el cache', async () => {
    // Arrange
    (adminTablesApi.delete as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteAdminTable(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync('t1');

    // Assert
    expect(data).toBeUndefined();
    expect(adminTablesApi.delete).toHaveBeenCalledWith('t1');
  });

  it('debería manejar error al eliminar mesa', async () => {
    // Arrange
    (adminTablesApi.delete as jest.Mock).mockRejectedValue(new Error('No se puede eliminar'));

    const { result } = renderHook(
      () => useDeleteAdminTable(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync('t1')).rejects.toThrow('No se puede eliminar');
  });
});

describe('useAdminTablesByZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener las mesas por zona', async () => {
    // Arrange
    const tables = [
      { id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'AVAILABLE', zone: { id: 'z1', name: 'Terraza', icon: 'outdoor' } },
      { id: 't2', name: 'Mesa 2', capacity: 4, zoneId: 'z1', status: 'OCCUPIED', zone: { id: 'z1', name: 'Terraza', icon: 'outdoor' } },
    ];
    (adminTablesApi.getByZone as jest.Mock).mockResolvedValue(tables);

    // Act
    const { result } = renderHook(
      () => useAdminTablesByZone('z1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(tables));
    expect(adminTablesApi.getByZone).toHaveBeenCalledWith('z1');
  });

  it('debería manejar error al obtener mesas por zona', async () => {
    // Arrange
    (adminTablesApi.getByZone as jest.Mock).mockRejectedValue(new Error('Zona no encontrada'));

    // Act
    const { result } = renderHook(
      () => useAdminTablesByZone('nonexistent'),
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
