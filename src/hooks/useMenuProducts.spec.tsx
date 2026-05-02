/**
 * ============================================================
 * SUITE DE PRUEBAS: useMenuProducts
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 2 hooks de TanStack React Query para obtener productos
 * del menú público: por categoría y todos con productos.
 *
 * POR QUÉ importa:
 * Los productos del menú son lo que los clientes ven y ordenan.
 * Su correcta carga es crítica para la experiencia del usuario.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import { useMenuProductsByCategory, useMenuAllProducts } from './useMenuProducts';
import { menuProductsApi } from '@core/actions/menu/products';

// Mock del API action
jest.mock('@core/actions/menu/products', () => ({
  menuProductsApi: {
    getByCategory: jest.fn(),
    getAllWithProducts: jest.fn(),
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

describe('useMenuProductsByCategory', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener los productos por categoría del menú', async () => {
    // Arrange
    const products = [
      { id: 'p1', name: 'Cerveza Artesanal', price: 5.0, categoryId: 'cat-1', available: true },
      { id: 'p2', name: 'Vino Tinto', price: 8.0, categoryId: 'cat-1', available: true },
    ];
    (menuProductsApi.getByCategory as jest.Mock).mockResolvedValue(products);

    // Act
    const { result } = renderHook(
      () => useMenuProductsByCategory('cat-1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(products));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener productos por categoría', async () => {
    // Arrange
    (menuProductsApi.getByCategory as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useMenuProductsByCategory('cat-1'),
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

describe('useMenuAllProducts', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener todas las categorías con sus productos', async () => {
    // Arrange
    const categoriesWithProducts = [
      {
        id: 'cat-1',
        name: 'Bebidas',
        icon: 'drink',
        active: true,
        itemsCount: 2,
        displayOrder: 1,
        modifierLists: [],
        products: [
          { id: 'p1', name: 'Cerveza', price: 5.0, categoryId: 'cat-1', available: true },
          { id: 'p2', name: 'Vino', price: 8.0, categoryId: 'cat-1', available: true },
        ],
      },
      {
        id: 'cat-2',
        name: 'Comidas',
        icon: 'food',
        active: true,
        itemsCount: 1,
        displayOrder: 2,
        modifierLists: [],
        products: [
          { id: 'p3', name: 'Hamburguesa', price: 10.0, categoryId: 'cat-2', available: true },
        ],
      },
    ];
    (menuProductsApi.getAllWithProducts as jest.Mock).mockResolvedValue(categoriesWithProducts);

    // Act
    const { result } = renderHook(
      () => useMenuAllProducts(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(categoriesWithProducts));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener todos los productos', async () => {
    // Arrange
    (menuProductsApi.getAllWithProducts as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useMenuAllProducts(),
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
