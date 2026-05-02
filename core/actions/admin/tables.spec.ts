/**
 * ============================================================
 * SUITE DE PRUEBAS: adminTablesApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los actions de mesas del panel de administración.
 *
 * POR QUÉ importa:
 * Estos actions gestionan el CRUD de mesas y su asignación
 * a zonas, así como el control de estado de cada mesa.
 */

import { adminTablesApi } from './tables';

describe('adminTablesApi', () => {
  const mockTable = {
    id: 'table-1',
    name: 'Mesa 1',
    capacity: 4,
    zoneId: 'zone-1',
    zone: {
      id: 'zone-1',
      name: 'Interior',
      icon: '🏠',
    },
    status: 'AVAILABLE' as const,
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

  it('debería listar todas las mesas', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [mockTable],
          message: 'Tables retrieved',
        }),
    });

    // Act
    const result = await adminTablesApi.getAll();

    // Assert
    expect(result).toEqual([mockTable]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería obtener una mesa por ID', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockTable,
          message: 'Table retrieved',
        }),
    });

    // Act
    const result = await adminTablesApi.getById('table-1');

    // Assert
    expect(result).toEqual(mockTable);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables/table-1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería crear una nueva mesa', async () => {
    // Arrange
    const createInput = {
      zoneId: 'zone-1',
      name: 'Mesa 5',
      capacity: 6,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockTable, id: 'table-5', ...createInput },
          message: 'Table created',
        }),
    });

    // Act
    const result = await adminTablesApi.create(createInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Mesa 5');
    expect(result.capacity).toBe(6);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería actualizar una mesa', async () => {
    // Arrange
    const updateInput = { name: 'Mesa VIP', capacity: 8 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockTable, ...updateInput },
          message: 'Table updated',
        }),
    });

    // Act
    const result = await adminTablesApi.update('table-1', updateInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Mesa VIP');
    expect(result.capacity).toBe(8);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables/table-1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería actualizar el estado de una mesa', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockTable, status: 'OCCUPIED' },
          message: 'Table status updated',
        }),
    });

    // Act
    const result = await adminTablesApi.updateStatus('table-1', 'OCCUPIED');

    // Assert
    expect(result.status).toBe('OCCUPIED');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables/table-1/status'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería eliminar una mesa', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: null,
          message: 'Table deleted',
        }),
    });

    // Act
    const result = await adminTablesApi.delete('table-1');

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables/table-1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('debería obtener mesas por zona', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [mockTable],
          message: 'Tables by zone retrieved',
        }),
    });

    // Act
    const result = await adminTablesApi.getByZone('zone-1');

    // Assert
    expect(result).toEqual([mockTable]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/tables/zone/zone-1'),
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
    await expect(adminTablesApi.getAll()).rejects.toThrow('Internal server error');
  });

  it('debería lanzar error cuando getById falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Table not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminTablesApi.getById('nonexistent')).rejects.toThrow('Table not found');
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
    await expect(
      adminTablesApi.create({ zoneId: 'zone-1', name: '', capacity: 4 }),
    ).rejects.toThrow('Validation failed - Name is required');
  });

  it('debería lanzar error cuando update falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Table not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminTablesApi.update('nonexistent', { name: 'Test' })).rejects.toThrow(
      'Table not found',
    );
  });

  it('debería lanzar error cuando updateStatus falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Invalid status',
          statusCode: 400,
        }),
    });

    // Act & Assert
    await expect(adminTablesApi.updateStatus('table-1', 'INVALID' as any)).rejects.toThrow(
      'Invalid status',
    );
  });

  it('debería lanzar error cuando delete falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Table not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminTablesApi.delete('nonexistent')).rejects.toThrow('Table not found');
  });

  it('debería lanzar error cuando getByZone falla', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          message: 'Zone not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminTablesApi.getByZone('nonexistent')).rejects.toThrow('Zone not found');
  });
});
