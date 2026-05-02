/**
 * ============================================================
 * SUITE DE PRUEBAS: adminZonesApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * Los actions de zonas del panel de administración.
 *
 * POR QUÉ importa:
 * Estos actions gestionan las zonas del restaurante y la
 * relación con las mesas asignadas a cada zona.
 */

import { adminZonesApi } from './zones';

describe('adminZonesApi', () => {
  const mockZone = {
    id: 'zone-1',
    name: 'Interior',
    icon: '🏠',
    tables: [
      {
        id: 'table-1',
        name: 'Mesa 1',
        capacity: 4,
        zoneId: 'zone-1',
        status: 'AVAILABLE' as const,
      },
    ],
    _count: { tables: 1 },
  };

  const mockTable = {
    id: 'table-2',
    name: 'Mesa 2',
    capacity: 6,
    zoneId: 'zone-1',
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

  it('debería listar todas las zonas', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [mockZone],
          message: 'Zones retrieved',
        }),
    });

    // Act
    const result = await adminZonesApi.getAll();

    // Assert
    expect(result).toEqual([mockZone]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería obtener una zona por ID', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockZone,
          message: 'Zone retrieved',
        }),
    });

    // Act
    const result = await adminZonesApi.getById('zone-1');

    // Assert
    expect(result).toEqual(mockZone);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('debería crear una nueva zona', async () => {
    // Arrange
    const createInput = { name: 'Terraza', icon: '☀️' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockZone, id: 'zone-2', ...createInput, tables: [] },
          message: 'Zone created',
        }),
    });

    // Act
    const result = await adminZonesApi.create(createInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Terraza');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería actualizar una zona', async () => {
    // Arrange
    const updateInput = { name: 'Interior Actualizado' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockZone, ...updateInput },
          message: 'Zone updated',
        }),
    });

    // Act
    const result = await adminZonesApi.update('zone-1', updateInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Interior Actualizado');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('debería eliminar una zona', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: null,
          message: 'Zone deleted',
        }),
    });

    // Act
    const result = await adminZonesApi.delete('zone-1');

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('debería agregar múltiples mesas a una zona', async () => {
    // Arrange
    const addTablesInput = { quantity: 5 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockZone, _count: { tables: 6 } },
          message: 'Tables added',
        }),
    });

    // Act
    const result = await adminZonesApi.addTables('zone-1', addTablesInput);

    // Assert
    expect(result._count?.tables).toBe(6);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1/tables'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería agregar una mesa individual a una zona', async () => {
    // Arrange
    const addTableInput = { name: 'Mesa Nueva', capacity: 4 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockTable, name: 'Mesa Nueva', capacity: 4 },
          message: 'Table added',
        }),
    });

    // Act
    const result = await adminZonesApi.addTable('zone-1', addTableInput);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe('Mesa Nueva');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1/table'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('debería eliminar una mesa de una zona', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: null,
          message: 'Table removed',
        }),
    });

    // Act
    const result = await adminZonesApi.removeTable('zone-1', 'table-1');

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1/tables/table-1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('debería actualizar el estado de una mesa en una zona', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...mockTable, status: 'RESERVED' },
          message: 'Table status updated',
        }),
    });

    // Act
    const result = await adminZonesApi.updateTableStatus('zone-1', 'table-1', 'RESERVED');

    // Assert
    expect(result.status).toBe('RESERVED');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/zones/zone-1/tables/table-1/status'),
      expect.objectContaining({ method: 'PUT' }),
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
    await expect(adminZonesApi.getAll()).rejects.toThrow('Internal server error');
  });

  it('debería lanzar error cuando getById falla', async () => {
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
    await expect(adminZonesApi.getById('nonexistent')).rejects.toThrow('Zone not found');
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
    await expect(adminZonesApi.create({ name: '' })).rejects.toThrow(
      'Validation failed - Name is required',
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
          message: 'Zone not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminZonesApi.update('nonexistent', { name: 'Test' })).rejects.toThrow(
      'Zone not found',
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
          message: 'Zone not found',
          statusCode: 404,
        }),
    });

    // Act & Assert
    await expect(adminZonesApi.delete('nonexistent')).rejects.toThrow('Zone not found');
  });

  it('debería lanzar error cuando addTables falla', async () => {
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
    await expect(adminZonesApi.addTables('zone-1', { quantity: 0 })).rejects.toThrow(
      'Invalid quantity',
    );
  });

  it('debería lanzar error cuando addTable falla', async () => {
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
    await expect(adminZonesApi.addTable('nonexistent')).rejects.toThrow('Zone not found');
  });

  it('debería lanzar error cuando removeTable falla', async () => {
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
    await expect(adminZonesApi.removeTable('zone-1', 'nonexistent')).rejects.toThrow(
      'Table not found',
    );
  });

  it('debería lanzar error cuando updateTableStatus falla', async () => {
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
    await expect(
      adminZonesApi.updateTableStatus('zone-1', 'table-1', 'INVALID' as any),
    ).rejects.toThrow('Invalid status');
  });
});
