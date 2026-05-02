/**
 * ============================================================
 * SUITE DE PRUEBAS: adminProductsApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los actions de productos del panel de administración.
 *
 * POR QUÉ importa:
 * Estos actions gestionan el CRUD completo de productos,
 * incluyendo subida de imágenes con FormData y control de stock.
 */

import { adminProductsApi } from './products';

describe('adminProductsApi', () => {
  const mockProduct = {
    id: 'prod-1',
    name: 'Cerveza Artesanal',
    description: 'Cerveza IPA local',
    price: 8.5,
    categoryId: 'cat-1',
    image: 'https://example.com/image.jpg',
    imageId: 'img-1',
    stock: 50,
    available: true,
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
    const result = await adminProductsApi.getByCategory('cat-1');

    // Assert
    expect(result).toEqual([mockProduct]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/categories/cat-1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería obtener un producto por ID', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockProduct,
          message: 'Product retrieved',
        }),
    });

    // Act
    const result = await adminProductsApi.getById('prod-1');

    // Assert
    expect(result).toEqual(mockProduct);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/prod-1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería crear un producto sin imagen', async () => {
    // Arrange
    const createInput = {
      name: 'Nuevo Producto',
      price: 12.0,
      categoryId: 'cat-1',
      stock: 30,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockProduct, id: 'prod-2', ...createInput },
          message: 'Product created',
        }),
    });

    // Act
    const result = await adminProductsApi.create(createInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Nuevo Producto');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería crear un producto con imagen (FormData)', async () => {
    // Arrange
    const createInput = {
      name: 'Producto con Imagen',
      price: 15.0,
      categoryId: 'cat-1',
      imageFile: {
        uri: 'file:///path/to/image.jpg',
        name: 'photo.jpg',
        type: 'image/jpeg',
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockProduct, name: 'Producto con Imagen' },
          message: 'Product created',
        }),
    });

    // Act
    const result = await adminProductsApi.create(createInput);

    // Assert
    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería actualizar un producto sin imagen', async () => {
    // Arrange
    const updateInput = { name: 'Producto Actualizado', price: 10.0 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockProduct, ...updateInput },
          message: 'Product updated',
        }),
    });

    // Act
    const result = await adminProductsApi.update('prod-1', updateInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Producto Actualizado');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/prod-1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería actualizar un producto con imagen (FormData)', async () => {
    // Arrange
    const updateInput = {
      name: 'Producto con Nueva Imagen',
      imageFile: {
        uri: 'file:///path/to/new-image.jpg',
        name: 'new-photo.jpg',
        type: 'image/jpeg',
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockProduct, name: 'Producto con Nueva Imagen' },
          message: 'Product updated',
        }),
    });

    // Act
    const result = await adminProductsApi.update('prod-1', updateInput);

    // Assert
    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/prod-1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería alternar el estado de un producto', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockProduct, available: false },
          message: 'Product status toggled',
        }),
    });

    // Act
    const result = await adminProductsApi.toggleStatus('prod-1', false);

    // Assert
    expect(result.available).toBe(false);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/prod-1/status'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería reabastecer un producto', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockProduct, stock: 100 },
          message: 'Product restocked',
        }),
    });

    // Act
    const result = await adminProductsApi.restock('prod-1', 50);

    // Assert
    expect(result.stock).toBe(100);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/prod-1/restock'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería reabastecer todos los productos', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { restocked: 25 },
          message: 'All products restocked',
        }),
    });

    // Act
    const result = await adminProductsApi.restockAll();

    // Assert
    expect(result.restocked).toBe(25);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/restock-all'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería reabastecer todos los productos de una categoría', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { restocked: 10 },
          message: 'Category products restocked',
        }),
    });

    // Act
    const result = await adminProductsApi.restockAll('cat-1');

    // Assert
    expect(result.restocked).toBe(10);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/restock-all'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería eliminar un producto', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockProduct,
          message: 'Product deleted',
        }),
    });

    // Act
    const result = await adminProductsApi.delete('prod-1');

    // Assert
    expect(result).toEqual(mockProduct);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/products/prod-1'),
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
    await expect(adminProductsApi.getByCategory('cat-1')).rejects.toThrow('Internal server error');
  });

  it('debería lanzar error cuando getById falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Product not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminProductsApi.getById('nonexistent')).rejects.toThrow('Product not found');
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
          errors: ['Name is required', 'Price must be positive'],
        }),
    });

    // Act & Assert
    await expect(adminProductsApi.create({ name: '', price: -1, categoryId: 'cat-1' })).rejects.toThrow(
      'Validation failed - Name is required, Price must be positive',
    );
  });

  it('debería lanzar error cuando update falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Product not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminProductsApi.update('nonexistent', { name: 'Test' })).rejects.toThrow(
      'Product not found',
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
    await expect(adminProductsApi.toggleStatus('prod-1', true)).rejects.toThrow('Server error');
  });

  it('debería lanzar error cuando restock falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Invalid quantity',
          statusCode: 400,
        }),
    });

    // Act & Assert
    await expect(adminProductsApi.restock('prod-1', -5)).rejects.toThrow('Invalid quantity');
  });

  it('debería lanzar error cuando restockAll falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Restock failed',
          statusCode: 500,
        }),
    });

    // Act & Assert
    await expect(adminProductsApi.restockAll()).rejects.toThrow('Restock failed');
  });

  it('debería lanzar error cuando delete falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Product not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminProductsApi.delete('nonexistent')).rejects.toThrow('Product not found');
  });
});
