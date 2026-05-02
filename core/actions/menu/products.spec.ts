/**
 * ============================================================
 * SUITE DE PRUEBAS: menuProductsApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los actions de productos del menú público.
 *
 * POR QUÉ importa:
 * Estos actions permiten a los clientes ver los productos
 * disponibles por categoría o todos los productos con sus
 * categorías y modificadores.
 */

import { menuProductsApi } from './products';

describe('menuProductsApi', () => {
  const mockProduct = {
    id: 'prod-1',
    name: 'Cerveza Artesanal',
    description: 'Cerveza IPA local',
    price: 8.5,
    categoryId: 'cat-1',
    image: 'https://example.com/image.jpg',
    available: true,
  };

  const mockCategoryWithProducts = {
    id: 'cat-1',
    name: 'Bebidas',
    description: 'Categoría de bebidas',
    icon: '🍹',
    active: true,
    itemsCount: 1,
    displayOrder: 1,
    modifierLists: [],
    products: [mockProduct],
  };

  beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {},
            message: 'Operation successful',
          }),
      }) as Promise<Response>,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería obtener productos por categoría', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [mockProduct],
          message: 'Products retrieved',
        }),
    });

    // Act
    const result = await menuProductsApi.getByCategory('cat-1');

    // Assert
    expect(result).toEqual([mockProduct]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/categories/cat-1/products'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería obtener todas las categorías con productos', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [mockCategoryWithProducts],
          message: 'All categories with products retrieved',
        }),
    });

    // Act
    const result = await menuProductsApi.getAllWithProducts();

    // Assert
    expect(result).toEqual([mockCategoryWithProducts]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/categories/all-products'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería lanzar error cuando getByCategory falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Category not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(menuProductsApi.getByCategory('nonexistent')).rejects.toThrow('Category not found');
  });

  it('debería lanzar error cuando getAllWithProducts falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Internal server error',
          statusCode: 500,
        }),
    });

    // Act & Assert
    await expect(menuProductsApi.getAllWithProducts()).rejects.toThrow('Internal server error');
  });
});
