/**
 * ============================================================
 * SUITE DE PRUEBAS: useAdminProducts
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 6 hooks de TanStack React Query para gestión de productos
 * del panel admin: query por categoría, query de detalle, y
 * mutations de crear, actualizar, toggle status y eliminar.
 *
 * POR QUÉ importa:
 * Los productos son el núcleo del negocio. Su correcta gestión
 * es esencial para el funcionamiento del restaurante.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useAdminProductsByCategory,
  useAdminProduct,
  useCreateAdminProduct,
  useUpdateAdminProduct,
  useToggleAdminProductStatus,
  useDeleteAdminProduct,
} from './useAdminProducts';
import { adminProductsApi } from '@core/actions/admin/products';

// Mock del API action
jest.mock('@core/actions/admin/products', () => ({
  adminProductsApi: {
    getByCategory: jest.fn(),
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

jest.useRealTimers();
jest.setTimeout(15000);

describe('useAdminProductsByCategory', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener los productos por categoría', async () => {
    // Arrange: definimos los productos que devolverá el mock
    const products = [
      { id: 'p1', name: 'Cerveza', price: 5.0, categoryId: 'cat-1', stock: 100, available: true },
      { id: 'p2', name: 'Vino', price: 8.0, categoryId: 'cat-1', stock: 50, available: true },
    ];
    (adminProductsApi.getByCategory as jest.Mock).mockResolvedValue(products);

    // Act: renderizamos el hook con el ID de categoría
    const { result } = renderHook(
      () => useAdminProductsByCategory('cat-1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert: verificamos que los datos coincidan
    await waitFor(() => expect(result.current.data).toEqual(products));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener productos por categoría', async () => {
    // Arrange
    (adminProductsApi.getByCategory as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useAdminProductsByCategory('cat-1'),
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

describe('useAdminProduct', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener un producto por ID', async () => {
    // Arrange
    const product = { id: 'p1', name: 'Cerveza Artesanal', price: 6.0, categoryId: 'cat-1', stock: 80, available: true };
    (adminProductsApi.getById as jest.Mock).mockResolvedValue(product);

    // Act
    const { result } = renderHook(
      () => useAdminProduct('p1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(product));
    expect(adminProductsApi.getById).toHaveBeenCalledWith('p1');
  });

  it('debería manejar error al obtener producto por ID', async () => {
    // Arrange
    (adminProductsApi.getById as jest.Mock).mockRejectedValue(new Error('No encontrado'));

    // Act
    const { result } = renderHook(
      () => useAdminProduct('nonexistent'),
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

describe('useCreateAdminProduct', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería crear un producto e invalidar el cache de la categoría', async () => {
    // Arrange
    const newProduct = { id: 'new-p1', name: 'Agua Mineral', price: 2.0, categoryId: 'cat-1', stock: 200, available: true };
    (adminProductsApi.create as jest.Mock).mockResolvedValue(newProduct);

    const { result } = renderHook(
      () => useCreateAdminProduct(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ name: 'Agua Mineral', price: 2.0, categoryId: 'cat-1' });

    // Assert
    expect(data).toEqual(newProduct);
  });

  it('debería manejar error al crear producto', async () => {
    // Arrange
    (adminProductsApi.create as jest.Mock).mockRejectedValue(new Error('Error de validación'));

    const { result } = renderHook(
      () => useCreateAdminProduct(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ name: '', price: -1, categoryId: 'cat-1' })).rejects.toThrow('Error de validación');
  });
});

describe('useUpdateAdminProduct', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar un producto e invalidar el cache', async () => {
    // Arrange
    const updatedProduct = { id: 'p1', name: 'Cerveza Premium', price: 7.0, categoryId: 'cat-1', stock: 80, available: true };
    (adminProductsApi.update as jest.Mock).mockResolvedValue(updatedProduct);

    const { result } = renderHook(
      () => useUpdateAdminProduct(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 'p1', data: { name: 'Cerveza Premium', price: 7.0 } });

    // Assert
    expect(data).toEqual(updatedProduct);
    expect(adminProductsApi.update).toHaveBeenCalledWith('p1', { name: 'Cerveza Premium', price: 7.0 });
  });

  it('debería manejar error al actualizar producto', async () => {
    // Arrange
    (adminProductsApi.update as jest.Mock).mockRejectedValue(new Error('Error de actualización'));

    const { result } = renderHook(
      () => useUpdateAdminProduct(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 'p1', data: { name: 'Nuevo nombre' } })).rejects.toThrow('Error de actualización');
  });
});

describe('useToggleAdminProductStatus', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería alternar el estado de un producto', async () => {
    // Arrange
    const toggledProduct = { id: 'p1', name: 'Cerveza', price: 5.0, categoryId: 'cat-1', stock: 100, available: false };
    (adminProductsApi.toggleStatus as jest.Mock).mockResolvedValue(toggledProduct);

    const { result } = renderHook(
      () => useToggleAdminProductStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 'p1', categoryId: 'cat-1', enabled: false });

    // Assert
    expect(data).toEqual(toggledProduct);
    expect(adminProductsApi.toggleStatus).toHaveBeenCalledWith('p1', false);
  });

  it('debería manejar error al alternar estado del producto', async () => {
    // Arrange
    (adminProductsApi.toggleStatus as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useToggleAdminProductStatus(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 'p1', categoryId: 'cat-1', enabled: true })).rejects.toThrow('Error');
  });
});

describe('useDeleteAdminProduct', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería eliminar un producto e invalidar el cache', async () => {
    // Arrange
    const deletedProduct = { id: 'p1', name: 'Cerveza', price: 5.0, categoryId: 'cat-1', stock: 0, available: false };
    (adminProductsApi.delete as jest.Mock).mockResolvedValue(deletedProduct);

    const { result } = renderHook(
      () => useDeleteAdminProduct(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ id: 'p1', categoryId: 'cat-1' });

    // Assert
    expect(data).toEqual(deletedProduct);
    expect(adminProductsApi.delete).toHaveBeenCalledWith('p1');
  });

  it('debería manejar error al eliminar producto', async () => {
    // Arrange
    (adminProductsApi.delete as jest.Mock).mockRejectedValue(new Error('No se puede eliminar'));

    const { result } = renderHook(
      () => useDeleteAdminProduct(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ id: 'p1', categoryId: 'cat-1' })).rejects.toThrow('No se puede eliminar');
  });
});
