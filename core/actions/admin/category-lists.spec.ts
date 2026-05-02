/**
 * ============================================================
 * SUITE DE PRUEBAS: categoryListsApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los actions de listas de modificadores por categoría.
 *
 * POR QUÉ importa:
 * Estos actions gestionan los modificadores (extras, opciones)
 * que se aplican a los productos de cada categoría.
 */

import { categoryListsApi } from './category-lists';

describe('categoryListsApi', () => {
  const mockModifier = {
    id: 'mod-1',
    name: 'Tamaño',
    required: true,
    multiple: false,
    affectsKitchen: false,
    options: [
      { id: 'opt-1', name: 'Pequeño', priceExtra: 0, stock: 100 },
      { id: 'opt-2', name: 'Grande', priceExtra: 2.5, stock: 50 },
    ],
  };

  const mockCategoryWithModifiers = {
    id: 'cat-1',
    name: 'Bebidas',
    productsCount: 5,
    enabled: true,
    modifiers: [mockModifier],
  };

  const mockOption = {
    id: 'opt-3',
    name: 'Mediano',
    priceExtra: 1.0,
    stock: 75,
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

  it('debería obtener los modificadores de una categoría', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockCategoryWithModifiers,
          message: 'Modifiers retrieved',
        }),
    });

    // Act
    const result = await categoryListsApi.getByCategory('cat-1');

    // Assert
    expect(result).toEqual(mockCategoryWithModifiers);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería crear un nuevo modificador', async () => {
    // Arrange
    const createInput = {
      name: 'Extras',
      required: false,
      multiple: true,
      affectsKitchen: true,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockModifier, id: 'mod-2', ...createInput, options: [] },
          message: 'Modifier created',
        }),
    });

    // Act
    const result = await categoryListsApi.createModifier('cat-1', createInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Extras');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería actualizar un modificador', async () => {
    // Arrange
    const updateInput = { name: 'Tamaño Actualizado' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockModifier, ...updateInput },
          message: 'Modifier updated',
        }),
    });

    // Act
    const result = await categoryListsApi.updateModifier('cat-1', 'mod-1', updateInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Tamaño Actualizado');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists/mod-1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería eliminar un modificador', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockModifier,
          message: 'Modifier deleted',
        }),
    });

    // Act
    const result = await categoryListsApi.deleteModifier('cat-1', 'mod-1');

    // Assert
    expect(result).toEqual(mockModifier);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists/mod-1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('debería agregar una opción a un modificador', async () => {
    // Arrange
    const optionInput = { name: 'Mediano', priceExtra: 1.0, stock: 75 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockOption,
          message: 'Option added',
        }),
    });

    // Act
    const result = await categoryListsApi.addModifierOption('cat-1', 'mod-1', optionInput);

    // Assert
    expect(result).toEqual(mockOption);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists/mod-1/options'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería reabastecer una opción de modificador', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockOption, stock: 150 },
          message: 'Option restocked',
        }),
    });

    // Act
    const result = await categoryListsApi.restockModifierOption('cat-1', 'mod-1', 'opt-1', 100);

    // Assert
    expect(result.stock).toBe(150);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists/mod-1/options/opt-1/restock'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería eliminar una opción de modificador', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockOption,
          message: 'Option deleted',
        }),
    });

    // Act
    const result = await categoryListsApi.deleteModifierOption('cat-1', 'mod-1', 'opt-1');

    // Assert
    expect(result).toEqual(mockOption);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/lists/mod-1/options/opt-1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('debería lanzar error cuando getByCategory falla', async () => {
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
    await expect(categoryListsApi.getByCategory('cat-1')).rejects.toThrow('Internal server error');
  });

  it('debería lanzar error cuando createModifier falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Validation failed',
          errors: ['Name is required'],
        }),
    });

    // Act & Assert
    await expect(
      categoryListsApi.createModifier('cat-1', { name: '', required: false, multiple: false, affectsKitchen: false }),
    ).rejects.toThrow('Validation failed - Name is required');
  });

  it('debería lanzar error cuando updateModifier falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Modifier not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(
      categoryListsApi.updateModifier('cat-1', 'nonexistent', { name: 'Test' }),
    ).rejects.toThrow('Modifier not found');
  });

  it('debería lanzar error cuando deleteModifier falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Modifier not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(categoryListsApi.deleteModifier('cat-1', 'nonexistent')).rejects.toThrow(
      'Modifier not found',
    );
  });

  it('debería lanzar error cuando addModifierOption falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Validation failed',
          statusCode: 400,
        }),
    });

    // Act & Assert
    await expect(
      categoryListsApi.addModifierOption('cat-1', 'mod-1', { name: '', priceExtra: 0 }),
    ).rejects.toThrow('Validation failed');
  });

  it('debería lanzar error cuando restockModifierOption falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Server error',
          statusCode: 500,
        }),
    });

    // Act & Assert
    await expect(
      categoryListsApi.restockModifierOption('cat-1', 'mod-1', 'opt-1', 50),
    ).rejects.toThrow('Server error');
  });

  it('debería lanzar error cuando deleteModifierOption falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Option not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(
      categoryListsApi.deleteModifierOption('cat-1', 'mod-1', 'nonexistent'),
    ).rejects.toThrow('Option not found');
  });
});
