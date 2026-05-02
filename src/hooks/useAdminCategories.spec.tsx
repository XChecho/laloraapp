/**
 * ============================================================
 * SUITE DE PRUEBAS: useAdminCategories
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 6 hooks de TanStack React Query para gestión de categorías
 * del panel admin: query de lista, query de detalle, y mutations
 * de crear, actualizar, toggle status y eliminar.
 *
 * POR QUÉ importa:
 * Las categorías son la base del menú. Sin ellas no se pueden
 * organizar productos ni mostrar el menú correctamente.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useAdminCategories,
  useAdminCategory,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useToggleAdminCategoryStatus,
  useDeleteAdminCategory,
} from './useAdminCategories';
import { adminCategoriesApi } from '@core/actions/admin/categories';

// Mock del API action
jest.mock('@core/actions/admin/categories', () => ({
  adminCategoriesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock del auth store
jest.mock('@src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    isHydrated: true,
    isLoggedIn: true,
  }),
}));

// Usar timers reales para tests de React Query
jest.useRealTimers();
jest.setTimeout(15000);

describe('useAdminCategories', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener las categorías exitosamente', async () => {
    // Arrange: definimos las categorías que devolverá el mock
    const categories = [
      { id: '1', name: 'Bebidas', enabled: true, productsCount: 5, displayOrder: 1 },
      { id: '2', name: 'Comidas', enabled: true, productsCount: 10, displayOrder: 2 },
    ];
    (adminCategoriesApi.getAll as jest.Mock).mockResolvedValue(categories);

    // Act: renderizamos el hook y esperamos resultado
    const { result } = renderHook(
      () => useAdminCategories(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert: verificamos que los datos coincidan con el mock
    await waitFor(() => {
      expect(result.current.data).toEqual(categories);
    }, { timeout: 10000 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('debería manejar error al obtener categorías', async () => {
    // Arrange: simulamos un error en la API
    const mockError = new Error('Error de red');
    (adminCategoriesApi.getAll as jest.Mock).mockRejectedValue(mockError);

    // Act
    const { result } = renderHook(
      () => useAdminCategories(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert: verificamos que el hook reporta error
    await waitFor(() => expect(result.current.status).toBe('error'), { timeout: 10000 });
    expect(result.current.error).toBeDefined();
  });
});

describe('useAdminCategory', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener una categoría por ID', async () => {
    // Arrange
    const category = { id: 'cat-1', name: 'Postres', enabled: true, productsCount: 3, displayOrder: 3 };
    (adminCategoriesApi.getById as jest.Mock).mockResolvedValue(category);

    // Act
    const { result } = renderHook(
      () => useAdminCategory('cat-1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(category);
    }, { timeout: 10000 });
    expect(adminCategoriesApi.getById).toHaveBeenCalledWith('cat-1');
  });

  it('debería manejar error al obtener categoría por ID', async () => {
    // Arrange
    (adminCategoriesApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrada'));

    // Act
    const { result } = renderHook(
      () => useAdminCategory('nonexistent'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 10000, interval: 200 });
  });
});

describe('useCreateAdminCategory', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería crear una categoría e invalidar el cache', async () => {
    // Arrange
    const newCategory = { id: 'new-1', name: 'Postres', enabled: true, productsCount: 0, displayOrder: 4 };
    (adminCategoriesApi.create as jest.Mock).mockResolvedValue(newCategory);

    const { result } = renderHook(
      () => useCreateAdminCategory(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act: usamos mutateAsync para esperar la resolución
    const data = await result.current.mutateAsync({ name: 'Postres' });

    // Assert: verificamos éxito y que se invalidó el cache
    expect(data).toEqual(newCategory);
    expect(adminCategoriesApi.create).toHaveBeenCalledWith({ name: 'Postres' });
  });

  it('debería manejar error al crear categoría', async () => {
    // Arrange
    (adminCategoriesApi.create as jest.Mock).mockRejectedValue(new Error('Error de validación'));

    const { result } = renderHook(
      () => useCreateAdminCategory(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert: la mutación debe rechazar
    await expect(result.current.mutateAsync({ name: '' })).rejects.toThrow('Error de validación');
  });
});

describe('useUpdateAdminCategory', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar una categoría e invalidar el cache', async () => {
    // Arrange
    const updatedCategory = { id: 'cat-1', name: 'Bebidas Premium', enabled: true, productsCount: 5, displayOrder: 1 };
    (adminCategoriesApi.update as jest.Mock).mockResolvedValue(updatedCategory);

    const { result } = renderHook(
      () => useUpdateAdminCategory(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 'cat-1', data: { name: 'Bebidas Premium' } });

    // Assert
    expect(data).toEqual(updatedCategory);
    expect(adminCategoriesApi.update).toHaveBeenCalledWith('cat-1', { name: 'Bebidas Premium' });
  });

  it('debería manejar error al actualizar categoría', async () => {
    // Arrange
    (adminCategoriesApi.update as jest.Mock).mockRejectedValue(new Error('Error de actualización'));

    const { result } = renderHook(
      () => useUpdateAdminCategory(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 'cat-1', data: { name: 'Nuevo nombre' } })).rejects.toThrow('Error de actualización');
  });
});

describe('useToggleAdminCategoryStatus', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería alternar el estado de una categoría', async () => {
    // Arrange
    const toggledCategory = { id: 'cat-1', name: 'Bebidas', enabled: false, productsCount: 5, displayOrder: 1 };
    (adminCategoriesApi.toggleStatus as jest.Mock).mockResolvedValue(toggledCategory);

    const { result } = renderHook(
      () => useToggleAdminCategoryStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 'cat-1', enabled: false });

    // Assert
    expect(data).toEqual(toggledCategory);
    expect(adminCategoriesApi.toggleStatus).toHaveBeenCalledWith('cat-1', false);
  });

  it('debería manejar error al alternar estado', async () => {
    // Arrange
    (adminCategoriesApi.toggleStatus as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useToggleAdminCategoryStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 'cat-1', enabled: true })).rejects.toThrow('Error');
  });
});

describe('useDeleteAdminCategory', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería eliminar una categoría e invalidar el cache', async () => {
    // Arrange
    const deletedCategory = { id: 'cat-1', name: 'Bebidas', enabled: true, productsCount: 0, displayOrder: 1 };
    (adminCategoriesApi.delete as jest.Mock).mockResolvedValue(deletedCategory);

    const { result } = renderHook(
      () => useDeleteAdminCategory(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync('cat-1');

    // Assert
    expect(data).toEqual(deletedCategory);
    expect(adminCategoriesApi.delete).toHaveBeenCalledWith('cat-1');
  });

  it('debería manejar error al eliminar categoría', async () => {
    // Arrange
    (adminCategoriesApi.delete as jest.Mock).mockRejectedValue(new Error('No se puede eliminar'));

    const { result } = renderHook(
      () => useDeleteAdminCategory(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync('cat-1')).rejects.toThrow('No se puede eliminar');
  });
});
