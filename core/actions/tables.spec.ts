/**
 * ============================================================
 * SUITE DE PRUEBAS: tablesApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * El objeto tablesApi con sus métodos: getAll, getById, getByZone.
 *
 * POR QUÉ importa:
 * Las mesas son fundamentales para la gestión del restaurante.
 * Los meseros y administradores necesitan ver y filtrar mesas
 * por zona para asignar órdenes correctamente.
 */

import { tablesApi } from './tables';

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

describe('tablesApi', () => {
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
   * PRUEBA: getAll — GET /tables exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que tablesApi.getAll retorna la lista completa de mesas.
   *
   * POR QUÉ importa:
   * La vista principal de mesas necesita todas las mesas para
   * mostrar su estado y ubicación.
   */
  it('debería obtener todas las mesas exitosamente', async () => {
    // Arrange
    const mockTables = [
      {
        id: 'table-1',
        name: 'Mesa 1',
        capacity: 4,
        zoneId: 'zone-1',
        zone: { id: 'zone-1', name: 'Interior', icon: 'indoor' },
        status: 'AVAILABLE' as const,
      },
      {
        id: 'table-2',
        name: 'Mesa 2',
        capacity: 2,
        zoneId: 'zone-2',
        zone: { id: 'zone-2', name: 'Terraza', icon: 'outdoor' },
        status: 'OCCUPIED' as const,
      },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockTables }),
    });

    // Act
    const result = await tablesApi.getAll();

    // Assert
    expect(result).toEqual(mockTables);
    expect(result).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/tables',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getAll — Error al obtener mesas
   * ============================================================
   */
  it('debería lanzar error al fallar la obtención de todas las mesas', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        message: 'Error al obtener mesas',
      }),
    });

    // Act & Assert
    await expect(tablesApi.getAll()).rejects.toThrow('Error al obtener mesas');
  });

  /**
   * ============================================================
   * PRUEBA: getById — GET /tables/:id exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que tablesApi.getById obtiene una mesa específica por su ID.
   */
  it('debería obtener una mesa por ID exitosamente', async () => {
    // Arrange
    const mockTable = {
      id: 'table-1',
      name: 'Mesa 1',
      capacity: 4,
      zoneId: 'zone-1',
      zone: { id: 'zone-1', name: 'Interior', icon: 'indoor' },
      status: 'AVAILABLE' as const,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockTable }),
    });

    // Act
    const result = await tablesApi.getById('table-1');

    // Assert
    expect(result).toEqual(mockTable);
    expect(result.name).toBe('Mesa 1');
    expect(result.capacity).toBe(4);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/tables/table-1',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getById — Error cuando la mesa no existe
   * ============================================================
   */
  it('debería lanzar error cuando la mesa no existe', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        message: 'Table not found',
      }),
    });

    // Act & Assert
    await expect(tablesApi.getById('nonexistent')).rejects.toThrow('Table not found');
  });

  /**
   * ============================================================
   * PRUEBA: getByZone — GET /zones/:zoneId/tables exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que tablesApi.getByZone filtra las mesas por zona.
   *
   * POR QUÉ importa:
   * Permite al usuario ver solo las mesas de una zona específica
   * (Interior, Terraza, Bar, etc.).
   */
  it('debería obtener las mesas de una zona exitosamente', async () => {
    // Arrange
    const mockTables = [
      {
        id: 'table-1',
        name: 'Mesa 1',
        capacity: 4,
        zoneId: 'zone-1',
        zone: { id: 'zone-1', name: 'Interior', icon: 'indoor' },
        status: 'AVAILABLE' as const,
      },
      {
        id: 'table-3',
        name: 'Mesa 3',
        capacity: 6,
        zoneId: 'zone-1',
        zone: { id: 'zone-1', name: 'Interior', icon: 'indoor' },
        status: 'RESERVED' as const,
      },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockTables }),
    });

    // Act
    const result = await tablesApi.getByZone('zone-1');

    // Assert
    expect(result).toEqual(mockTables);
    expect(result).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/zones/zone-1/tables',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getByZone — Error al obtener mesas por zona
   * ============================================================
   */
  it('debería lanzar error al fallar la obtención de mesas por zona', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        message: 'Zone not found',
      }),
    });

    // Act & Assert
    await expect(tablesApi.getByZone('invalid-zone')).rejects.toThrow('Zone not found');
  });
});
