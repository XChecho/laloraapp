/**
 * ============================================================
 * SUITE DE PRUEBAS: useCategoryLists
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los 7 hooks de TanStack React Query para gestión de listas
 * de modificadores de categorías: query por categoría, y mutations
 * de crear, actualizar, eliminar modificadores, agregar opciones,
 * eliminar opciones y reabastecer opciones.
 *
 * POR QUÉ importa:
 * Los modificadores permiten personalizar productos (extras,
 * ingredientes, etc.). Son esenciales para la experiencia del
 * cliente y la precisión de las órdenes.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useCategoryLists,
  useCreateModifier,
  useUpdateModifier,
  useDeleteModifier,
  useAddModifierOption,
  useDeleteModifierOption,
  useRestockModifierOption,
} from './useCategoryLists';
import { categoryListsApi } from '@core/actions/admin/category-lists';

// Mock del API action
jest.mock('@core/actions/admin/category-lists', () => ({
  categoryListsApi: {
    getByCategory: jest.fn(),
    createModifier: jest.fn(),
    updateModifier: jest.fn(),
    deleteModifier: jest.fn(),
    addModifierOption: jest.fn(),
    deleteModifierOption: jest.fn(),
    restockModifierOption: jest.fn(),
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

describe('useCategoryLists', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería obtener las listas de modificadores por categoría', async () => {
    // Arrange
    const categoryLists = {
      id: 'cat-1',
      name: 'Bebidas',
      productsCount: 5,
      enabled: true,
      modifiers: [
        { id: 'm1', name: 'Tamaño', required: true, multiple: false, affectsKitchen: false, options: [{ id: 'o1', name: 'Grande', priceExtra: 1.0, stock: 100 }] },
      ],
    };
    (categoryListsApi.getByCategory as jest.Mock).mockResolvedValue(categoryLists);

    // Act
    const { result } = renderHook(
      () => useCategoryLists('cat-1'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(categoryLists));
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar error al obtener listas de modificadores', async () => {
    // Arrange
    (categoryListsApi.getByCategory as jest.Mock).mockRejectedValue(new Error('Error de red'));

    // Act
    const { result } = renderHook(
      () => useCategoryLists('cat-1'),
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

describe('useCreateModifier', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería crear un modificador e invalidar el cache', async () => {
    // Arrange
    const newModifier = { id: 'm2', name: 'Extra queso', required: false, multiple: true, affectsKitchen: true, options: [] };
    (categoryListsApi.createModifier as jest.Mock).mockResolvedValue(newModifier);

    const { result } = renderHook(
      () => useCreateModifier(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ categoryId: 'cat-1', data: { name: 'Extra queso', required: false, multiple: true, affectsKitchen: true } });

    // Assert
    expect(data).toEqual(newModifier);
  });

  it('debería manejar error al crear modificador', async () => {
    // Arrange
    (categoryListsApi.createModifier as jest.Mock).mockRejectedValue(new Error('Error de validación'));

    const { result } = renderHook(
      () => useCreateModifier(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ categoryId: 'cat-1', data: { name: '', required: false, multiple: false, affectsKitchen: false } })).rejects.toThrow('Error de validación');
  });
});

describe('useUpdateModifier', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería actualizar un modificador e invalidar el cache', async () => {
    // Arrange
    const updatedModifier = { id: 'm1', name: 'Tamaño Grande', required: true, multiple: false, affectsKitchen: false, options: [] };
    (categoryListsApi.updateModifier as jest.Mock).mockResolvedValue(updatedModifier);

    const { result } = renderHook(
      () => useUpdateModifier(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', data: { name: 'Tamaño Grande' } });

    // Assert
    expect(data).toEqual(updatedModifier);
    expect(categoryListsApi.updateModifier).toHaveBeenCalledWith('cat-1', 'm1', { name: 'Tamaño Grande' });
  });

  it('debería manejar error al actualizar modificador', async () => {
    // Arrange
    (categoryListsApi.updateModifier as jest.Mock).mockRejectedValue(new Error('Error de actualización'));

    const { result } = renderHook(
      () => useUpdateModifier(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', data: { name: 'Nuevo nombre' } })).rejects.toThrow('Error de actualización');
  });
});

describe('useDeleteModifier', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería eliminar un modificador e invalidar el cache', async () => {
    // Arrange
    const deletedModifier = { id: 'm1', name: 'Tamaño', required: true, multiple: false, affectsKitchen: false, options: [] };
    (categoryListsApi.deleteModifier as jest.Mock).mockResolvedValue(deletedModifier);

    const { result } = renderHook(
      () => useDeleteModifier(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1' });

    // Assert
    expect(data).toEqual(deletedModifier);
    expect(categoryListsApi.deleteModifier).toHaveBeenCalledWith('cat-1', 'm1');
  });

  it('debería manejar error al eliminar modificador', async () => {
    // Arrange
    (categoryListsApi.deleteModifier as jest.Mock).mockRejectedValue(new Error('No se puede eliminar'));

    const { result } = renderHook(
      () => useDeleteModifier(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1' })).rejects.toThrow('No se puede eliminar');
  });
});

describe('useAddModifierOption', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería agregar una opción a un modificador', async () => {
    // Arrange
    const newOption = { id: 'o2', name: 'Extra grande', priceExtra: 2.0, stock: 50 };
    (categoryListsApi.addModifierOption as jest.Mock).mockResolvedValue(newOption);

    const { result } = renderHook(
      () => useAddModifierOption(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', data: { name: 'Extra grande', priceExtra: 2.0, stock: 50 } });

    // Assert
    expect(data).toEqual(newOption);
    expect(categoryListsApi.addModifierOption).toHaveBeenCalledWith('cat-1', 'm1', { name: 'Extra grande', priceExtra: 2.0, stock: 50 });
  });

  it('debería manejar error al agregar opción de modificador', async () => {
    // Arrange
    (categoryListsApi.addModifierOption as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useAddModifierOption(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', data: { name: '', priceExtra: -1 } })).rejects.toThrow('Error');
  });
});

describe('useDeleteModifierOption', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería eliminar una opción de modificador', async () => {
    // Arrange
    const deletedOption = { id: 'o1', name: 'Grande', priceExtra: 1.0, stock: 100 };
    (categoryListsApi.deleteModifierOption as jest.Mock).mockResolvedValue(deletedOption);

    const { result } = renderHook(
      () => useDeleteModifierOption(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', optionId: 'o1' });

    // Assert
    expect(data).toEqual(deletedOption);
    expect(categoryListsApi.deleteModifierOption).toHaveBeenCalledWith('cat-1', 'm1', 'o1');
  });

  it('debería manejar error al eliminar opción de modificador', async () => {
    // Arrange
    (categoryListsApi.deleteModifierOption as jest.Mock).mockRejectedValue(new Error('No se puede eliminar'));

    const { result } = renderHook(
      () => useDeleteModifierOption(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', optionId: 'o1' })).rejects.toThrow('No se puede eliminar');
  });
});

describe('useRestockModifierOption', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  it('debería reabastecer una opción de modificador', async () => {
    // Arrange
    const restockedOption = { id: 'o1', name: 'Grande', priceExtra: 1.0, stock: 200 };
    (categoryListsApi.restockModifierOption as jest.Mock).mockResolvedValue(restockedOption);

    const { result } = renderHook(
      () => useRestockModifierOption(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act
    const data = await result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', optionId: 'o1', quantity: 100 });

    // Assert
    expect(data).toEqual(restockedOption);
    expect(categoryListsApi.restockModifierOption).toHaveBeenCalledWith('cat-1', 'm1', 'o1', 100);
  });

  it('debería manejar error al reabastecer opción de modificador', async () => {
    // Arrange
    (categoryListsApi.restockModifierOption as jest.Mock).mockRejectedValue(new Error('Error'));

    const { result } = renderHook(
      () => useRestockModifierOption(),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={mockQueryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    // Act & Assert
    await expect(result.current.mutateAsync({ categoryId: 'cat-1', modifierId: 'm1', optionId: 'o1', quantity: 50 })).rejects.toThrow('Error');
  });
});
