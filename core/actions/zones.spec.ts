/**
 * ============================================================
 * SUITE DE PRUEBAS: zonesApi
 * ============================================================
 *
 * QUÉ estamos probando:
 * El objeto zonesApi con sus métodos: getAll, getById.
 *
 * POR QUÉ importa:
 * Las zonas agrupan las mesas del restaurante (Interior, Terraza,
 * Bar, etc.). Son necesarias para la organización visual y el
 * filtrado de mesas.
 */

import { zonesApi } from './zones';

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

describe('zonesApi', () => {
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
   * PRUEBA: getAll — GET /zones exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que zonesApi.getAll retorna la lista completa de zonas.
   *
   * POR QUÉ importa:
   * La app necesita las zonas para mostrar filtros y organizar
   * la vista de mesas.
   */
  it('debería obtener todas las zonas exitosamente', async () => {
    // Arrange
    const mockZones = [
      {
        id: 'zone-1',
        name: 'Interior',
        icon: 'indoor',
        _count: { tables: 10 },
      },
      {
        id: 'zone-2',
        name: 'Terraza',
        icon: 'outdoor',
        _count: { tables: 6 },
      },
      {
        id: 'zone-3',
        name: 'Bar',
        icon: 'bar',
        _count: { tables: 4 },
      },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockZones }),
    });

    // Act
    const result = await zonesApi.getAll();

    // Assert
    expect(result).toEqual(mockZones);
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Interior');
    expect(result[0]._count?.tables).toBe(10);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/zones',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getAll — Error al obtener zonas
   * ============================================================
   */
  it('debería lanzar error al fallar la obtención de todas las zonas', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        message: 'Error al obtener zonas',
      }),
    });

    // Act & Assert
    await expect(zonesApi.getAll()).rejects.toThrow('Error al obtener zonas');
  });

  /**
   * ============================================================
   * PRUEBA: getById — GET /zones/:id exitoso
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que zonesApi.getById obtiene una zona específica por su ID.
   */
  it('debería obtener una zona por ID exitosamente', async () => {
    // Arrange
    const mockZone = {
      id: 'zone-1',
      name: 'Interior',
      icon: 'indoor',
      _count: { tables: 10 },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockZone }),
    });

    // Act
    const result = await zonesApi.getById('zone-1');

    // Assert
    expect(result).toEqual(mockZone);
    expect(result.name).toBe('Interior');
    expect(result.icon).toBe('indoor');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/zones/zone-1',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: getById — Error cuando la zona no existe
   * ============================================================
   */
  it('debería lanzar error cuando la zona no existe', async () => {
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
    await expect(zonesApi.getById('nonexistent')).rejects.toThrow('Zone not found');
  });
});
