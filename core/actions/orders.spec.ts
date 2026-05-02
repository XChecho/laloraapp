/**
 * ============================================================
 * SUITE DE PRUEBAS: ordersApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * El objeto ordersApi con sus métodos: create, getById, addItems,
 * updateStatus, cancel, getActiveByTable.
 *
 * POR QUÉ importa:
 * Las órdenes son el núcleo del negocio del restaurante. Cada
 * método debe comunicarse correctamente con el backend y manejar
 * errores apropiadamente.
 *
 * CÓMO funciona el mocking:
 * - ordersApi usa fetchGeneral internamente.
 * - Mockamos SecureStorageAdapter para tokens.
 * - Mockamos refreshTokenAction para el flujo de 401.
 * - Mockamos global.fetch para simular respuestas HTTP.
 */

import { ordersApi } from './orders';

// Mock del módulo de refresh
jest.mock('./auth/refreshToken.action', () => ({
  refreshTokenAction: jest.fn(),
}));

// Mock de SecureStorageAdapter
jest.mock('@core/adapters/secure-storage.adapter', () => ({
  SecureStorageAdapter: {
    getItem: jest.fn(async (key: string) => {
      if (key === 'token') return 'fake-token';
      if (key === 'refreshToken') return 'fake-refresh-token';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('ordersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
    process.env.EXPO_PUBLIC_API_URL = 'https://api.test.com';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: create — POST /orders exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que ordersApi.create envía los datos de la nueva orden
   * y retorna la orden creada.
   *
   * POR QUÉ importa:
   * Crear órdenes es la operación principal del restaurante.
   */
  it('debería crear una orden exitosamente', async () => {
    // Arrange
    const orderData = {
      tableId: 'table-1',
      customerName: 'Mesa 5',
      orderType: 'LOCAL',
    };
    const mockOrder = {
      id: 'order-1',
      tableId: 'table-1',
      customerName: 'Mesa 5',
      status: 'PENDING' as const,
      orderType: 'LOCAL' as const,
      total: 0,
      items: [],
      table: null,
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ success: true, data: mockOrder }),
    });

    // Act
    const result = await ordersApi.create(orderData);

    // Assert
    expect(result).toEqual(mockOrder);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/orders',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: create — Error al crear orden
   * ============================================================
   */
  it('debería lanzar error al fallar la creación de orden', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        message: 'Validation failed',
        errors: ['tableId is required'],
      }),
    });

    // Act & Assert
    await expect(ordersApi.create({})).rejects.toThrow('Validation failed - tableId is required');
  });

  /**
   * ============================================================
   * PRUEBA: getById — GET /orders/:id exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que ordersApi.getById obtiene una orden por su ID.
   */
  it('debería obtener una orden por ID exitosamente', async () => {
    // Arrange
    const mockOrder = {
      id: 'order-1',
      tableId: 'table-1',
      customerName: 'Mesa 5',
      status: 'IN_PREPARATION' as const,
      orderType: 'LOCAL' as const,
      total: 45.5,
      items: [],
      table: { id: 'table-1', name: 'Mesa 5', status: 'OCCUPIED' },
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockOrder }),
    });

    // Act
    const result = await ordersApi.getById('order-1');

    // Assert
    expect(result).toEqual(mockOrder);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/orders/order-1',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getById — Error al obtener orden
   * ============================================================
   */
  it('debería lanzar error cuando la orden no existe', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        message: 'Order not found',
      }),
    });

    // Act & Assert
    await expect(ordersApi.getById('nonexistent')).rejects.toThrow('Order not found');
  });

  /**
   * ============================================================
   * PRUEBA: addItems — POST /orders/:id/items exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que ordersApi.addItems agrega items a una orden existente.
   */
  it('debería agregar items a una orden exitosamente', async () => {
    // Arrange
    const itemsData = {
      items: [
        {
          productId: 'prod-1',
          quantity: 2,
          price: 15.0,
          notes: 'Sin cebolla',
        },
      ],
    };
    const mockOrder = {
      id: 'order-1',
      tableId: 'table-1',
      customerName: 'Mesa 5',
      status: 'PENDING' as const,
      orderType: 'LOCAL' as const,
      total: 30.0,
      items: [
        {
          id: 'item-1',
          orderId: 'order-1',
          productId: 'prod-1',
          quantity: 2,
          price: 15.0,
          notes: 'Sin cebolla',
          product: { id: 'prod-1', name: 'Hamburguesa', price: 15.0 },
          modifiers: [],
          createdAt: '2026-05-01T00:00:00Z',
        },
      ],
      table: null,
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ success: true, data: mockOrder }),
    });

    // Act
    const result = await ordersApi.addItems('order-1', itemsData);

    // Assert
    expect(result).toEqual(mockOrder);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/orders/order-1/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(itemsData),
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: addItems — Error al agregar items
   * ============================================================
   */
  it('debería lanzar error al fallar la adición de items', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        message: 'Product not found',
      }),
    });

    // Act & Assert
    await expect(
      ordersApi.addItems('order-1', {
        items: [{ productId: 'invalid', quantity: 1, price: 10 }],
      }),
    ).rejects.toThrow('Product not found');
  });

  /**
   * ============================================================
   * PRUEBA: updateStatus — PUT /orders/:id/status exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que ordersApi.updateStatus cambia el estado de una orden.
   */
  it('debería actualizar el estado de una orden exitosamente', async () => {
    // Arrange
    const statusData = { status: 'CONFIRMED' };
    const mockOrder = {
      id: 'order-1',
      tableId: 'table-1',
      customerName: 'Mesa 5',
      status: 'CONFIRMED' as const,
      orderType: 'LOCAL' as const,
      total: 30.0,
      items: [],
      table: null,
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockOrder }),
    });

    // Act
    const result = await ordersApi.updateStatus('order-1', statusData);

    // Assert
    expect(result).toEqual(mockOrder);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/orders/order-1/status',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(statusData),
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: updateStatus — Error al actualizar estado
   * ============================================================
   */
  it('debería lanzar error al fallar la actualización de estado', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        message: 'Invalid status transition',
      }),
    });

    // Act & Assert
    await expect(ordersApi.updateStatus('order-1', { status: 'INVALID' })).rejects.toThrow(
      'Invalid status transition',
    );
  });

  /**
   * ============================================================
   * PRUEBA: cancel — DELETE /orders/:id exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que ordersApi.cancel elimina/cancela una orden.
   */
  it('debería cancelar una orden exitosamente', async () => {
    // Arrange
    const mockOrder = {
      id: 'order-1',
      tableId: 'table-1',
      customerName: 'Mesa 5',
      status: 'CANCELLED' as const,
      orderType: 'LOCAL' as const,
      total: 30.0,
      items: [],
      table: null,
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockOrder }),
    });

    // Act
    const result = await ordersApi.cancel('order-1');

    // Assert
    expect(result).toEqual(mockOrder);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/orders/order-1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: cancel — Error al cancelar orden
   * ============================================================
   */
  it('debería lanzar error al fallar la cancelación de orden', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        message: 'Cannot cancel a closed order',
      }),
    });

    // Act & Assert
    await expect(ordersApi.cancel('order-1')).rejects.toThrow('Cannot cancel a closed order');
  });

  /**
   * ============================================================
   * PRUEBA: getActiveByTable — GET /orders/tables/:id/orders/active exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que ordersApi.getActiveByTable obtiene las órdenes activas
   * de una mesa específica.
   */
  it('debería obtener las órdenes activas de una mesa exitosamente', async () => {
    // Arrange
    const mockOrder = {
      id: 'order-1',
      tableId: 'table-1',
      customerName: 'Mesa 5',
      status: 'PENDING' as const,
      orderType: 'LOCAL' as const,
      total: 30.0,
      items: [],
      table: { id: 'table-1', name: 'Mesa 5', status: 'OCCUPIED' },
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockOrder }),
    });

    // Act
    const result = await ordersApi.getActiveByTable('table-1');

    // Assert
    expect(result).toEqual(mockOrder);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/orders/tables/table-1/orders/active',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getActiveByTable — Error al obtener órdenes
   * ============================================================
   */
  it('debería lanzar error al fallar la obtención de órdenes activas', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        message: 'Internal server error',
      }),
    });

    // Act & Assert
    await expect(ordersApi.getActiveByTable('table-1')).rejects.toThrow('Internal server error');
  });
});
