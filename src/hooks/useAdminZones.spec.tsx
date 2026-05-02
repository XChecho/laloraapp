/**
 * ============================================================
 * SUITE DE PRUEBAS: useAdminZones
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 9 hooks de TanStack React Query para gestión de zonas
 * del panel admin: query de lista, query de detalle, y mutations
 * de crear, actualizar, eliminar, agregar mesas, agregar mesa
 * individual, remover mesa y actualizar estado de mesa.
 *
 * POR QUÉ importa:
 * Las zonas organizan las mesas del restaurante. Su correcta
 * gestión es fundamental para la distribución del espacio.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useAdminZones,
  useAdminZone,
  useCreateAdminZone,
  useUpdateAdminZone,
  useDeleteAdminZone,
  useAddTablesToZone,
  useAddTableToZone,
  useRemoveTableFromZone,
  useUpdateTableStatus,
} from './useAdminZones';
import { adminZonesApi } from '@core/actions/admin/zones';

// Mock del API action
jest.mock('@core/actions/admin/zones', () => ({
  adminZonesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addTables: jest.fn(),
    addTable: jest.fn(),
    removeTable: jest.fn(),
    updateTableStatus: jest.fn(),
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

describe('useAdminZones', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener todas las zonas', async () => {
    // Arrange
    const zones = [
      { id: 'z1', name: 'Interior', icon: 'indoor', tables: [], _count: { tables: 5 } },
      { id: 'z2', name: 'Terraza', icon: 'outdoor', tables: [], _count: { tables: 3 } },
    ];
    (adminZonesApi.getAll as jest.Mock).mockResolvedValue(zones);

    // Act
    const { result } = renderHook(
      () => useAdminZones(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(zones));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener zonas', async () => {
    // Arrange
    (adminZonesApi.getAll as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useAdminZones(),
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

describe('useAdminZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener una zona por ID', async () => {
    // Arrange
    const zone = { id: 'z1', name: 'Interior', icon: 'indoor', tables: [{ id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'AVAILABLE' }], _count: { tables: 1 } };
    (adminZonesApi.getById as jest.Mock).mockResolvedValue(zone);

    // Act
    const { result } = renderHook(
      () => useAdminZone('z1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(zone));
    expect(adminZonesApi.getById).toHaveBeenCalledWith('z1');
  });

  it('debería manejar error al obtener zona por ID', async () => {
    // Arrange
    (adminZonesApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrada'));

    // Act
    const { result } = renderHook(
      () => useAdminZone('nonexistent'),
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

describe('useCreateAdminZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería crear una zona e invalidar el cache', async () => {
    // Arrange
    const newZone = { id: 'new-z1', name: 'Barra', icon: 'bar', tables: [], _count: { tables: 0 } };
    (adminZonesApi.create as jest.Mock).mockResolvedValue(newZone);

    const { result } = renderHook(
      () => useCreateAdminZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ name: 'Barra', icon: 'bar' });

    // Assert
    expect(data).toEqual(newZone);
  });

  it('debería manejar error al crear zona', async () => {
    // Arrange
    (adminZonesApi.create as jest.Mock).mockRejectedValue(new Error('Error de validación'));

    const { result } = renderHook(
      () => useCreateAdminZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ name: '' })).rejects.toThrow('Error de validación');
  });
});

describe('useUpdateAdminZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar una zona e invalidar el cache', async () => {
    // Arrange
    const updatedZone = { id: 'z1', name: 'Interior Premium', icon: 'indoor', tables: [], _count: { tables: 5 } };
    (adminZonesApi.update as jest.Mock).mockResolvedValue(updatedZone);

    const { result } = renderHook(
      () => useUpdateAdminZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 'z1', data: { name: 'Interior Premium' } });

    // Assert
    expect(data).toEqual(updatedZone);
    expect(adminZonesApi.update).toHaveBeenCalledWith('z1', { name: 'Interior Premium' });
  });

  it('debería manejar error al actualizar zona', async () => {
    // Arrange
    (adminZonesApi.update as jest.Mock).mockRejectedValue(new Error('Error de actualización'));

    const { result } = renderHook(
      () => useUpdateAdminZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 'z1', data: { name: 'Nuevo nombre' } })).rejects.toThrow('Error de actualización');
  });
});

describe('useDeleteAdminZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería eliminar una zona e invalidar el cache', async () => {
    // Arrange
    (adminZonesApi.delete as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteAdminZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync('z1');

    // Assert
    expect(data).toBeUndefined();
    expect(adminZonesApi.delete).toHaveBeenCalledWith('z1');
  });

  it('debería manejar error al eliminar zona', async () => {
    // Arrange
    (adminZonesApi.delete as jest.Mock).mockRejectedValue(new Error('No se puede eliminar'));

    const { result } = renderHook(
      () => useDeleteAdminZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync('z1')).rejects.toThrow('No se puede eliminar');
  });
});

describe('useAddTablesToZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería agregar múltiples mesas a una zona', async () => {
    // Arrange
    const zoneWithTables = { id: 'z1', name: 'Interior', icon: 'indoor', tables: [
      { id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'AVAILABLE' },
      { id: 't2', name: 'Mesa 2', capacity: 4, zoneId: 'z1', status: 'AVAILABLE' },
    ], _count: { tables: 2 } };
    (adminZonesApi.addTables as jest.Mock).mockResolvedValue(zoneWithTables);

    const { result } = renderHook(
      () => useAddTablesToZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ zoneId: 'z1', quantity: 2 });

    // Assert
    expect(data).toEqual(zoneWithTables);
    expect(adminZonesApi.addTables).toHaveBeenCalledWith('z1', { quantity: 2 });
  });

  it('debería manejar error al agregar mesas a zona', async () => {
    // Arrange
    (adminZonesApi.addTables as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useAddTablesToZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ zoneId: 'z1', quantity: 5 })).rejects.toThrow('Error');
  });
});

describe('useAddTableToZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería agregar una mesa individual a una zona', async () => {
    // Arrange
    const newTable = { id: 't3', name: 'Mesa 3', capacity: 6, zoneId: 'z1', status: 'AVAILABLE' };
    (adminZonesApi.addTable as jest.Mock).mockResolvedValue(newTable);

    const { result } = renderHook(
      () => useAddTableToZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ zoneId: 'z1', data: { name: 'Mesa 3', capacity: 6 } });

    // Assert
    expect(data).toEqual(newTable);
    expect(adminZonesApi.addTable).toHaveBeenCalledWith('z1', { name: 'Mesa 3', capacity: 6 });
  });

  it('debería manejar error al agregar mesa individual a zona', async () => {
    // Arrange
    (adminZonesApi.addTable as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useAddTableToZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ zoneId: 'z1' })).rejects.toThrow('Error');
  });
});

describe('useRemoveTableFromZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería remover una mesa de una zona', async () => {
    // Arrange
    (adminZonesApi.removeTable as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useRemoveTableFromZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ zoneId: 'z1', tableId: 't1' });

    // Assert
    expect(data).toBeUndefined();
    expect(adminZonesApi.removeTable).toHaveBeenCalledWith('z1', 't1');
  });

  it('debería manejar error al remover mesa de zona', async () => {
    // Arrange
    (adminZonesApi.removeTable as jest.Mock).mockRejectedValue(new Error('No se puede remover'));

    const { result } = renderHook(
      () => useRemoveTableFromZone(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ zoneId: 'z1', tableId: 't1' })).rejects.toThrow('No se puede remover');
  });
});

describe('useUpdateTableStatus', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar el estado de una mesa en una zona', async () => {
    // Arrange
    const updatedTable = { id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'OCCUPIED' };
    (adminZonesApi.updateTableStatus as jest.Mock).mockResolvedValue(updatedTable);

    const { result } = renderHook(
      () => useUpdateTableStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ zoneId: 'z1', tableId: 't1', status: 'OCCUPIED' });

    // Assert
    expect(data).toEqual(updatedTable);
    expect(adminZonesApi.updateTableStatus).toHaveBeenCalledWith('z1', 't1', 'OCCUPIED');
  });

  it('debería manejar error al actualizar estado de mesa', async () => {
    // Arrange
    (adminZonesApi.updateTableStatus as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useUpdateTableStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ zoneId: 'z1', tableId: 't1', status: 'RESERVED' })).rejects.toThrow('Error');
  });
});
