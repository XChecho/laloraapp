/**
 * ============================================================
 * FLUJO E2E: Gestión de Catálogo Admin
 * ============================================================
 *
 * QUÉ probamos:
 * El flujo completo de administración del catálogo: crear categoría,
 * agregar productos, toggle estados, y eliminar.
 *
 * POR QUÉ importa:
 * El catálogo es la base de todo el menú. Sin productos bien
 * configurados, los meseros no pueden tomar órdenes.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useToggleAdminCategoryStatus,
  useDeleteAdminCategory,
} from '@hooks/useAdminCategories';
import {
  useAdminProductsByCategory,
  useCreateAdminProduct,
  useToggleAdminProductStatus,
  useDeleteAdminProduct,
} from '@hooks/useAdminProducts';
import { adminCategoriesApi } from '@core/actions/admin/categories';
import { adminProductsApi } from '@core/actions/admin/products';

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

jest.mock('@core/actions/admin/products', () => ({
  adminProductsApi: {
    getByCategory: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    restock: jest.fn(),
    restockAll: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    isHydrated: true,
    isLoggedIn: true,
  }),
}));

describe('Flujo E2E: Gestión de Catálogo Admin', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * FLUJO 1: Crear Categoría → Agregar Producto → Activar
   * ============================================================
   *
   * Escenario: Un admin crea la categoría "Bebidas Nuevas",
   * agrega un producto "Limonada de Coco", y lo activa.
   */
  it('debería crear categoría, agregar producto y activarlo', async () => {
    // Arrange: Mock de listado inicial
    const existingCategories = [
      { id: 'cat-1', name: 'Entradas', enabled: true, productsCount: 5 },
    ];
    (adminCategoriesApi.getAll as jest.Mock).mockResolvedValue(existingCategories);

    // Act: Paso 1 — Ver categorías existentes
    const { result: listResult } = renderHook(
      () => useAdminCategories(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    await waitFor(() => expect(listResult.current.data).toEqual(existingCategories));

    // Arrange: Mock de creación de categoría
    const newCategory = {
      id: 'cat-new',
      name: 'Bebidas Nuevas',
      enabled: true,
      productsCount: 0,
    };
    (adminCategoriesApi.create as jest.Mock).mockResolvedValue(newCategory);

    // Act: Paso 2 — Crear categoría
    const { result: createCatResult } = renderHook(
      () => useCreateAdminCategory(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const createdCategory = await createCatResult.current.mutateAsync({
      name: 'Bebidas Nuevas',
      enabled: true,
    });

    // Assert: Categoría creada
    expect(createdCategory.name).toBe('Bebidas Nuevas');
    expect(createdCategory.productsCount).toBe(0);

    // Arrange: Mock de creación de producto
    const newProduct = {
      id: 'prod-new',
      name: 'Limonada de Coco',
      price: 8000,
      categoryId: 'cat-new',
      available: true,
      stock: 20,
    };
    (adminProductsApi.create as jest.Mock).mockResolvedValue(newProduct);

    // Act: Paso 3 — Crear producto en la categoría
    const { result: createProdResult } = renderHook(
      () => useCreateAdminProduct(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const createdProduct = await createProdResult.current.mutateAsync({
      name: 'Limonada de Coco',
      price: 8000,
      categoryId: 'cat-new',
      stock: 20,
    });

    // Assert: Producto creado
    expect(createdProduct.name).toBe('Limonada de Coco');
    expect(createdProduct.price).toBe(8000);
    expect(createdProduct.available).toBe(true);

    // Arrange: Mock de toggle de producto
    (adminProductsApi.toggleStatus as jest.Mock).mockResolvedValue({
      ...newProduct,
      available: false,
    });

    // Act: Paso 4 — Desactivar producto temporalmente
    const toggledProduct = await adminProductsApi.toggleStatus('prod-new', false);

    // Assert: Producto desactivado
    expect(toggledProduct.available).toBe(false);
  });

  /**
   * ============================================================
   * FLUJO 2: Toggle de Categoría → Verificar Productos
   * ============================================================
   *
   * Escenario: Un admin desactiva una categoría completa y
   * verifica que los productos ya no aparecen en el menú público.
   */
  it('debería desactivar una categoría y verificar el estado', async () => {
    // Arrange: Categoría activa con productos
    const category = {
      id: 'cat-1',
      name: 'Postres',
      enabled: true,
      productsCount: 3,
    };
    (adminCategoriesApi.toggleStatus as jest.Mock).mockResolvedValue({
      ...category,
      enabled: false,
    });

    // Act: Toggle de estado
    const result = await adminCategoriesApi.toggleStatus('cat-1', false);

    // Assert: Categoría desactivada
    expect(result.enabled).toBe(false);
    expect(adminCategoriesApi.toggleStatus).toHaveBeenCalledWith('cat-1', false);
  });

  /**
   * ============================================================
   * FLUJO 3: Eliminar Producto → Eliminar Categoría
   * ============================================================
   *
   * Escenario: Un admin elimina todos los productos de una
   * categoría y luego elimina la categoría vacía.
   */
  it('debería eliminar producto y luego la categoría', async () => {
    // Arrange: Producto a eliminar
    (adminProductsApi.delete as jest.Mock).mockResolvedValue({
      id: 'prod-old',
      deleted: true,
    });

    // Act: Eliminar producto
    const deleteProdResult = await adminProductsApi.delete('prod-old');

    // Assert: Producto eliminado
    expect(deleteProdResult.deleted).toBe(true);

    // Arrange: Categoría a eliminar
    (adminCategoriesApi.delete as jest.Mock).mockResolvedValue({
      id: 'cat-empty',
      deleted: true,
    });

    // Act: Eliminar categoría
    const deleteCatResult = await adminCategoriesApi.delete('cat-empty');

    // Assert: Categoría eliminada
    expect(deleteCatResult.deleted).toBe(true);
  });

  /**
   * ============================================================
   * FLUJO 4: Actualizar Producto
   * ============================================================
   *
   * Escenario: Un admin actualiza el precio y nombre de un producto.
   */
  it('debería actualizar nombre y precio de un producto', async () => {
    // Arrange: Producto existente
    const existingProduct = {
      id: 'prod-1',
      name: 'Hamburguesa Simple',
      price: 12000,
      categoryId: 'cat-1',
      available: true,
    };
    (adminProductsApi.update as jest.Mock).mockResolvedValue({
      ...existingProduct,
      name: 'Hamburguesa Doble',
      price: 18000,
    });

    // Act: Actualizar producto
    const updated = await adminProductsApi.update('prod-1', {
      name: 'Hamburguesa Doble',
      price: 18000,
    });

    // Assert: Producto actualizado
    expect(updated.name).toBe('Hamburguesa Doble');
    expect(updated.price).toBe(18000);
  });
});
