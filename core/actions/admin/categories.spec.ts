/**
 * ============================================================
 * SUITE DE PRUEBAS: adminCategoriesApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los actions de categorías del panel de administración.
 *
 * POR QUÉ importa:
 * Estos actions son la capa de comunicación entre la app y el
 * backend para toda la gestión de categorías del menú.
 */

import { adminCategoriesApi } from './categories';

describe('adminCategoriesApi', () => {
  const mockCategory = {
    id: 'cat-1',
    name: 'Bebidas',
    description: 'Categoría de bebidas',
    icon: '🍹',
    enabled: true,
    productsCount: 5,
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

  it('debería listar todas las categorías', async () => {
    // Arrange: configurar mock con array de categorías
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
    const result = await adminCategoriesApi.getAll();

    // Assert
    expect(result).toEqual([mockCategory]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería obtener una categoría por ID', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockCategory,
          message: 'Category retrieved',
        }),
    });

    // Act
    const result = await adminCategoriesApi.getById('cat-1');

    // Assert
    expect(result).toEqual(mockCategory);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería crear una nueva categoría', async () => {
    // Arrange
    const createInput = {
      name: 'Postres',
      description: 'Categoría de postres',
      displayOrder: 2,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockCategory, id: 'cat-2', ...createInput },
          message: 'Category created',
        }),
    });

    // Act
    const result = await adminCategoriesApi.create(createInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Postres');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería actualizar una categoría', async () => {
    // Arrange
    const updateInput = { name: 'Bebidas Actualizadas' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockCategory, ...updateInput },
          message: 'Category updated',
        }),
    });

    // Act
    const result = await adminCategoriesApi.update('cat-1', updateInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Bebidas Actualizadas');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería alternar el estado de una categoría', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockCategory, enabled: false },
          message: 'Category status toggled',
        }),
    });

    // Act
    const result = await adminCategoriesApi.toggleStatus('cat-1', false);

    // Assert
    expect(result.enabled).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1/status'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería eliminar una categoría', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockCategory,
          message: 'Category deleted',
        }),
    });

    // Act
    const result = await adminCategoriesApi.delete('cat-1');

    // Assert
    expect(result).toEqual(mockCategory);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/categories/cat-1'),
      expect.objectContaining({ method: 'DELETE' }),
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
    await expect(adminCategoriesApi.getAll()).rejects.toThrow('Internal server error');
  });

  it('debería lanzar error cuando getById falla', async () => {
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
    await expect(adminCategoriesApi.getById('nonexistent')).rejects.toThrow('Category not found');
  });

  it('debería lanzar error cuando create falla', async () => {
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
    await expect(adminCategoriesApi.create({ name: '' })).rejects.toThrow(
      'Validation failed - Name is required',
    );
  });

  it('debería lanzar error cuando update falla', async () => {
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
    await expect(adminCategoriesApi.update('cat-1', { name: '' })).rejects.toThrow(
      'Validation failed',
    );
  });

  it('debería lanzar error cuando toggleStatus falla', async () => {
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
    await expect(adminCategoriesApi.toggleStatus('cat-1', true)).rejects.toThrow('Server error');
  });

  it('debería lanzar error cuando delete falla', async () => {
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
    await expect(adminCategoriesApi.delete('nonexistent')).rejects.toThrow('Category not found');
  });
});
