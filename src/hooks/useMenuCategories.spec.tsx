/**
 * ============================================================
 * SUITE DE PRUEBAS: useMenuCategories
 * ============================================================
 *
 * QUÉ estamos probando:
 * El hook de TanStack React Query para obtener categorías del
 * menú público (visible para clientes).
 *
 * POR QUÉ importa:
 * Las categorías del menú son la entrada principal para que
 * los clientes naveguen los productos disponibles.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import { useMenuCategories } from './useMenuCategories';
import { menuCategoriesApi } from '@core/actions/menu/categories';

// Mock del API action
jest.mock('@core/actions/menu/categories', () => ({
  menuCategoriesApi: {
    getAll: jest.fn(),
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

describe('useMenuCategories', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener las categorías del menú', async () => {
    // Arrange
    const categories = [
      { id: '1', name: 'Bebidas', icon: 'drink', active: true, itemsCount: 10, displayOrder: 1 },
      { id: '2', name: 'Comidas', icon: 'food', active: true, itemsCount: 15, displayOrder: 2 },
    ];
    (menuCategoriesApi.getAll as jest.Mock).mockResolvedValue(categories);

    // Act
    const { result } = renderHook(
      () => useMenuCategories(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(categories));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('debería manejar error al obtener categorías del menú', async () => {
    // Arrange
    (menuCategoriesApi.getAll as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useMenuCategories(),
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
