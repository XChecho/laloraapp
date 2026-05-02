/**
 * ============================================================
 * SUITE DE PRUEBAS: menuCategoriesApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * El action de categorías del menú público.
 *
 * POR QUÉ importa:
 * Este action es el punto de entrada para que los clientes
 * vean las categorías disponibles en el menú.
 */

import { menuCategoriesApi } from './categories';

describe('menuCategoriesApi', () => {
  const mockCategory = {
    id: 'cat-1',
    name: 'Bebidas',
    description: 'Categoría de bebidas',
    icon: '🍹',
    active: true,
    itemsCount: 5,
    displayOrder: 1,
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

  it('debería listar todas las categorías del menú', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [mockCategory],
          message: 'Categories retrieved',
        }),
    });

    // Act
    const result = await menuCategoriesApi.getAll();

    // Assert
    expect(result).toEqual([mockCategory]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/categories'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería lanzar error cuando getAll falla', async () => {
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
    await expect(menuCategoriesApi.getAll()).rejects.toThrow('Internal server error');
  });
});
