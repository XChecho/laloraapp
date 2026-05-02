/**
 * ============================================================
 * SUITE DE PRUEBAS: useZones
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 5 hooks de TanStack React Query para gestión de zonas
 * y mesas públicas: query de zonas, query de zona por ID,
 * query de mesas, query de mesa por ID, y query de mesas
 * por zona.
 *
 * POR QUÉ importa:
 * Las zonas y mesas son la base para la gestión del espacio
 * del restaurante. Permiten organizar y visualizar la
 * distribución del local.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useZones,
  useZone,
  useTables,
  useTable,
  useTablesByZone,
} from './useZones';
import { zonesApi } from '@core/actions/zones';
import { tablesApi } from '@core/actions/tables';

// Mock de los API actions
jest.mock('@core/actions/zones', () => ({
  zonesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock('@core/actions/tables', () => ({
  tablesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
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

describe('useZones', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener todas las zonas', async () => {
    // Arrange
    const zones = [
      { id: 'z1', name: 'Interior', icon: 'indoor', _count: { tables: 5 } },
      { id: 'z2', name: 'Terraza', icon: 'outdoor', _count: { tables: 3 } },
    ];
    (zonesApi.getAll as jest.Mock).mockResolvedValue(zones);

    // Act
    const { result } = renderHook(
      () => useZones(),
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
    (zonesApi.getAll as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useZones(),
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

describe('useZone', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener una zona por ID', async () => {
    // Arrange
    const zone = { id: 'z1', name: 'Interior', icon: 'indoor', _count: { tables: 5 } };
    (zonesApi.getById as jest.Mock).mockResolvedValue(zone);

    // Act
    const { result } = renderHook(
      () => useZone('z1'),
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
    expect(zonesApi.getById).toHaveBeenCalledWith('z1');
  });

  it('debería manejar error al obtener zona por ID', async () => {
    // Arrange
    (zonesApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrada'));

    // Act
    const { result } = renderHook(
      () => useZone('nonexistent'),
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

describe('useTables', () => {
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
    (tablesApi.getAll as jest.Mock).mockResolvedValue(tables);

    // Act
    const { result } = renderHook(
      () => useTables(),
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
    (tablesApi.getAll as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useTables(),
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

describe('useTable', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener una mesa por ID', async () => {
    // Arrange
    const table = { id: 't1', name: 'Mesa 1', capacity: 4, zoneId: 'z1', status: 'AVAILABLE', zone: { id: 'z1', name: 'Interior', icon: 'indoor' } };
    (tablesApi.getById as jest.Mock).mockResolvedValue(table);

    // Act
    const { result } = renderHook(
      () => useTable('t1'),
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
    expect(tablesApi.getById).toHaveBeenCalledWith('t1');
  });

  it('debería manejar error al obtener mesa por ID', async () => {
    // Arrange
    (tablesApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrada'));

    // Act
    const { result } = renderHook(
      () => useTable('nonexistent'),
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

describe('useTablesByZone', () => {
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
    (tablesApi.getByZone as jest.Mock).mockResolvedValue(tables);

    // Act
    const { result } = renderHook(
      () => useTablesByZone('z1'),
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
    expect(tablesApi.getByZone).toHaveBeenCalledWith('z1');
  });

  it('debería manejar error al obtener mesas por zona', async () => {
    // Arrange
    (tablesApi.getByZone as jest.Mock).mockRejectedValue(new Error('Zona no encontrada'));

    // Act
    const { result } = renderHook(
      () => useTablesByZone('nonexistent'),
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
